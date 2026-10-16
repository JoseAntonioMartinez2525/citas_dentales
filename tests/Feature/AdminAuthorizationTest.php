<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_from_admin_routes(): void
    {
        $this->get('/admin')->assertRedirect(route('login'));
        $this->get('/admin/patients')->assertRedirect(route('login'));
    }

    public function test_authenticated_non_administrator_is_forbidden_from_admin_panel(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_administrator_can_open_panel_after_login(): void
    {
        User::factory()->administrator()->create(['email' => 'admin@example.test']);

        $this->post('/login', [
            'email' => 'admin@example.test',
            'password' => 'password',
        ])->assertRedirect(route('admin.dashboard'));

        $this->assertAuthenticated();
        $this->get('/admin')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Dashboard'));
    }

    public function test_non_administrator_cannot_sign_in_to_admin_panel(): void
    {
        User::factory()->create(['email' => 'patient@example.test']);

        $this->from('/login')->post('/login', [
            'email' => 'patient@example.test',
            'password' => 'password',
        ])->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_authenticated_administrator_visiting_login_is_redirected_to_panel(): void
    {
        $administrator = User::factory()->administrator()->create();

        $this->actingAs($administrator)
            ->get('/login')
            ->assertRedirect(route('admin.dashboard'));
    }
}
