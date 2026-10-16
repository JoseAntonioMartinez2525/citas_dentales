<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim($request->query('search', ''));

        $patients = Patient::query()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Patients/Index', [
            'patients' => $patients,
            'filters' => ['search' => $search],
            'totalPatients' => Patient::count(),
        ]);
    }

    public function store(StorePatientRequest $request): RedirectResponse
    {
        Patient::create($request->validated());

        return to_route('admin.patients.index')->with('success', 'Paciente agregado a la ficha clínica.');
    }
}
