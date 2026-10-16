<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Patient;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AppointmentWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_shows_appointments_for_the_selected_day(): void
    {
        $date = today()->toDateString();
        $patient = Patient::factory()->create(['name' => 'Lucia Torres']);
        Appointment::factory()->for($patient)->create([
            'starts_at' => "{$date} 10:00:00",
            'ends_at' => "{$date} 10:30:00",
        ]);

        $this->actingAs(User::factory()->administrator()->create())
            ->get('/admin?date='.$date)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->where('date', $date)
                ->has('appointments', 1)
                ->where('appointments.0.patient.name', 'Lucia Torres'));
    }

    public function test_patient_can_be_added_to_the_clinic_directory(): void
    {
        $response = $this->actingAs(User::factory()->administrator()->create())->post('/admin/patients', [
            'name' => 'Ana Morales',
            'phone' => '555-0102',
            'email' => 'ana@example.com',
            'birth_date' => '1992-04-18',
        ]);

        $response->assertRedirect(route('admin.patients.index'));
        $this->assertDatabaseHas('patients', [
            'name' => 'Ana Morales',
            'phone' => '555-0102',
        ]);
    }

    public function test_patient_requires_a_name_and_contact_number(): void
    {
        $response = $this->actingAs(User::factory()->administrator()->create())
            ->from('/admin/patients')->post('/admin/patients', [
                'name' => '',
                'phone' => '',
            ]);

        $response->assertSessionHasErrors(['name', 'phone']);
        $this->assertDatabaseCount('patients', 0);
    }

    public function test_appointment_is_saved_with_its_end_time(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 08:00:00'));
        $patient = Patient::factory()->create();

        $response = $this->actingAs(User::factory()->administrator()->create())->post('/admin/appointments', [
            'patient_id' => $patient->id,
            'dentist_name' => 'Dra. Elena Vega',
            'service_name' => 'Limpieza dental',
            'starts_at' => '2026-10-12 10:00:00',
            'duration_minutes' => 45,
        ]);

        $response->assertRedirect(route('admin.dashboard', ['date' => '2026-10-12']));
        $this->assertDatabaseHas('appointments', [
            'patient_id' => $patient->id,
            'dentist_name' => 'Dra. Elena Vega',
            'starts_at' => '2026-10-12 10:00:00',
            'ends_at' => '2026-10-12 10:45:00',
            'status' => 'scheduled',
        ]);
    }

    public function test_appointment_is_rejected_when_the_dentist_has_an_overlap(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 08:00:00'));
        $patient = Patient::factory()->create();
        Appointment::factory()->for($patient)->create([
            'dentist_name' => 'Dra. Elena Vega',
            'starts_at' => '2026-10-12 10:00:00',
            'ends_at' => '2026-10-12 10:30:00',
        ]);

        $response = $this->actingAs(User::factory()->administrator()->create())
            ->from('/admin')->post('/admin/appointments', [
                'patient_id' => $patient->id,
                'dentist_name' => 'Dra. Elena Vega',
                'service_name' => 'Revisión',
                'starts_at' => '2026-10-12 10:15:00',
                'duration_minutes' => 30,
            ]);

        $response->assertSessionHasErrors('starts_at');
        $this->assertDatabaseCount('appointments', 1);
    }

    public function test_scheduled_appointment_can_be_confirmed(): void
    {
        $appointment = Appointment::factory()->create();

        $response = $this->actingAs(User::factory()->administrator()->create())
            ->patch(route('admin.appointments.status', $appointment), [
                'status' => 'confirmed',
            ]);

        $response->assertRedirect(route('admin.dashboard', ['date' => $appointment->starts_at->toDateString()]));
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'confirmed',
        ]);
    }

    public function test_completed_appointment_cannot_be_reopened(): void
    {
        $appointment = Appointment::factory()->create(['status' => 'completed']);

        $response = $this->actingAs(User::factory()->administrator()->create())
            ->from('/admin')->patch(route('admin.appointments.status', $appointment), [
                'status' => 'confirmed',
            ]);

        $response->assertSessionHasErrors('status');
        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'completed',
        ]);
    }
}
