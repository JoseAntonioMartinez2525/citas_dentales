<?php

namespace App\Http\Controllers;

use App\Models\CardSortingResponse;
use App\Models\SusResponse;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationResultsController extends Controller
{
    public function index(): Response
    {
        $susSummary = SusResponse::query()
            ->selectRaw('COUNT(*) AS responses_count, AVG(score) AS average_score')
            ->first();

        return Inertia::render('Admin/Evaluations/Index', [
            'cardSortingResponses' => CardSortingResponse::query()
                ->latest('submitted_at')
                ->limit(50)
                ->get(['id', 'groups', 'submitted_at']),
            'susResponsesCount' => (int) $susSummary->responses_count,
            'susAverageScore' => $susSummary->average_score === null ? null : round((float) $susSummary->average_score, 1),
        ]);
    }
}
