import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

function getInitialTheme() {
    if (typeof window === 'undefined') {
        return false;
    }

    try {
        const savedTheme = window.localStorage.getItem('clinic-theme');
        const useDarkTheme = savedTheme === 'dark'
            || (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);

        document.documentElement.classList.toggle('dark', useDarkTheme);

        return useDarkTheme;
    } catch {
        return document.documentElement.classList.contains('dark');
    }
}

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(getInitialTheme);
    const label = isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

    function toggleTheme() {
        const nextIsDark = !isDark;

        document.documentElement.classList.toggle('dark', nextIsDark);
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nextIsDark ? '#121a20' : '#f3f5f7');

        try {
            window.localStorage.setItem('clinic-theme', nextIsDark ? 'dark' : 'light');
        } catch { }

        setIsDark(nextIsDark);
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            aria-pressed={isDark}
            title={label}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#dfe4de] bg-white text-[#536159] transition hover:bg-[#f7f9f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#426b88] dark:border-[#3a4a55] dark:bg-[#1c2730] dark:text-[#d4e0e8] dark:hover:bg-[#263640]"
        >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
    );
}