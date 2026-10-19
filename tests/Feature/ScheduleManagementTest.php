<?php

namespace Tests\Feature;

use App\Models\Dentist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ScheduleManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_administrator_can_add_a_dentist_and_set_weekly_hours(): void
    {
        $this->actingAs(User::factory()->administrator()->create());

        $this->post('/admin/dentists', ['name' => 'Dra. Elena Vega'])
            ->assertRedirect(route('admin.schedules.index'));

        $dentist = Dentist::query()->where('name', 'Dra. Elena Vega')->firstOrFail();
        $schedules = collect(range(1, 7))->map(fn (int $weekday): array => [
            'weekday' => $weekday,
            'is_open' => $weekday <= 5,
            'opens_at' => '08:30',
            'closes_at' => '17:30',
        ])->all();

        $this->put("/admin/dentists/{$dentist->id}/schedules", ['schedules' => $schedules])
            ->assertRedirect(route('admin.schedules.index'));

        $this->assertDatabaseCount('schedules', 10);
        $this->assertDatabaseHas('schedules', [
            'dentist_id' => $dentist->id,
            'weekday' => 1,
            'opens_at' => '08:30',
            'closes_at' => '17:30',
        ]);
        $this->assertDatabaseMissing('schedules', [
            'dentist_id' => $dentist->id,
            'weekday' => 6,
        ]);
    }

    public function test_schedule_rejects_a_closing_time_before_opening(): void
    {
        $dentist = Dentist::factory()->create();
        $schedules = collect(range(1, 7))->map(fn (int $weekday): array => [
            'weekday' => $weekday,
            'is_open' => $weekday === 1,
            'opens_at' => $weekday === 1 ? '17:00' : '08:00',
            'closes_at' => $weekday === 1 ? '09:00' : '18:00',
        ])->all();

        $this->actingAs(User::factory()->administrator()->create())
            ->from('/admin/schedules')
            ->put("/admin/dentists/{$dentist->id}/schedules", ['schedules' => $schedules])
            ->assertSessionHasErrors('schedules.0.closes_at');

        $this->assertDatabaseMissing('schedules', ['dentist_id' => $dentist->id]);
    }

    public function test_guest_is_redirected_from_schedule_management(): void
    {
        $this->get('/admin/schedules')->assertRedirect(route('login'));
    }

    public function test_schedule_management_page_shows_registered_dentists(): void
    {
        $dentist = Dentist::factory()->create(['name' => 'Dra. Elena Vega']);

        $this->actingAs(User::factory()->administrator()->create())
            ->get('/admin/schedules')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Schedules/Index')
                ->where('dentists.0.name', 'Dra. Elena Vega'));

        $this->assertSame('Dra. Elena Vega', $dentist->name);
    }
}
