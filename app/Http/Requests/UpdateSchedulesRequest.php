<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateSchedulesRequest extends FormRequest
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
            'schedules' => ['required', 'array', 'size:7'],
            'schedules.*.weekday' => ['required', 'integer', 'between:1,7'],
            'schedules.*.is_open' => ['required', 'boolean'],
            'schedules.*.opens_at' => ['required', 'date_format:H:i'],
            'schedules.*.closes_at' => ['required', 'date_format:H:i'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $schedules = $this->input('schedules');
                $weekdays = collect($schedules)->pluck('weekday');

                if ($weekdays->unique()->count() !== 7 || $weekdays->sort()->values()->all() !== range(1, 7)) {
                    $validator->errors()->add('schedules', 'Define exactamente un horario para cada día de la semana.');

                    return;
                }

                foreach ($schedules as $index => $schedule) {
                    if ($schedule['is_open'] && $schedule['closes_at'] <= $schedule['opens_at']) {
                        $validator->errors()->add("schedules.{$index}.closes_at", 'La hora de cierre debe ser posterior a la hora de apertura.');
                    }
                }
            },
        ];
    }
}
