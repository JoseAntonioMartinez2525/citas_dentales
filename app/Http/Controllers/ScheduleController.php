<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDentistRequest;
use App\Http\Requests\UpdateDentistRequest;
use App\Http\Requests\UpdateSchedulesRequest;
use App\Models\Dentist;
use App\Models\Schedule;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        $dentists = Dentist::query()
            ->with(['schedules' => fn ($query) => $query->orderBy('weekday')])
            ->orderBy('name')
            ->get(['id', 'name', 'is_active']);

        return Inertia::render('Admin/Schedules/Index', [
            'dentists' => $dentists,
        ]);
    }

    public function storeDentist(StoreDentistRequest $request): RedirectResponse
    {
        Dentist::query()->create($request->validated());

        return to_route('admin.schedules.index')
            ->with('success', 'Odontólogo agregado. Configura sus días y horarios de atención.');
    }

    public function updateDentist(UpdateDentistRequest $request, Dentist $dentist): RedirectResponse
    {
        $dentist->update($request->validated());

        return to_route('admin.schedules.index')
            ->with('success', 'Odontólogo actualizado.');
    }

    public function updateSchedules(UpdateSchedulesRequest $request, Dentist $dentist): RedirectResponse
    {
        DB::transaction(function () use ($request, $dentist): void {
            foreach ($request->validated('schedules') as $scheduleData) {
                if (! $scheduleData['is_open']) {
                    Schedule::query()
                        ->where('dentist_id', $dentist->id)
                        ->where('weekday', $scheduleData['weekday'])
                        ->delete();

                    continue;
                }

                Schedule::query()->updateOrCreate(
                    [
                        'dentist_id' => $dentist->id,
                        'weekday' => $scheduleData['weekday'],
                    ],
                    [
                        'opens_at' => $scheduleData['opens_at'],
                        'closes_at' => $scheduleData['closes_at'],
                    ],
                );
            }
        });

        return to_route('admin.schedules.index')
            ->with('success', 'Horarios de atención actualizados.');
    }
}
