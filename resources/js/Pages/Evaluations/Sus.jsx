import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check } from 'lucide-react';
import DentalMark from '../../Components/DentalMark';
import ThemeToggle from '../../Components/ThemeToggle';

const responseLabels = [
    'Totalmente en desacuerdo',
    'En desacuerdo',
    'Ni de acuerdo ni en desacuerdo',
    'De acuerdo',
    'Totalmente de acuerdo',
];

export default function Sus({ questions, submitted, score }) {
    const form = useForm({ answers: Array(questions.length).fill('') });

    function setAnswer(questionIndex, answer) {
        form.setData('answers', form.data.answers.map((current, index) => (
            index === questionIndex ? answer : current
        )));
    }

    function submitSurvey(event) {
        event.preventDefault();
        form.post('/evaluacion/sus', { preserveScroll: true });
    }

    return (
        <>
            <Head title="Evaluación de usabilidad" />
            <div className="min-h-screen bg-[#f3f5f7] text-[#1e2925] dark:bg-[#121a20] dark:text-[#e5edf2]">
                <header className="border-b border-[#e2e6e0] bg-[#fbfcfd] dark:border-[#344550] dark:bg-[#1a242c]">
                    <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-7">
                        <Link href="/" className="flex items-center gap-3" aria-label="Clínica del Toro, inicio">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-[#416984] text-white dark:bg-[#527e9d]"><DentalMark className="size-5" /></span>
                            <span className="text-sm font-bold">Clínica del Toro</span>
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>
                <main className="mx-auto max-w-4xl px-4 py-8 sm:px-7 sm:py-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[#416984] dark:text-[#a9c9df]"><ArrowLeft size={16} /> Volver a reservar</Link>
                    <section className="mt-5">
                        <p className="text-sm font-medium text-[#5f7890] dark:text-[#a9c9df]">Cuestionario de usabilidad</p>
                        <h1 className="mt-1 text-3xl font-semibold">Evalúa tu experiencia</h1>
                        <p className="mt-2 text-sm leading-6 text-[#6d7971] dark:text-[#a0afb9]">
                            Responde pensando en la plataforma que acabas de probar. Esta versión en español está adaptada para este prototipo. Tus respuestas no incluyen datos personales.
                        </p>
                    </section>
                    {submitted ? (
                        <section role="status" className="mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
                            <h2 className="font-semibold">Gracias por participar</h2>
                            <p className="mt-2 text-sm">Tu respuesta quedó registrada. Puntaje calculado: <strong>{Number(score).toFixed(1)} / 100</strong>.</p>
                        </section>
                    ) : (
                        <form onSubmit={submitSurvey} className="mt-7 grid gap-4">
                            {questions.map((question, questionIndex) => (
                                <fieldset key={questionIndex} className="rounded-xl border border-[#e2e6e0] bg-white p-4 dark:border-[#344550] dark:bg-[#1c2730] sm:p-5">
                                    <legend className="max-w-full font-medium leading-6">
                                        <span className="mr-2 text-sm text-[#5f7890] dark:text-[#a9c9df]">{questionIndex + 1}.</span>
                                        {question}
                                    </legend>
                                    <div className="mt-4 grid gap-2 sm:grid-cols-5">
                                        {responseLabels.map((label, valueIndex) => (
                                            <label key={label} className="flex min-h-11 items-center gap-2 rounded-lg border border-[#edf0ec] px-3 text-xs leading-4 dark:border-[#344550] sm:flex-col sm:items-start sm:justify-center">
                                                <input
                                                    type="radio"
                                                    name={`answers-${questionIndex}`}
                                                    value={valueIndex + 1}
                                                    checked={form.data.answers[questionIndex] === valueIndex + 1}
                                                    onChange={() => setAnswer(questionIndex, valueIndex + 1)}
                                                    aria-label={`${label}, pregunta ${questionIndex + 1}`}
                                                    required
                                                />
                                                <span>{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </fieldset>
                            ))}
                            {form.errors.answers && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{form.errors.answers}</p>}
                            <button type="submit" disabled={form.processing} className="inline-flex h-11 items-center justify-center gap-2 justify-self-end rounded-lg bg-[#416984] px-5 text-sm font-semibold text-white disabled:opacity-60 dark:bg-[#527e9d]">
                                <Check size={16} /> Enviar respuestas
                            </button>
                        </form>
                    )}
                </main>
            </div>
        </>
    );
}
