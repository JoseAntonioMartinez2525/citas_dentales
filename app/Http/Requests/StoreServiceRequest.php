<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:160', 'unique:services,name'],
            'slug' => ['required', 'string', 'max:180', 'unique:services,slug'],
            'description' => ['required', 'string', 'max:2000'],
            'duration_minutes' => ['required', 'integer', 'in:15,30,45,60,90,120'],
            'buffer_minutes' => ['required', 'integer', 'in:0,15,30,45,60'],
            'requires_assessment' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Escribe el nombre del servicio.',
            'name.unique' => 'Ya existe un servicio con ese nombre.',
            'slug.required' => 'El slug es obligatorio.',
            'slug.unique' => 'Ya existe un servicio con ese slug.',
            'description.required' => 'Escribe una descripción del servicio.',
            'duration_minutes.required' => 'Selecciona una duración para el servicio.',
            'duration_minutes.in' => 'Elige una duración disponible en la lista.',
            'buffer_minutes.required' => 'Define los minutos de preparación entre citas.',
            'buffer_minutes.in' => 'Elige un tiempo de preparación válido.',
            'sort_order.integer' => 'El orden debe ser un número entero.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('requires_assessment')) {
            $this->merge(['requires_assessment' => false]);
        }

        if (! $this->has('is_active')) {
            $this->merge(['is_active' => true]);
        }

        $name = $this->string('name')->toString();
        $slug = $this->input('slug');

        if (blank($slug) && filled($name)) {
            $this->merge(['slug' => Str::slug($name)]);
        }
    }
}
