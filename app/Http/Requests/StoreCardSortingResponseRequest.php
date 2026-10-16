<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreCardSortingResponseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'groups' => ['required', 'array', 'min:1'],
            'groups.*.name' => ['required', 'string', 'max:80'],
            'groups.*.cards' => ['required', 'array', 'min:1'],
            'groups.*.cards.*' => [
                'required',
                'string',
                Rule::in(array_keys(config('usability.card_sorting_cards'))),
            ],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $cardIds = collect($this->input('groups'))->flatMap(
                    fn (array $group): array => $group['cards'],
                );
                $expectedCardIds = array_keys(config('usability.card_sorting_cards'));

                if ($cardIds->count() !== count($expectedCardIds) || $cardIds->unique()->count() !== count($expectedCardIds)) {
                    $validator->errors()->add('groups', 'Coloca cada tarjeta exactamente una vez en una categoría.');
                }
            },
        ];
    }
}
