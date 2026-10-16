<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentStatusRequest;
use App\Models\Appointment;
use App\Models\Dentist;
use App\Models\Patient;
use App\Services\AppointmentAvailability;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AppointmentController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);
        $date = $validated['date'] ?? today()->toDateString();

        $appointments = Appointment::query()
            ->with('patient:id,name,phone')
            ->whereDate('starts_at', $date)
            ->orderBy('starts_at')
            ->get();

        return Inertia::render('Dashboard', [
            'date' => $date,
            'appointments' => $appointments->map(fn (Appointment $appointment): array => [
                'id' => $appointment->id,
                'patient' => $appointment->patient->only(['id', 'name', 'phone']),
                'dentist_id' => $appointment->dentist_id,
                'dentist_name' => $appointment->dentist_name,
                'service_name' => $appointment->service_name,
                'starts_at' => $appointment->starts_at->format('H:i'),
                'ends_at' => $appointment->ends_at->format('H:i'),
                'duration_minutes' => $appointment->duration_minutes,
                'status' => $appointment->status,
                'notes' => $appointment->notes,
            ])->values(),
            'patients' => Patient::query()->orderBy('name')->get(['id', 'name', 'phone']),
            'dentists' => Dentist::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'stats' => [
                'total' => $appointments->count(),
                'scheduled' => $appointments->where('status', 'scheduled')->count(),
                'confirmed' => $appointments->where('status', 'confirmed')->count(),
                'completed' => $appointments->where('status', 'completed')->count(),
                'no_show' => $appointments->where('status', 'no_show')->count(),
            ],
        ]);
    }

    public function store(
        StoreAppointmentRequest $request,
        AppointmentAvailability $availability,
    ): RedirectResponse
    {
        $validated = $request->validated();
        $startsAt = Carbon::parse($validated['starts_at']);
        $dentist = Dentist::query()->where('is_active', true)->findOrFail($validated['dentist_id']);

        $availability->withDentistScheduleLock($dentist, $startsAt, function () use ($validated, $startsAt, $availability): void {
            $dentist = Dentist::query()
                ->where('is_active', true)
                ->lockForUpdate()
                ->findOrFail($validated['dentist_id']);
            $schedule = $dentist->schedules()
                ->where('weekday', $startsAt->dayOfWeekIso)
                ->lockForUpdate()
                ->first();

            if (! $schedule || ! $availability->isAvailableForDuration($dentist, $startsAt, $validated['duration_minutes'])) {
                throw ValidationException::withMessages([
                    'starts_at' => 'Ese horario ya no está disponible para el odontólogo seleccionado.',
                ]);
            }

            Appointment::query()->create([
                ...$validated,
                'dentist_name' => $dentist->name,
                'starts_at' => $startsAt,
                'ends_at' => $startsAt->copy()->addMinutes($validated['duration_minutes']),
                'status' => 'scheduled',
            ]);
        });

        return to_route('admin.dashboard', ['date' => $startsAt->toDateString()])
            ->with('success', 'La cita quedó guardada en la agenda.');
    }

    public function updateStatus(UpdateAppointmentStatusRequest $request, Appointment $appointment): RedirectResponse
    {
        $appointment->update($request->validated());

        return to_route('admin.dashboard', ['date' => $appointment->starts_at->toDateString()])
            ->with('success', 'El estado de la cita fue actualizado.');
    }
}
