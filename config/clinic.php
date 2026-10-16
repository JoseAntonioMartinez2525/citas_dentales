<?php

return [
    'minimum_advance_hours' => 24,
    'cancellation_deadline_hours' => 24,
    'slot_interval_minutes' => 30,
    'demo_admin' => [
        'email' => env('DEMO_ADMIN_EMAIL', 'admin@clinic.test'),
        'password' => env('DEMO_ADMIN_PASSWORD', 'password'),
    ],
];
