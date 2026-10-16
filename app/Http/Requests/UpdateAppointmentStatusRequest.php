<?php

namespace App\Http\Requests;

use App\Models\Appointment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateAppointmentStatusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(Appointment::STATUSES)],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $appointment = $this->route('appointment');
                $nextStatus = $this->input('status');

                if (!$appointment instanceof Appointment || $validator->errors()->isNotEmpty()) {
                    return;
                }

                $allowedTransitions = [
                    'scheduled' => ['confirmed', 'cancelled'],
                    'confirmed' => ['completed', 'cancelled'],
                    'completed' => [],
                    'cancelled' => [],
                ];

                if ($nextStatus !== $appointment->status && !in_array($nextStatus, $allowedTransitions[$appointment->status], true)) {
                    $validator->errors()->add('status', 'No se puede cambiar el estado actual de esta cita.');
                }
            }
        ];
    }
}
