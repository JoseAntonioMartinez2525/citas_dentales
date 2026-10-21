<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Dentist;
use App\Models\Patient;
use App\Models\Schedule;
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
        if (! app()->environment(['local', 'testing'])) {
            return;
        }

        $administrator = User::query()->firstOrCreate(
            ['email' => 'admin@clinicadental.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
            ],
        );
        $administrator->forceFill(['is_admin' => true])->save();

        // Empleados y usuarios de la clínica (según Casos-uso-usabilidad.md)
        $adminPassword = Hash::make('password');
        $userPasswords = [
            'miguel.torres@clinicadental.com' => $adminPassword,
            'roberto.mendez@clinicadental.com' => Hash::make('roberto2026'),
            'julian.ortega@clinicadental.com' => Hash::make('julian2026'),
            'carlos.ramirez@clinicadental.com' => Hash::make('carlos2026'),
            'sofia.herrera@clinicadental.com' => Hash::make('sofia2026'),
            'maria.gonzalez@clinicadental.com' => Hash::make('maria2026'),
            'ana.lopez@clinicadental.com' => Hash::make('ana2026'),
            'diego.castro@clinicadental.com' => Hash::make('diego2026'),
            'laura.fernandez@clinicadental.com' => Hash::make('laura2026'),
            'patricia.rojas@clinicadental.com' => Hash::make('patricia2026'),
        ];

        collect([
            ['name' => 'Miguel Ángel Torres', 'email' => 'miguel.torres@clinicadental.com', 'is_admin' => true],
            ['name' => 'Roberto Méndez', 'email' => 'roberto.mendez@clinicadental.com', 'is_admin' => false],
            ['name' => 'Julián Ortega', 'email' => 'julian.ortega@clinicadental.com', 'is_admin' => false],
            ['name' => 'Carlos Ramírez', 'email' => 'carlos.ramirez@clinicadental.com', 'is_admin' => false],
            ['name' => 'Sofía Herrera', 'email' => 'sofia.herrera@clinicadental.com', 'is_admin' => false],
            ['name' => 'María González', 'email' => 'maria.gonzalez@clinicadental.com', 'is_admin' => false],
            ['name' => 'Ana López', 'email' => 'ana.lopez@clinicadental.com', 'is_admin' => false],
            ['name' => 'Diego Castro', 'email' => 'diego.castro@clinicadental.com', 'is_admin' => false],
            ['name' => 'Laura Fernández', 'email' => 'laura.fernandez@clinicadental.com', 'is_admin' => false],
            ['name' => 'Patricia Rojas', 'email' => 'patricia.rojas@clinicadental.com', 'is_admin' => false],
        ])->each(fn (array $attributes) => User::query()->firstOrCreate(
            ['email' => $attributes['email']],
            [
                'name' => $attributes['name'],
                'password' => $userPasswords[$attributes['email']] ?? $adminPassword,
                'is_admin' => $attributes['is_admin'],
                'email_verified_at' => now(),
            ],
        ));

        $services = collect([
            [
                'name' => 'Valoración general',
                'slug' => 'valoracion-general',
                'description' => 'Primera consulta y evaluación dental completa.',
                'duration_minutes' => 30,
                'requires_assessment' => false,
                'sort_order' => 1,
            ],
            [
                'name' => 'Revisión dental',
                'slug' => 'revision-dental',
                'description' => 'Revisión y limpieza de rutina.',
                'duration_minutes' => 30,
                'requires_assessment' => false,
                'sort_order' => 2,
            ],
            [
                'name' => 'Limpieza dental',
                'slug' => 'limpieza-dental',
                'description' => 'Limpieza profunda de dientes.',
                'duration_minutes' => 45,
                'requires_assessment' => false,
                'sort_order' => 3,
            ],
            [
                'name' => 'Restauración simple',
                'slug' => 'restauracion-simple',
                'description' => 'Relleno dental para caries simples.',
                'duration_minutes' => 60,
                'requires_assessment' => true,
                'sort_order' => 4,
            ],
        ])->map(fn (array $attributes): Service => Service::query()->updateOrCreate(
            ['slug' => $attributes['slug']],
            [...$attributes, 'buffer_minutes' => 15, 'is_active' => true],
        ));

        // Odontólogos
        $dentists = collect([
            ['name' => 'Dr. María Rodríguez'],
            ['name' => 'Dr. Carlos Méndez'],
            ['name' => 'Dra. Ana Góngora'],
        ])->map(fn (array $attributes): Dentist => Dentist::query()->firstOrCreate(
            ['name' => $attributes['name']],
            [...$attributes, 'is_active' => true],
        ));

        // Horarios semanales (lunes a viernes, 08:00-18:00)
        $weekdays = range(1, 5);
        foreach ($dentists as $dentist) {
            foreach ($weekdays as $weekday) {
                Schedule::query()->firstOrCreate(
                    ['dentist_id' => $dentist->id, 'weekday' => $weekday],
                    [
                        'opens_at' => '08:00:00',
                        'closes_at' => '18:00:00',
                    ],
                );
            }
        }

        $patients = collect([
            ['name' => 'Paciente de prueba 01', 'phone' => '0000000001', 'email' => 'paciente01@example.test'],
            ['name' => 'Paciente de prueba 02', 'phone' => '0000000002', 'email' => 'paciente02@example.test'],
            ['name' => 'Paciente de prueba 03', 'phone' => '0000000003', 'email' => null],
        ])->map(fn (array $attributes): Patient => Patient::query()->updateOrCreate(
            ['phone' => $attributes['phone']],
            $attributes,
        ));

        $appointmentDay = now()->addDay();

        while ($appointmentDay->dayOfWeekIso < 1 || $appointmentDay->dayOfWeekIso > 5) {
            $appointmentDay->addDay();
        }

        $defaultDentist = $dentists->first();

        foreach ($patients->take(2)->values() as $index => $patient) {
            $service = $services[$index];
            $startsAt = $appointmentDay->copy()->setTime(10 + ($index * 2), 0);

            Appointment::query()->firstOrCreate(
                ['patient_id' => $patient->id, 'starts_at' => $startsAt],
                [
                    'dentist_id' => $defaultDentist->id,
                    'service_id' => $service->id,
                    'dentist_name' => $defaultDentist->name,
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
