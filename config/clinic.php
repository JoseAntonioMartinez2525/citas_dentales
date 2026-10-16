<?php

return [
    'minimum_advance_hours' => 24,
    'cancellation_deadline_hours' => 24,
    'slot_interval_minutes' => 30,
    'opening_hours' => [
        1 => ['opens' => '08:00', 'closes' => '18:00'],
        2 => ['opens' => '08:00', 'closes' => '18:00'],
        3 => ['opens' => '08:00', 'closes' => '18:00'],
        4 => ['opens' => '08:00', 'closes' => '18:00'],
        5 => ['opens' => '08:00', 'closes' => '18:00'],
    ],
    'demo_admin' => [
        'email' => env('DEMO_ADMIN_EMAIL', 'admin@clinic.test'),
        'password' => env('DEMO_ADMIN_PASSWORD', 'password'),
    ],
];
