<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ];
    }

    public function authenticate(): void
    {
        $throttleKey = Str::transliterate(Str::lower($this->string('email')->toString()).'|'.$this->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            throw ValidationException::withMessages([
                'email' => 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
            ]);
        }

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember')) || ! Auth::user()?->is_admin) {
            Auth::logout();
            RateLimiter::hit($throttleKey, 60);

            throw ValidationException::withMessages([
                'email' => 'Las credenciales no son válidas para el panel administrativo.',
            ]);
        }

        RateLimiter::clear($throttleKey);
    }
}
