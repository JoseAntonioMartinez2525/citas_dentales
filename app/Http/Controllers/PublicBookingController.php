<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePublicAppointmentRequest;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\PatientPortalAccess;
use App\Models\Service;
use App\Services\AppointmentAvailability;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class PublicBookingController extends Controller
{
    public function create(Request $request, AppointmentAvailability $availability): Response
    {
        $validated = $request->validate([
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);
        $services = Service::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'description', 'duration_minutes', 'buffer_minutes', 'requires_assessment']);
        $selectedService = $services->firstWhere('id', (int) ($validated['service_id'] ?? 0));

        if ($selectedService?->requires_assessment) {
            $selectedService = null;
        }

        $date = $validated['date'] ?? now()->addDay()->toDateString();

        return Inertia::render('Booking/Create', [
            'services' => $services,
            'selectedServiceId' => $selectedService?->id,
            'date' => $date,
            'minimumDate' => now()->addHours(config('clinic.minimum_advance_hours'))->toDateString(),
            'slots' => $selectedService ? $availability->slots($selectedService, $date) : [],
            'patientPortalUrl' => $request->session()->get('booking_patient_id') && is_string($request->session()->get('booking_portal_token'))
                ? URL::to('/mis-citas/' . $request->session()->get('booking_portal_token'))
                : null,
        ]);
    }

    public function store(StorePublicAppointmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $service = Service::query()->where('is_active', true)->findOrFail($validated['service_id']);
        $startsAt = Carbon::createFromFormat('Y-m-d\\TH:i', $validated['starts_at'], config('app.timezone'));
        $patient = Patient::query()->find($request->session()->get('booking_patient_id'));

        if (!$patient || $patient->phone !== $validated['phone']) {
            $patient = Patient::query()->create([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
                'email' => $validated['email'] ?? null,
            ]);
            $request->session()->put('booking_patient_id', $patient->id);
        } else {
            $patient->update([
                'name' => $validated['name'],
                'email' => $validated['email'] ?? null,
            ]);
        }

        $portalToken = $request->session()->get('booking_portal_token');
        $portalAccess = PatientPortalAccess::query()->where('patient_id', $patient->id)->first();
        $portalTokenHash = is_string($portalToken) ? hash('sha256', $portalToken) : null;

        if (!$portalAccess || !$portalTokenHash || !hash_equals($portalAccess->token_hash, $portalTokenHash)) {
            $portalToken = Str::random(64);
            PatientPortalAccess::query()->updateOrCreate(
                ['patient_id' => $patient->id],
                ['token_hash' => hash('sha256', $portalToken)],
            );
            $request->session()->put('booking_portal_token', $portalToken);
        }

        $appointment = Appointment::query()->create([
            'patient_id' => $patient->id,
            'service_id' => $service->id,
            'dentist_name' => 'Equipo dental',
            'service_name' => $service->name,
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addMinutes($service->duration_minutes),
            'duration_minutes' => $service->duration_minutes,
            'buffer_minutes' => $service->buffer_minutes,
            'status' => 'scheduled',
        ]);

        $request->session()->flash('booking_summary', [
            'reference' => 'CDT-' . str_pad((string) $appointment->id, 6, '0', STR_PAD_LEFT),
            'service' => $service->name,
            'starts_at' => $startsAt->format('Y-m-d H:i'),
            'patient_name' => $patient->name,
            'portal_token' => $portalToken,
        ]);

        return to_route('booking.success');
    }

    public function success(Request $request): Response|RedirectResponse
    {
        $summary = $request->session()->get('booking_summary');

        if (!$summary) {
            return to_route('booking.start');
        }

        return Inertia::render('Booking/Success', [
            'appointment' => $summary,
            'hasPatientPortal' => (bool) $request->session()->get('booking_patient_id'),
        ]);
    }
}
