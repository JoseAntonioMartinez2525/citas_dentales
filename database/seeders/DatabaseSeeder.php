<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (!app()->environment(['local', 'testing'])) {
            return;
        }

        $administrator = User::query()->firstOrCreate(
            ['email' => config('clinic.demo_admin.email')],
            [
                'name' => 'Administración de demostración',
                'password' => Hash::make(config('clinic.demo_admin.password')),
            ],
        );
        $administrator->forceFill(['is_admin' => true])->save();

        $services = collect([
            [
                'name' => 'Valoración general',
                'slug' => 'valoracion-general',
                'description' => 'Primera consulta de orientación general.',
                'duration_minutes' => 30,
                'requires_assessment' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Revisión dental',
                'slug' => 'revision-dental',
                'description' => 'Revisión general de seguimiento.',
                'duration_minutes' => 30,
                'requires_assessment' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Limpieza dental',
                'slug' => 'limpieza-dental',
                'description' => 'Servicio de higiene de demostración.',
                'duration_minutes' => 45,
                'requires_assessment' => false,
                'sort_order' => 3,
            ],
            [
                'name' => 'Restauración simple',
                'slug' => 'restauracion-simple',
                'description' => 'Ejemplo de un servicio que requiere valoración previa.',
                'duration_minutes' => 60,
                'requires_assessment' => true,
                'sort_order' => 4,
            ],
        ])->map(fn(array $attributes): Service => Service::query()->updateOrCreate(
                ['slug' => $attributes['slug']],
                [...$attributes, 'buffer_minutes' => 15, 'is_active' => true],
            ));

        $patients = collect([
            ['name' => 'Paciente de prueba 01', 'phone' => '0000000001', 'email' => 'paciente01@example.test'],
            ['name' => 'Paciente de prueba 02', 'phone' => '0000000002', 'email' => 'paciente02@example.test'],
            ['name' => 'Paciente de prueba 03', 'phone' => '0000000003', 'email' => null],
        ])->map(fn(array $attributes): Patient => Patient::query()->updateOrCreate(
                ['phone' => $attributes['phone']],
                $attributes,
            ));

        $appointmentDay = now()->addDay();

        while (!array_key_exists($appointmentDay->dayOfWeekIso, config('clinic.opening_hours'))) {
            $appointmentDay->addDay();
        }

        foreach ($patients->take(2)->values() as $index => $patient) {
            $service = $services[$index];
            $startsAt = $appointmentDay->copy()->setTime(10 + ($index * 2), 0);

            Appointment::query()->firstOrCreate(
                ['patient_id' => $patient->id, 'starts_at' => $startsAt],
                [
                    'service_id' => $service->id,
                    'dentist_name' => 'Equipo dental de demostración',
                    'service_name' => $service->name,
                    'ends_at' => $startsAt->copy()->addMinutes($service->duration_minutes),
                    'duration_minutes' => $service->duration_minutes,
                    'buffer_minutes' => $service->buffer_minutes,
                    'status' => $index === 0 ? 'scheduled' : 'confirmed',
                ],
            );
        }
    }
}
