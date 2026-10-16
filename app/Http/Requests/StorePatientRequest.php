<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:160'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:255'],
            'birth_date' => ['nullable', 'date', 'before_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Escribe el nombre del paciente.',
            'name.max' => 'El nombre no puede superar los 160 caracteres.',
            'phone.required' => 'Escribe un teléfono de contacto.',
            'email.email' => 'Escribe un correo electrónico válido.',
            'birth_date.before_or_equal' => 'La fecha de nacimiento no puede ser futura.',
        ];
    }
}
