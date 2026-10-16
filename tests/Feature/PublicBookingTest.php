<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Dentist;
use App\Models\Patient;
use App\Models\Schedule;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PublicBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_booking_page_lists_services_and_available_slots(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create(['duration_minutes' => 30, 'buffer_minutes' => 15]);

        $this->get('/?service_id=' . $service->id . '&date=2026-10-12')
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page
                ->component('Booking/Create')
                ->where('selectedServiceId', $service->id)
                ->where('slots.4.label', '10:00'));
    }

    public function test_public_booking_creates_a_fictional_patient_and_appointment(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create(['duration_minutes' => 45, 'buffer_minutes' => 15]);
        $dentist = Dentist::query()->where('name', 'Equipo dental')->firstOrFail();

        $this->post('/reservar', [
            'service_id' => $service->id,
            'dentist_id' => $dentist->id,
            'date' => '2026-10-12',
            'starts_at' => '2026-10-12T10:00',
            'name' => 'Paciente de prueba',
            'phone' => '0000000099',
            'email' => 'demo@example.test',
        ])->assertRedirect(route('booking.success'));

        $this->assertDatabaseHas('patients', [
            'name' => 'Paciente de prueba',
            'phone' => '0000000099',
            'email' => 'demo@example.test',
        ]);
        $this->assertDatabaseHas('appointments', [
            'service_id' => $service->id,
            'service_name' => $service->name,
            'starts_at' => '2026-10-12 10:00:00',
            'ends_at' => '2026-10-12 10:45:00',
            'buffer_minutes' => 15,
            'status' => 'scheduled',
        ]);
        $this->get(route('booking.success'))
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page->component('Booking/Success'));
    }

    public function test_public_booking_rejects_a_slot_blocked_by_another_appointment(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create(['duration_minutes' => 30, 'buffer_minutes' => 15]);
        $appointment = Appointment::factory()->create([
            'dentist_id' => Dentist::query()->where('name', 'Equipo dental')->value('id'),
            'starts_at' => '2026-10-12 10:00:00',
            'ends_at' => '2026-10-12 10:30:00',
            'buffer_minutes' => 15,
        ]);

        $this->from('/')->post('/reservar', [
            'service_id' => $service->id,
            'dentist_id' => Dentist::query()->where('name', 'Equipo dental')->value('id'),
            'date' => '2026-10-12',
            'starts_at' => '2026-10-12T10:30',
            'name' => 'Paciente de prueba',
            'phone' => '0000000098',
        ])->assertSessionHasErrors('starts_at');

        $this->assertDatabaseCount('appointments', 1);
        $this->assertDatabaseHas('appointments', ['id' => $appointment->id]);
    }

    public function test_public_booking_availability_is_separated_by_dentist(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create(['duration_minutes' => 30, 'buffer_minutes' => 15]);
        $firstDentist = Dentist::query()->where('name', 'Equipo dental')->firstOrFail();
        $secondDentist = Dentist::factory()->create(['name' => 'Dra. Elena Vega']);
        Schedule::query()->create([
            'dentist_id' => $secondDentist->id,
            'weekday' => 1,
            'opens_at' => '08:00',
            'closes_at' => '18:00',
        ]);
        Appointment::factory()->create([
            'dentist_id' => $firstDentist->id,
            'starts_at' => '2026-10-12 10:00:00',
            'ends_at' => '2026-10-12 10:30:00',
        ]);

        $this->get('/?service_id='.$service->id.'&dentist_id='.$secondDentist->id.'&date=2026-10-12')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('selectedDentistId', $secondDentist->id)
                ->where('slots.4.label', '10:00'));

        $this->get('/?service_id='.$service->id.'&dentist_id='.$firstDentist->id.'&date=2026-10-12')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('selectedDentistId', $firstDentist->id)
                ->where('slots.4.label', '11:30'));
    }

    public function test_public_booking_requires_an_assessment_for_restricted_services(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create(['requires_assessment' => true]);

        $this->get('/?service_id=' . $service->id . '&date=2026-10-12')
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page
                ->component('Booking/Create')
                ->where('selectedServiceId', null)
                ->where('services.0.requires_assessment', true)
                ->has('slots', 0));

        $this->from('/')->post('/reservar', [
            'service_id' => $service->id,
            'date' => '2026-10-12',
            'starts_at' => '2026-10-12T10:00',
            'name' => 'Paciente de prueba',
            'phone' => '0000000079',
        ])->assertSessionHasErrors('service_id');

        $this->assertDatabaseCount('appointments', 0);
    }

    public function test_patient_can_consult_and_cancel_their_own_appointment(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create(['duration_minutes' => 30, 'buffer_minutes' => 15]);
        $dentist = Dentist::query()->where('name', 'Equipo dental')->firstOrFail();

        $this->post('/reservar', [
            'service_id' => $service->id,
            'dentist_id' => $dentist->id,
            'date' => '2026-10-12',
            'starts_at' => '2026-10-12T10:00',
            'name' => 'Paciente de prueba',
            'phone' => '0000000088',
        ])->assertRedirect(route('booking.success'));

        $appointment = Appointment::query()->firstOrFail();
        $portalToken = $this->app['session.store']->get('booking_portal_token');

        $this->assertIsString($portalToken);
        $this->assertDatabaseHas('patient_portal_accesses', [
            'patient_id' => $appointment->patient_id,
            'token_hash' => hash('sha256', $portalToken),
        ]);
        $this->assertDatabaseMissing('patient_portal_accesses', [
            'patient_id' => $appointment->patient_id,
            'token_hash' => $portalToken,
        ]);

        $this->flushSession();
        $this->get('/mis-citas/' . $portalToken)
            ->assertOk()
            ->assertInertia(fn(Assert $page) => $page
                ->component('Booking/Appointments')
                ->has('appointments', 1)
                ->where('appointments.0.service_name', $service->name));

        $this->post(route('patient.appointments.cancel', $appointment))
            ->assertRedirect(route('patient.appointments'))
            ->assertSessionHas('success');

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => 'cancelled',
        ]);
        $this->get('/?service_id=' . $service->id . '&dentist_id=' . $dentist->id . '&date=2026-10-12')
            ->assertInertia(fn(Assert $page) => $page->where('slots.4.label', '10:00'));
    }

    public function test_patient_portal_requires_a_booking_session(): void
    {
        $this->get('/mis-citas')->assertRedirect(route('booking.start'));
    }

    public function test_patient_can_revoke_the_private_portal_link(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create();
        $dentist = Dentist::query()->where('name', 'Equipo dental')->firstOrFail();

        $this->post('/reservar', [
            'service_id' => $service->id,
            'dentist_id' => $dentist->id,
            'date' => '2026-10-12',
            'starts_at' => '2026-10-12T10:00',
            'name' => 'Paciente de prueba',
            'phone' => '0000000084',
        ])->assertRedirect(route('booking.success'));

        $portalToken = $this->app['session.store']->get('booking_portal_token');
        $this->assertIsString($portalToken);

        $this->post(route('patient.portal.leave'))
            ->assertRedirect(route('booking.start'));

        $this->assertDatabaseCount('patient_portal_accesses', 0);
        $this->get('/mis-citas/' . $portalToken)->assertNotFound();
    }

    public function test_public_booking_does_not_attach_a_known_phone_to_an_existing_patient(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $existingPatient = Patient::factory()->create([
            'name' => 'Paciente existente',
            'phone' => '0000000085',
        ]);
        $dentist = Dentist::query()->where('name', 'Equipo dental')->firstOrFail();
        $existingAppointment = Appointment::factory()->for($existingPatient)->create([
            'dentist_id' => $dentist->id,
            'dentist_name' => $dentist->name,
            'starts_at' => '2026-10-12 10:00:00',
            'ends_at' => '2026-10-12 10:30:00',
        ]);
        $service = Service::factory()->create();

        $this->post('/reservar', [
            'service_id' => $service->id,
            'dentist_id' => $dentist->id,
            'date' => '2026-10-12',
            'starts_at' => '2026-10-12T11:00',
            'name' => 'Otra persona de prueba',
            'phone' => '0000000085',
        ])->assertRedirect(route('booking.success'));

        $this->assertDatabaseCount('patients', 2);
        $this->assertDatabaseHas('patients', ['id' => $existingPatient->id, 'name' => 'Paciente existente']);
        $this->get('/mis-citas')
            ->assertInertia(fn(Assert $page) => $page
                ->component('Booking/Appointments')
                ->has('appointments', 1)
                ->where('appointments.0.service_name', $service->name));
        $this->assertDatabaseHas('appointments', ['id' => $existingAppointment->id, 'status' => 'scheduled']);
    }

    public function test_patient_cannot_cancel_an_appointment_owned_by_another_session(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create();
        $dentist = Dentist::query()->where('name', 'Equipo dental')->firstOrFail();
        $appointment = Appointment::factory()->create([
            'dentist_id' => $dentist->id,
            'dentist_name' => $dentist->name,
            'starts_at' => '2026-10-12 10:00:00',
            'ends_at' => '2026-10-12 10:30:00',
        ]);

        $this->post('/reservar', [
            'service_id' => $service->id,
            'dentist_id' => $dentist->id,
            'date' => '2026-10-12',
            'starts_at' => '2026-10-12T11:00',
            'name' => 'Paciente de prueba',
            'phone' => '0000000087',
        ])->assertRedirect(route('booking.success'));

        $this->post(route('patient.appointments.cancel', $appointment))->assertNotFound();
        $this->assertDatabaseHas('appointments', ['id' => $appointment->id, 'status' => 'scheduled']);
    }

    public function test_patient_cannot_cancel_within_the_configured_deadline(): void
    {
        $this->travelTo(Carbon::parse('2026-10-11 07:00:00', 'America/Mazatlan'));
        $service = Service::factory()->create();

        $this->post('/reservar', [
            'service_id' => $service->id,
            'date' => '2026-10-12',
            'starts_at' => '2026-10-12T10:00',
            'name' => 'Paciente de prueba',
            'phone' => '0000000086',
        ])->assertRedirect(route('booking.success'));

        $appointment = Appointment::query()->firstOrFail();
        $this->travelTo(Carbon::parse('2026-10-11 11:00:00', 'America/Mazatlan'));

        $this->post(route('patient.appointments.cancel', $appointment))
            ->assertRedirect(route('patient.appointments'))
            ->assertSessionHasErrors('appointment');

        $this->assertDatabaseHas('appointments', ['id' => $appointment->id, 'status' => 'scheduled']);
    }
}
