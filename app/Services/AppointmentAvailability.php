<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Dentist;
use App\Models\Schedule;
use App\Models\Service;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AppointmentAvailability
{
    /**
     * @template TResult
     *
     * @param Closure(): TResult $callback
     * @return TResult
     */
    public function withDentistScheduleLock(
        Dentist $dentist,
        CarbonInterface $startsAt,
        Closure $callback,
    ): mixed {
        $lockKey = 'appointment-dentist-'.$dentist->id.'-'.$startsAt->toDateString();

        return Cache::store('database')
            ->lock($lockKey, 30)
            ->block(10, fn (): mixed => DB::transaction($callback));
    }

    /** @return array<int, array{value: string, label: string}> */
    public function slots(Service $service, string $date, Dentist $dentist): array
    {
        $day = Carbon::createFromFormat('!Y-m-d', $date, config('app.timezone'));
        $schedule = $dentist->schedules()
            ->where('weekday', $day->dayOfWeekIso)
            ->first();

        if (! $dentist->is_active || ! $schedule) {
            return [];
        }

        $opensAt = $day->copy()->setTimeFromTimeString($schedule->opens_at);
        $closesAt = $day->copy()->setTimeFromTimeString($schedule->closes_at);
        $bookedAppointments = Appointment::query()
            ->whereDate('starts_at', $date)
            ->where('dentist_id', $dentist->id)
            ->whereIn('status', ['scheduled', 'confirmed'])
            ->get(['starts_at', 'ends_at', 'buffer_minutes']);
        $slots = [];
        $candidate = $opensAt->copy();
        $requiredMinutes = $service->duration_minutes + $service->buffer_minutes;
        $minimumStart = now()->addHours(config('clinic.minimum_advance_hours'));
        $slotInterval = (int) config('clinic.slot_interval_minutes');

        while ($candidate->copy()->addMinutes($requiredMinutes)->lte($closesAt)) {
            $endsAt = $candidate->copy()->addMinutes($service->duration_minutes);
            $blockedUntil = $endsAt->copy()->addMinutes($service->buffer_minutes);

            if ($candidate->gte($minimumStart) && ! $this->overlaps($candidate, $blockedUntil, $bookedAppointments)) {
                $slots[] = [
                    'value' => $candidate->format('Y-m-d\\TH:i'),
                    'label' => $candidate->format('H:i'),
                ];
            }

            $candidate->addMinutes($slotInterval);
        }

        return $slots;
    }

    public function isAvailable(Service $service, CarbonInterface $startsAt, Dentist $dentist): bool
    {
        return collect($this->slots($service, $startsAt->toDateString(), $dentist))
            ->contains(fn (array $slot): bool => $slot['value'] === $startsAt->format('Y-m-d\\TH:i'));
    }

    public function isAvailableForDuration(
        Dentist $dentist,
        CarbonInterface $startsAt,
        int $durationMinutes,
        int $bufferMinutes = 0,
    ): bool {
        $schedule = Schedule::query()
            ->where('dentist_id', $dentist->id)
            ->where('weekday', $startsAt->dayOfWeekIso)
            ->first();

        if (! $dentist->is_active || ! $schedule) {
            return false;
        }

        $opensAt = $startsAt->copy()->setTimeFromTimeString($schedule->opens_at);
        $closesAt = $startsAt->copy()->setTimeFromTimeString($schedule->closes_at);
        $blockedUntil = $startsAt->copy()->addMinutes($durationMinutes + $bufferMinutes);
        $minimumStart = now()->addHours(config('clinic.minimum_advance_hours'));

        if ($startsAt->lt($opensAt) || $blockedUntil->gt($closesAt) || $startsAt->lt($minimumStart)) {
            return false;
        }

        $bookedAppointments = Appointment::query()
            ->whereDate('starts_at', $startsAt->toDateString())
            ->where('dentist_id', $dentist->id)
            ->whereIn('status', ['scheduled', 'confirmed'])
            ->get(['starts_at', 'ends_at', 'buffer_minutes']);

        return ! $this->overlaps($startsAt, $blockedUntil, $bookedAppointments);
    }

    private function overlaps(CarbonInterface $candidateStart, CarbonInterface $candidateBlockedUntil, iterable $appointments): bool
    {
        foreach ($appointments as $appointment) {
            $existingStart = $appointment->starts_at;
            $existingBlockedUntil = $appointment->ends_at->copy()->addMinutes($appointment->buffer_minutes);

            if ($candidateStart->lt($existingBlockedUntil) && $candidateBlockedUntil->gt($existingStart)) {
                return true;
            }
        }

        return false;
    }
}
