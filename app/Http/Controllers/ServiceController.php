<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $services = Service::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'slug',
                'description',
                'duration_minutes',
                'buffer_minutes',
                'requires_assessment',
                'is_active',
                'sort_order',
            ]);

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
        ]);
    }

    public function store(StoreServiceRequest $request): RedirectResponse
    {
        Service::create($request->validated());

        return to_route('admin.services.index')
            ->with('success', 'Servicio agregado a la lista de servicios.');
    }

    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update($request->validated());

        return to_route('admin.services.index')
            ->with('success', 'Servicio actualizado correctamente.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        if ($service->appointments()->exists()) {
            return to_route('admin.services.index')
                ->withErrors(['service' => 'No se puede eliminar un servicio con citas registradas. Desactívalo en su lugar.']);
        }

        $service->delete();

        return to_route('admin.services.index')
            ->with('success', 'Servicio eliminado de la lista.');
    }
}
