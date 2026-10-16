<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\PatientPortalAccess;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

class PatientPortalController extends Controller
{
    public function index(Request $request, ?string $accessToken = null): Response|RedirectResponse
    {
        $portalAccess = null;

        if ($accessToken !== null) {
            $portalAccess = PatientPortalAccess::query()
                ->where('token_hash', hash('sha256', $accessToken))
                ->firstOrFail();

            $request->session()->put('booking_patient_id', $portalAccess->patient_id);
            $request->session()->put('booking_portal_token', $accessToken);
        } else {
            $patientId = $request->session()->get('booking_patient_id');
            $portalToken = $request->session()->get('booking_portal_token');

            if ($patientId && is_string($portalToken)) {
                $portalAccess = PatientPortalAccess::query()
                    ->where('patient_id', $patientId)
                    ->where('token_hash', hash('sha256', $portalToken))
                    ->first();
            }
        }

        $patient = $portalAccess?->patient;

        if (!$patient) {
            return to_route('booking.start')->with('error', 'Agenda una cita para abrir tu espacio de citas en este navegador.');
        }

        $appointments = $patient->appointments()
            ->orderByDesc('starts_at')
            ->get()
            ->map(fn(Appointment $appointment): array => [
                'id' => $appointment->id,
                'service_name' => $appointment->service_name,
                'starts_at' => $appointment->starts_at->format('Y-m-d H:i'),
                'duration_minutes' => $appointment->duration_minutes,
                'status' => $appointment->status,
                'can_cancel' => in_array($appointment->status, ['scheduled', 'confirmed'], true)
                    && $appointment->starts_at->gt(now()->addHours(config('clinic.cancellation_deadline_hours'))),
            ])
            ->values();

        return Inertia::render('Booking/Appointments', [
            'appointments' => $appointments,
            'cancellationDeadlineHours' => config('clinic.cancellation_deadline_hours'),
            'accessUrl' => URL::to('/mis-citas/' . $request->session()->get('booking_portal_token')),
            'flash' => ['success' => $request->session()->get('success')],
        ]);
    }

    public function cancel(Request $request, Appointment $appointment): RedirectResponse
    {
        $patient = Patient::query()->find($request->session()->get('booking_patient_id'));
        abort_unless($patient && (int) $appointment->patient_id === (int) $patient->id, 404);

        if (!in_array($appointment->status, ['scheduled', 'confirmed'], true)) {
            return to_route('patient.appointments')->withErrors([
                'appointment' => 'Esta cita ya no se puede cancelar desde el portal.',
            ]);
        }

        if ($appointment->starts_at->lte(now()->addHours(config('clinic.cancellation_deadline_hours')))) {
            return to_route('patient.appointments')->withErrors([
                'appointment' => 'Para cancelar con menos de ' . config('clinic.cancellation_deadline_hours') . ' horas, comunícate con el consultorio.',
            ]);
        }

        $appointment->update(['status' => 'cancelled']);

        return to_route('patient.appointments')->with('success', 'La cita fue cancelada y el horario volvió a estar disponible.');
    }

    public function leave(Request $request): RedirectResponse
    {
        $patientId = $request->session()->get('booking_patient_id');
        $portalToken = $request->session()->get('booking_portal_token');

        if ($patientId && is_string($portalToken)) {
            PatientPortalAccess::query()
                ->where('patient_id', $patientId)
                ->where('token_hash', hash('sha256', $portalToken))
                ->delete();
        }

        $request->session()->forget('booking_patient_id');
        $request->session()->forget('booking_portal_token');

        return to_route('booking.start')->with('success', 'Se revocó el enlace privado y se cerró el acceso a tus citas.');
    }
}
