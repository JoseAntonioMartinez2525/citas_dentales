<?php

namespace Tests\Feature;

use App\Models\CardSortingResponse;
use App\Models\SusResponse;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class EvaluationTest extends TestCase
{
    use RefreshDatabase;

    public function test_card_sorting_submission_persists_each_card_in_one_group(): void
    {
        $groups = [
            [
                'name' => 'Citas',
                'cards' => ['book_appointment', 'patient_appointments', 'cancel_appointment', 'clinic_schedule'],
            ],
            [
                'name' => 'Clínica',
                'cards' => ['services', 'staff_agenda', 'patients', 'staff_services'],
            ],
        ];

        $this->get('/evaluacion/card-sorting')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Evaluations/CardSorting')->has('cards', 8));

        $this->post('/evaluacion/card-sorting', ['groups' => $groups])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Evaluations/CardSorting')->where('submitted', true));

        $this->assertDatabaseCount('card_sorting_responses', 1);
        $this->assertSame($groups, CardSortingResponse::query()->firstOrFail()->groups);
    }

    public function test_card_sorting_rejects_a_card_assigned_more_than_once(): void
    {
        $this->from('/evaluacion/card-sorting')->post('/evaluacion/card-sorting', [
            'groups' => [
                ['name' => 'Primero', 'cards' => ['book_appointment', 'services', 'patient_appointments', 'cancel_appointment']],
                ['name' => 'Segundo', 'cards' => ['book_appointment', 'clinic_schedule', 'staff_agenda', 'patients', 'staff_services']],
            ],
        ])->assertSessionHasErrors('groups');

        $this->assertDatabaseCount('card_sorting_responses', 0);
    }

    public function test_sus_submission_saves_answers_and_calculates_score(): void
    {
        $answers = [4, 2, 4, 2, 4, 2, 4, 2, 4, 2];

        $this->get('/evaluacion/sus')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Evaluations/Sus')->has('questions', 10));

        $this->post('/evaluacion/sus', ['answers' => $answers])
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Evaluations/Sus')
                ->where('submitted', true)
                ->where('score', 75));

        $this->assertDatabaseHas('sus_responses', ['score' => 75]);
        $this->assertSame($answers, SusResponse::query()->firstOrFail()->answers);
    }

    public function test_sus_submission_requires_all_ten_valid_answers(): void
    {
        $this->from('/evaluacion/sus')->post('/evaluacion/sus', [
            'answers' => [5, 4, 3],
        ])->assertSessionHasErrors('answers');

        $this->assertDatabaseCount('sus_responses', 0);
    }

    public function test_only_administrators_can_view_evaluation_results(): void
    {
        $this->get('/admin/evaluaciones')->assertRedirect(route('login'));

        $this->actingAs(User::factory()->create())
            ->get('/admin/evaluaciones')
            ->assertForbidden();
    }
}
