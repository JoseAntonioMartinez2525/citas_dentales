<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Service;
use Carbon\Carbon;
use Carbon\CarbonInterface;

class AppointmentAvailability
{
    /** @return array<int, array{value: string, label: string}> */
    public function slots(Service $service, string $date): array
    {
        $day = Carbon::createFromFormat('!Y-m-d', $date, config('app.timezone'));
        $hours = config('clinic.opening_hours.'.$day->dayOfWeekIso);

        if ($hours === null) {
            return [];
        }

        $opensAt = $day->copy()->setTimeFromTimeString($hours['opens']);
        $closesAt = $day->copy()->setTimeFromTimeString($hours['closes']);
        $bookedAppointments = Appointment::query()
            ->whereDate('starts_at', $date)
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

    public function isAvailable(Service $service, CarbonInterface $startsAt): bool
    {
        return collect($this->slots($service, $startsAt->toDateString()))
            ->contains(fn (array $slot): bool => $slot['value'] === $startsAt->format('Y-m-d\\TH:i'));
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
