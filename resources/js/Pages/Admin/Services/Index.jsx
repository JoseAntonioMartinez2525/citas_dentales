import { Head, Link, router, useForm } from '@inertiajs/react';
import { CalendarDays, Check, Clock3, Edit, Plus, Search, Trash2, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import DentalMark from '../../../Components/DentalMark';
import ThemeToggle from '../../../Components/ThemeToggle';

const durationOptions = [15, 30, 45, 60, 90, 120];
const bufferOptions = [0, 15, 30, 45, 60];

function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export default function Index({ services, flash = {} }) {
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const form = useForm({
        name: '',
        slug: '',
        description: '',
        duration_minutes: '30',
        buffer_minutes: '15',
        requires_assessment: false,
        is_active: true,
        sort_order: '0',
    });

    const serviceStatusClasses = {
        active: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200',
        inactive: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
    };

    function openCreateModal() {
        form.reset();
        setEditingService(null);
        setIsFormOpen(true);
    }

    function openEditModal(service) {
        form.setData({
            name: service.name,
            slug: service.slug,
            description: service.description,
            duration_minutes: String(service.duration_minutes),
            buffer_minutes: String(service.buffer_minutes),
            requires_assessment: service.requires_assessment,
            is_active: service.is_active,
            sort_order: String(service.sort_order ?? 0),
        });
        setEditingService(service);
        setIsFormOpen(true);
    }

    function closeModal() {
        setIsFormOpen(false);
        setEditingService(null);
    }

    function deleteService(service) {
        if (!window.confirm(`¿Eliminar el servicio "${service.name}"?`)) {
            return;
        }

        router.delete(`/admin/services/${service.id}`, {
            preserveScroll: true,
            onError: (errors) => {
                if (errors.service) {
                    alert(errors.service);
                }
            },
        });
    }

    function submitForm(event) {
        event.preventDefault();

        if (editingService) {
            form.put(`/admin/services/${editingService.id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => closeModal(),
            });
        } else {
            form.post('/admin/services', {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => closeModal(),
            });
        }
    }

    const visibleServices = search.trim()
        ? services.filter((service) =>
              service.name.toLowerCase().includes(search.trim().toLowerCase())
            || service.slug.toLowerCase().includes(search.trim().toLowerCase()))
        : services;

    return (
        <>
            <Head title="Servicios" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-[#e1e5df] bg-[#fbfcfd] px-5 py-6 dark:border-[#344550] dark:bg-[#1a242c] lg:flex lg:flex-col">
                    <Link href="/admin" className="flex items-center gap-3" aria-label="Clínica del Toro, panel administrativo">
                        <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]">
                            <DentalMark className="size-5" />
                        </span>
                        <span>
                            <span className="block text-sm font-bold">Clínica del Toro</span>
                            <span className="block text-xs text-[#748078]">Gestión dental</span>
                        </span>
                    </Link>

                    <p className="mb-3 mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#87918b] dark:text-[#94a4af]">Espacio de trabajo</p>
                    <nav className="grid gap-1" aria-label="Navegación principal">
                        <Link href="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] transition hover:bg-[#eef2f6] hover:text-[#1e2925] dark:text-[#a9b6bf] dark:hover:bg-[#25333c] dark:hover:text-[#e5edf2]"><CalendarDays size={18} /> Agenda</Link>
                        <Link href="/admin/patients" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] transition hover:bg-[#eef2f6] hover:text-[#1e2925] dark:text-[#a9b6bf] dark:hover:bg-[#25333c] dark:hover:text-[#e5edf2]"><UserRound size={18} /> Pacientes</Link>
                        <Link href="/admin/services" className="flex items-center gap-3 rounded-lg bg-[#e8eef4] px-3 py-2.5 text-sm font-semibold text-[#416984] dark:bg-[#293a47] dark:text-[#c3daea]"><Clock3 size={18} /> Servicios</Link>
                        <Link href="/admin/schedules" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] dark:text-[#a9b6bf]"><Clock3 size={18} /> Horarios</Link>
                        <Link href="/admin/evaluaciones" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#65716a] dark:text-[#a9b6bf]"><Check size={18} /> Evaluaciones</Link>
                    </nav>

                    <div className="mt-auto border-t border-[#e7eae5] pt-5 dark:border-[#344550]">
                        <div className="flex items-center gap-3 px-2">
                            <span className="flex size-9 items-center justify-center rounded-full bg-[#dce7ef] text-sm font-semibold text-[#365c78] dark:bg-[#293a47] dark:text-[#c3daea]">CT</span>
                            <span>
                                <span className="block text-sm font-semibold">Clínica del Toro</span>
                                <span className="block text-xs text-[#7e8982] dark:text-[#9aaab4]">Administración</span>
                            </span>
                        </div>
                    </div>
                </aside>

                <main className="mx-auto max-w-7xl px-4 py-5 sm:px-7 sm:py-8 lg:ml-64 lg:px-10">
                    <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e6e0] pb-5 dark:border-[#344550]">
                        <div className="flex items-center gap-2 lg:hidden">
                            <span className="flex size-9 items-center justify-center rounded-lg bg-[#416984] text-white dark:bg-[#527e9d]">
                                <DentalMark className="size-[18px]" />
                            </span>
                            <span className="text-sm font-bold">Clínica del Toro</span>
                        </div>
                        <nav className="flex flex-wrap items-center gap-3 text-sm lg:hidden" aria-label="Navegación principal">
                            <Link href="/admin" className="text-[#65716a] dark:text-[#a9b6bf]">Agenda</Link>
                            <Link href="/admin/patients" className="text-[#65716a] dark:text-[#a9b6bf]">Pacientes</Link>
                            <Link href="/admin/services" className="font-semibold text-[#416984] dark:text-[#a9c9df]">Servicios</Link>
                            <Link href="/admin/schedules" className="text-[#65716a] dark:text-[#a9b6bf]">Horarios</Link>
                            <Link href="/admin/evaluaciones" className="text-[#65716a] dark:text-[#a9b6bf]">Evaluaciones</Link>
                        </nav>
                        <div className="hidden text-sm text-[#7a857e] dark:text-[#9aaab4] lg:block">Catálogo de servicios</div>
                        <ThemeToggle />
                        <Link href="/admin/logout" method="post" as="button" className="h-10 rounded-lg border border-[#dfe4de] px-3 text-sm font-medium text-[#536159] dark:border-[#3a4a55] dark:text-[#c0cbd3]">Cerrar sesión</Link>
                        <button
                            type="button"
                            onClick={openCreateModal}
                            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white transition hover:bg-[#31556f] dark:bg-[#527e9d] dark:hover:bg-[#628ca9]"
                        >
                            <Plus size={16} /> Nuevo servicio
                        </button>
                    </header>

                    <section className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 text-sm font-medium text-[#6d7971] dark:text-[#a0afb9]">Catálogo de servicios</p>
                            <h1 className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">Servicios</h1>
                        </div>
                        <label className="relative block w-full sm:w-64">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87918b] dark:text-[#94a4af]" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar servicios"
                                aria-label="Buscar servicios"
                                className="h-10 w-full rounded-lg border border-[#dfe4de] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9aa39d] focus:border-[#6f86a0] focus:ring-2 focus:ring-[#dce6ef] dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2] dark:placeholder:text-[#788a96] dark:focus:border-[#6e94af] dark:focus:ring-[#304757]"
                            />
                        </label>
                    </section>

                    {flash.success && (
                        <div role="status" className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200">
                            {flash.error}
                        </div>
                    )}

                    {visibleServices.length > 0 ? (
                        <section className="overflow-hidden rounded-xl border border-[#e2e6e0] bg-white dark:border-[#344550] dark:bg-[#1c2730]">
                            <div className="border-b border-[#e9ece8] px-5 py-4 dark:border-[#344550] sm:px-6">
                                <h2 className="font-semibold">Todos los servicios ({visibleServices.length})</h2>
                                <p className="mt-1 text-sm text-[#7a857e] dark:text-[#9aaab4]">
                                    {services.length} servicios registrados en total
                                </p>
                            </div>
                            <div className="divide-y divide-[#edf0ec] dark:divide-[#344550]">
                                {visibleServices.map((service) => (
                                    <article key={service.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold">{service.name}</h3>
                                                {service.requires_assessment && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                                                        Requiere valoración
                                                    </span>
                                                )}
                                                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${service.is_active ? serviceStatusClasses.active : serviceStatusClasses.inactive}`}>
                                                    {service.is_active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">{service.description}</p>
                                            <p className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#89938d] dark:text-[#94a4af]">
                                                <span className="inline-flex items-center gap-1"><Clock3 size={12} /> {service.duration_minutes} min</span>
                                                <span className="inline-flex items-center gap-1">Prep: {service.buffer_minutes} min</span>
                                                <span>Slug: {service.slug}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(service)}
                                                className="flex size-9 items-center justify-center rounded-lg border border-[#dfe4de] text-[#536159] hover:bg-[#f7f9f6] dark:border-[#3a4a55] dark:text-[#c0cbd3] dark:hover:bg-[#263640]"
                                                aria-label={`Editar ${service.name}`}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteService(service)}
                                                className="flex size-9 items-center justify-center rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/40"
                                                aria-label={`Eliminar ${service.name}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    ) : (
                        <section className="flex flex-col items-center rounded-xl border border-[#e2e6e0] bg-white px-6 py-14 text-center dark:border-[#344550] dark:bg-[#1c2730]">
                            <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#e8eef4] text-[#496d88] dark:bg-[#293a47] dark:text-[#a9c9df]"><Clock3 size={22} /></span>
                            <h3 className="font-semibold">{search ? 'No se encontraron servicios' : 'Aún no hay servicios'}</h3>
                            <p className="mt-1 max-w-sm text-sm text-[#7a857e] dark:text-[#9aaab4]">{search ? 'Prueba con otro nombre.' : 'Registra tus servicios para comenzar a recibir citas.'}</p>
                            {!search && (
                                <button
                                    type="button"
                                    onClick={openCreateModal}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#416984] dark:text-[#a9c9df]"
                                >
                                    <Plus size={16} /> Agregar primer servicio
                                </button>
                            )}
                        </section>
                    )}
                </main>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-30 flex items-end justify-center bg-[#15221d]/45 sm:items-center sm:p-5" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }}>
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="service-form-title"
                        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 text-[#1e2925] shadow-2xl dark:bg-[#1c2730] dark:text-[#e5edf2] sm:max-w-2xl sm:rounded-xl sm:p-7"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-[#728078] dark:text-[#a0afb9]">Catálogo de servicios</p>
                                <h2 id="service-form-title" className="mt-1 text-xl font-semibold">
                                    {editingService ? 'Editar servicio' : 'Nuevo servicio'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Cerrar formulario"
                                className="flex size-9 items-center justify-center rounded-lg text-[#748078] hover:bg-[#f1f4f0] dark:text-[#a0afb9] dark:hover:bg-[#293740]"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={submitForm} className="grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="grid gap-1.5 text-sm font-medium sm:col-span-2">
                                    Nombre del servicio
                                    <input
                                        autoFocus
                                        value={form.data.name}
                                        onChange={(event) => {
                                            form.setData('name', event.target.value);
                                            if (!editingService) {
                                                form.setData('slug', slugify(event.target.value));
                                            }
                                        }}
                                        aria-invalid={Boolean(form.errors.name)}
                                        aria-describedby={form.errors.name ? 'service-name-error' : undefined}
                                        className="h-11 rounded-lg border border-[#dfe4de] px-3 text-base font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                                        required
                                    />
                                    {form.errors.name && <span id="service-name-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.name}</span>}
                                </label>

                                <label className="grid gap-1.5 text-sm font-medium">
                                    Slug
                                    <input
                                        value={form.data.slug}
                                        onChange={(event) => form.setData('slug', slugify(event.target.value))}
                                        aria-invalid={Boolean(form.errors.slug)}
                                        aria-describedby={form.errors.slug ? 'service-slug-error' : undefined}
                                        className="h-11 rounded-lg border border-[#dfe4de] px-3 text-base font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                                        required
                                    />
                                    {form.errors.slug && <span id="service-slug-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.slug}</span>}
                                </label>

                                <label className="grid gap-1.5 text-sm font-medium">
                                    Duración
                                    <select
                                        value={form.data.duration_minutes}
                                        onChange={(event) => form.setData('duration_minutes', event.target.value)}
                                        className="h-11 rounded-lg border border-[#dfe4de] bg-white px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                                        required
                                    >
                                        {durationOptions.map((minutes) => (
                                            <option key={minutes} value={minutes}>{minutes} min</option>
                                        ))}
                                    </select>
                                    {form.errors.duration_minutes && <span className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.duration_minutes}</span>}
                                </label>

                                <label className="grid gap-1.5 text-sm font-medium">
                                    Prep entre citas
                                    <select
                                        value={form.data.buffer_minutes}
                                        onChange={(event) => form.setData('buffer_minutes', event.target.value)}
                                        className="h-11 rounded-lg border border-[#dfe4de] bg-white px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                                        required
                                    >
                                        {bufferOptions.map((minutes) => (
                                            <option key={minutes} value={minutes}>{minutes} min</option>
                                        ))}
                                    </select>
                                    {form.errors.buffer_minutes && <span className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.buffer_minutes}</span>}
                                </label>
                            </div>

                            <label className="grid gap-1.5 text-sm font-medium">
                                Descripción
                                <textarea
                                    value={form.data.description}
                                    onChange={(event) => form.setData('description', event.target.value)}
                                    rows="3"
                                    aria-invalid={Boolean(form.errors.description)}
                                    aria-describedby={form.errors.description ? 'service-desc-error' : undefined}
                                    className="resize-y rounded-lg border border-[#dfe4de] px-3 py-2 font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                                    required
                                />
                                {form.errors.description && <span id="service-desc-error" className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.description}</span>}
                            </label>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.data.requires_assessment}
                                        onChange={(event) => form.setData('requires_assessment', event.target.checked)}
                                        className="h-4 w-4 rounded border-[#dfe4de] text-[#416984] focus:ring-[#416984] dark:border-[#3a4a55] dark:bg-[#141d24] dark:focus:ring-[#83a9c4]"
                                    />
                                    <span>Requiere valoración previa</span>
                                </label>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(event) => form.setData('is_active', event.target.checked)}
                                        className="h-4 w-4 rounded border-[#dfe4de] text-[#416984] focus:ring-[#416984] dark:border-[#3a4a55] dark:bg-[#141d24] dark:focus:ring-[#83a9c4]"
                                    />
                                    <span>Activo (disponible para reservar)</span>
                                </label>

                                <label className="grid gap-1.5 text-sm font-medium">
                                    Orden
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.data.sort_order}
                                        onChange={(event) => form.setData('sort_order', event.target.value)}
                                        className="h-11 rounded-lg border border-[#dfe4de] px-3 text-base font-normal dark:border-[#3a4a55] dark:bg-[#141d24] dark:text-[#e5edf2]"
                                    />
                                    {form.errors.sort_order && <span className="text-xs font-normal text-rose-700 dark:text-rose-300">{form.errors.sort_order}</span>}
                                </label>
                            </div>

                            <div className="mt-2 flex flex-col-reverse gap-2 border-t border-[#edf0ec] pt-4 dark:border-[#344550] sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="h-10 rounded-lg border border-[#dfe4de] px-4 text-sm font-medium text-[#59665e] dark:border-[#3a4a55] dark:text-[#c0cbd3]"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white hover:bg-[#31556f] disabled:opacity-60 dark:bg-[#527e9d] dark:hover:bg-[#628ca9]"
                                >
                                    <Check size={16} /> {form.processing ? 'Guardando…' : (editingService ? 'Actualizar' : 'Crear servicio')}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}
