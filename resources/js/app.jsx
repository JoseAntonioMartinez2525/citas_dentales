import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import React from 'react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    setup: ({ App, props }) => {
        const root = createRoot(document.getElementById('app'));
        root.render(<App {...props} />);
    },
});