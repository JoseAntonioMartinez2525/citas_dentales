import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import { useState } from 'react';
import DentalMark from '../../Components/DentalMark';
import ThemeToggle from '../../Components/ThemeToggle';

const initialGroups = [
    { id: 'category-1', name: 'Categoría 1' },
    { id: 'category-2', name: 'Categoría 2' },
];

export default function CardSorting({ cards, submitted }) {
    const [groups, setGroups] = useState(initialGroups);
    const [assignments, setAssignments] = useState({});
    const [draggedCard, setDraggedCard] = useState(null);
    const [nextGroupId, setNextGroupId] = useState(3);
    const form = useForm({ groups: [] });
    const unassignedCards = Object.keys(cards).filter((cardId) => !assignments[cardId]);

    function assignCard(cardId, groupId) {
        setAssignments((current) => ({ ...current, [cardId]: groupId || null }));
    }

    function updateGroupName(groupId, name) {
        setGroups((current) => current.map((group) => (
            group.id === groupId ? { ...group, name } : group
        )));
    }

    function addGroup() {
        const groupId = `category-${nextGroupId}`;
        setGroups((current) => [...current, { id: groupId, name: `Categoría ${nextGroupId}` }]);
        setNextGroupId((current) => current + 1);
    }

    function submitSorting(event) {
        event.preventDefault();
        const responseGroups = groups
            .map((group) => ({
                name: group.name.trim(),
                cards: Object.entries(assignments)
                    .filter(([, assignedGroupId]) => assignedGroupId === group.id)
                    .map(([cardId]) => cardId),
            }))
            .filter((group) => group.cards.length > 0);

        form.transform(() => ({ groups: responseGroups }));
        form.post('/evaluacion/card-sorting', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Evaluación Card Sorting" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <header className="border-b border-[#e2e6e0] bg-[#fbfcfd] dark:border-[#344550] dark:bg-[#1a242c]">
                    <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-7">
                        <Link href="/" className="flex items-center gap-3" aria-label="Clínica del Toro, inicio">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-5" /></span>
                            <span className="text-sm font-bold">Clínica del Toro</span>
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>
                <main className="mx-auto max-w-5xl px-4 py-8 sm:px-7 sm:py-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#416984] dark:text-[#a9c9df]"><ArrowLeft size={16} /> Volver a reservar</Link>
                    <section className="mt-5">
                        <p className="text-sm font-medium text-[#5f7890] dark:text-[#a9c9df]">Estudio de arquitectura de información</p>
                        <h1 className="mt-1 text-3xl font-semibold">Organiza estas tarjetas</h1>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6d7971] dark:text-[#a0afb9]">
                            Agrupa las funciones como te parezca natural y asigna un nombre a cada categoría. No hay respuestas correctas; no se recopilan datos personales.
                        </p>
                    </section>
                    {submitted ? (
                        <p role="status" className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">Gracias. Tu clasificación quedó registrada de forma anónima.</p>
                    ) : (
                        <form onSubmit={submitSorting} className="mt-7 grid gap-5">
                            <section aria-labelledby="unassigned-title" className="rounded-xl border border-[#e2e6e0] bg-white p-5 dark:border-[#344550] dark:bg-[#1c2730]">
                                <h2 id="unassigned-title" className="font-semibold">Tarjetas sin clasificar ({unassignedCards.length})</h2>
                                <p className="mt-1 text-sm text-[#728078] dark:text-[#a0afb9]">Arrastra una tarjeta a una categoría o usa su selector para asignarla con teclado.</p>
                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {unassignedCards.map((cardId) => (
                                        <Card
                                            key={cardId}
                                            cardId={cardId}
                                            label={cards[cardId]}
                                            groups={groups}
                                            assignedGroupId=""
                                            onAssign={assignCard}
                                            onDragStart={setDraggedCard}
                                        />
                                    ))}
                                </div>
                            </section>
                            <div className="grid gap-4 md:grid-cols-2">
                                {groups.map((group) => {
                                    const groupCards = Object.entries(assignments)
                                        .filter(([, assignedGroupId]) => assignedGroupId === group.id)
                                        .map(([cardId]) => cardId);

                                    return (
                                        <section
                                            key={group.id}
                                            aria-label={group.name}
                                            onDragOver={(event) => event.preventDefault()}
                                            onDrop={(event) => {
                                                event.preventDefault();
                                                if (draggedCard) {
                                                    assignCard(draggedCard, group.id);
                                                    setDraggedCard(null);
                                                }
                                            }}
                                            className="min-h-40 rounded-xl border-2 border-dashed border-[#cbd4dc] bg-white p-4 dark:border-[#3a4a55] dark:bg-[#1c2730]"
                                        >
                                            <label className="grid gap-1 text-sm font-semibold">
                                                Nombre de la categoría
                                                <input
                                                    value={group.name}
                                                    onChange={(event) => updateGroupName(group.id, event.target.value)}
                                                    aria-label={`Nombre de ${group.name}`}
                                                    maxLength="80"
                                                    required
                                                    className="h-10 rounded-lg border border-[#dfe4de] bg-white px-3 font-normal dark:border-[#3a4a55] dark:bg-[#141d24]"
                                                />
                                            </label>
                                            <div className="mt-3 grid gap-2">
                                                {groupCards.map((cardId) => (
                                                    <Card
                                                        key={cardId}
                                                        cardId={cardId}
                                                        label={cards[cardId]}
                                                        groups={groups}
                                                        assignedGroupId={group.id}
                                                        onAssign={assignCard}
                                                        onDragStart={setDraggedCard}
                                                    />
                                                ))}
                                                {groupCards.length === 0 && <p className="py-3 text-sm text-[#89938d] dark:text-[#94a4af]">Suelta aquí las tarjetas de este grupo.</p>}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <button type="button" onClick={addGroup} className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#dfe4de] px-4 text-sm font-medium dark:border-[#3a4a55]">
                                    <Plus size={16} /> Agregar categoría
                                </button>
                                <div className="text-right">
                                    {form.errors.groups && <p role="alert" className="mb-2 text-sm text-rose-700 dark:text-rose-300">{form.errors.groups}</p>}
                                    <button type="submit" disabled={form.processing || unassignedCards.length > 0} className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#416984] px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#527e9d]">
                                        <Save size={16} /> Enviar clasificación
                                    </button>
                                </div>
                            </div>
                            {unassignedCards.length > 0 && <p className="text-right text-xs text-[#728078] dark:text-[#a0afb9]">Clasifica las {unassignedCards.length} tarjetas restantes para continuar.</p>}
                        </form>
                    )}
                </main>
            </div>
        </>
    );
}

function Card({ cardId, label, groups, assignedGroupId, onAssign, onDragStart }) {
    return (
        <article
            draggable
            onDragStart={() => onDragStart(cardId)}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#dfe4de] bg-[#fbfcfd] p-3 text-sm dark:border-[#3a4a55] dark:bg-[#141d24]"
        >
            <span>{label}</span>
            <label className="grid gap-1 text-xs text-[#728078] dark:text-[#a0afb9]">
                Asignar
                <select
                    value={assignedGroupId}
                    onChange={(event) => onAssign(cardId, event.target.value)}
                    aria-label={`Categoría para ${label}`}
                    className="h-9 max-w-48 rounded-lg border border-[#dfe4de] bg-white px-2 text-sm text-[#1e2925] dark:border-[#3a4a55] dark:bg-[#1c2730] dark:text-[#e5edf2]"
                >
                    <option value="">Sin clasificar</option>
                    {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
                </select>
            </label>
        </article>
    );
}
