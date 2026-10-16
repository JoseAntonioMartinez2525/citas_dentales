<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as FoundationResponse;

class AuthController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()?->is_admin) {
            return to_route('admin.dashboard');
        }

        return Inertia::render('Auth/Login');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function destroy(Request $request): FoundationResponse
    {
        auth()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return to_route('booking.start');
    }
}
