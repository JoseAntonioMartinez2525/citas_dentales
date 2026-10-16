<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentStatusRequest;
use App\Models\Appointment;
use App\Models\Patient;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
                'dentist_name' => $appointment->dentist_name,
                'service_name' => $appointment->service_name,
                'starts_at' => $appointment->starts_at->format('H:i'),
                'ends_at' => $appointment->ends_at->format('H:i'),
                'duration_minutes' => $appointment->duration_minutes,
                'status' => $appointment->status,
                'notes' => $appointment->notes,
            ])->values(),
            'patients' => Patient::query()->orderBy('name')->get(['id', 'name', 'phone']),
            'stats' => [
                'total' => $appointments->count(),
                'scheduled' => $appointments->where('status', 'scheduled')->count(),
                'confirmed' => $appointments->where('status', 'confirmed')->count(),
                'completed' => $appointments->where('status', 'completed')->count(),
            ],
        ]);
    }

    public function store(StoreAppointmentRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $startsAt = Carbon::parse($validated['starts_at']);

        Appointment::create([
            ...$validated,
            'starts_at' => $startsAt,
            'ends_at' => $startsAt->copy()->addMinutes($validated['duration_minutes']),
            'status' => 'scheduled',
        ]);

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
