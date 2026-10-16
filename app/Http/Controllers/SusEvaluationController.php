<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSusResponseRequest;
use App\Models\SusResponse;
use Inertia\Inertia;
use Inertia\Response;

class SusEvaluationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Evaluations/Sus', [
            'questions' => config('usability.sus_questions'),
            'submitted' => false,
            'score' => null,
        ]);
    }

    public function store(StoreSusResponseRequest $request): Response
    {
        $answers = $request->validated('answers');
        $scoreUnits = collect($answers)->map(
            fn (int $answer, int $index): int => $index % 2 === 0
                ? $answer - 1
                : 5 - $answer,
        )->sum();
        $score = $scoreUnits * 2.5;

        SusResponse::query()->create([
            'answers' => $answers,
            'score' => $score,
            'submitted_at' => now(),
        ]);

        return Inertia::render('Evaluations/Sus', [
            'questions' => config('usability.sus_questions'),
            'submitted' => true,
            'score' => $score,
        ]);
    }
}
