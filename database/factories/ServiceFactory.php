<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->words(2, true),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->sentence(),
            'duration_minutes' => fake()->randomElement([30, 45, 60]),
            'buffer_minutes' => 15,
            'requires_assessment' => false,
            'is_active' => true,
            'sort_order' => 1,
        ];
    }
}
