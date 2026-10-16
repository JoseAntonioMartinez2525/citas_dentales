<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ServiceManagementTest extends TestCase
{
    use RefreshDatabase;

    private function authenticate(): void
    {
        $this->actingAs(User::factory()->administrator()->create());
    }

    public function test_admin_can_view_services_index(): void
    {
        Service::factory()->create(['name' => 'Limpieza dental', 'is_active' => true]);
        Service::factory()->create(['name' => 'Revisión', 'is_active' => false]);

        $this->authenticate()
            ->get('/admin/services')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Services/Index')
                ->has('services', 2)
                ->where('services.0.name', 'Limpieza dental')
                ->where('services.1.name', 'Revisión'));
    }

    public function test_guest_is_redirected_from_services_index(): void
    {
        $this->get('/admin/services')->assertRedirect(route('login'));
    }

    public function test_non_admin_is_forbidden_from_services(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/services')
            ->assertForbidden();
    }

    public function test_admin_can_create_a_service(): void
    {
        $this->authenticate()
            ->post('/admin/services', [
                'name' => 'Limpieza profunda',
                'slug' => 'limpieza-profunda',
                'description' => 'Servicio de limpieza completa.',
                'duration_minutes' => 60,
                'buffer_minutes' => 15,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseHas('services', [
            'name' => 'Limpieza profunda',
            'slug' => 'limpieza-profunda',
            'duration_minutes' => 60,
            'buffer_minutes' => 15,
            'requires_assessment' => false,
            'is_active' => true,
        ]);
    }

    public function test_service_requires_a_unique_name(): void
    {
        Service::factory()->create(['name' => 'Limpieza dental']);

        $this->authenticate()
            ->post('/admin/services', [
                'name' => 'Limpieza dental',
                'slug' => 'limpieza-dental',
                'description' => 'Servicio duplicado.',
                'duration_minutes' => 45,
                'buffer_minutes' => 15,
                'is_active' => true,
            ])
            ->assertSessionHasErrors('name');

        $this->assertDatabaseCount('services', 1);
    }

    public function test_service_requires_a_unique_slug(): void
    {
        Service::factory()->create(['slug' => 'limpieza-dental']);

        $this->authenticate()
            ->post('/admin/services', [
                'name' => 'Limpieza profunda',
                'slug' => 'limpieza-dental',
                'description' => 'Servicio con slug duplicado.',
                'duration_minutes' => 60,
                'buffer_minutes' => 15,
                'is_active' => true,
            ])
            ->assertSessionHasErrors('slug');
    }

    public function test_admin_can_update_a_service(): void
    {
        $service = Service::factory()->create([
            'name' => 'Servicio original',
            'slug' => 'servicio-original',
            'duration_minutes' => 30,
            'requires_assessment' => false,
            'is_active' => true,
        ]);

        $this->authenticate()
            ->put("/admin/services/{$service->id}", [
                'name' => 'Servicio actualizado',
                'slug' => 'servicio-actualizado',
                'description' => 'Descripción actualizada.',
                'duration_minutes' => 45,
                'buffer_minutes' => 30,
                'requires_assessment' => true,
                'is_active' => false,
                'sort_order' => 2,
            ])
            ->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseHas('services', [
            'id' => $service->id,
            'name' => 'Servicio actualizado',
            'slug' => 'servicio-actualizado',
            'duration_minutes' => 45,
            'buffer_minutes' => 30,
            'requires_assessment' => true,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_delete_a_service_without_appointments(): void
    {
        $service = Service::factory()->create();

        $this->authenticate()
            ->delete("/admin/services/{$service->id}")
            ->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseMissing('services', ['id' => $service->id]);
    }

    public function test_admin_cannot_delete_a_service_with_appointments(): void
    {
        $service = Service::factory()->create();
        Appointment::factory()->create(['service_id' => $service->id]);

        $this->authenticate()
            ->delete("/admin/services/{$service->id}")
            ->assertRedirect(route('admin.services.index'))
            ->assertSessionHasErrors('service');

        $this->assertDatabaseHas('services', ['id' => $service->id]);
    }

    public function test_slug_is_auto_generated_if_not_provided_on_create(): void
    {
        $this->authenticate()
            ->post('/admin/services', [
                'name' => 'Limpieza Dental Premium',
                'slug' => '',
                'description' => 'Servicio premium.',
                'duration_minutes' => 60,
                'buffer_minutes' => 15,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.services.index'));

        $this->assertDatabaseHas('services', [
            'name' => 'Limpieza Dental Premium',
            'slug' => 'limpieza-dental-premium',
        ]);
    }

    public function test_service_requires_a_name(): void
    {
        $this->authenticate()
            ->post('/admin/services', [
                'name' => '',
                'slug' => '',
                'description' => 'Servicio sin nombre.',
                'duration_minutes' => 30,
                'buffer_minutes' => 15,
            ])
            ->assertSessionHasErrors('name');

        $this->assertDatabaseCount('services', 0);
    }

    public function test_service_requires_a_duration(): void
    {
        $this->authenticate()
            ->post('/admin/services', [
                'name' => 'Servicio sin duración',
                'slug' => 'servicio-sin-duracion',
                'description' => 'Servicio sin duración definida.',
                'buffer_minutes' => 15,
            ])
            ->assertSessionHasErrors('duration_minutes');

        $this->assertDatabaseCount('services', 0);
    }
}
