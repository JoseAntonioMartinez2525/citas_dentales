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
            'dentist_id' => ['nullable', 'integer', 'exists:dentists,id'],
            'patient_id' => ['nullable', 'integer', 'exists:patients,id'],
        ]);
        $date = $validated['date'] ?? today()->toDateString();

        $appointments = Appointment::query()
            ->with('patient:id,name,phone')
            ->when(isset($validated['dentist_id']), fn ($query) => $query->where('dentist_id', $validated['dentist_id']))
            ->when(isset($validated['patient_id']), fn ($query) => $query->where('patient_id', $validated['patient_id']))
            ->whereDate('starts_at', $date)
            ->orderBy('starts_at')
            ->get();

        $patientName = null;
        $patientDetails = null;
        if (isset($validated['patient_id'])) {
            $patient = Patient::query()->find($validated['patient_id']);
            $patientName = $patient?->name;
            $patientDetails = $patient?->only(['id', 'name', 'phone', 'email', 'birth_date', 'notes']);
        }

        return Inertia::render('Dashboard', [
            'date' => $date,
            'selectedDentistId' => isset($validated['dentist_id']) ? (int) $validated['dentist_id'] : null,
            'selectedPatientId' => isset($validated['patient_id']) ? (int) $validated['patient_id'] : null,
            'selectedPatientName' => $patientName,
            'selectedPatientDetails' => $patientDetails,
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
    ): RedirectResponse {
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
                'ends_at' => $startsAt->copy()->addMinutes((int) $validated['duration_minutes']),
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
