<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCardSortingResponseRequest;
use App\Models\CardSortingResponse;
use Inertia\Inertia;
use Inertia\Response;

class CardSortingController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Evaluations/CardSorting', [
            'cards' => config('usability.card_sorting_cards'),
            'submitted' => false,
        ]);
    }

    public function store(StoreCardSortingResponseRequest $request): Response
    {
        CardSortingResponse::query()->create([
            'groups' => $request->validated('groups'),
            'submitted_at' => now(),
        ]);

        return Inertia::render('Evaluations/CardSorting', [
            'cards' => config('usability.card_sorting_cards'),
            'submitted' => true,
        ]);
    }
}
