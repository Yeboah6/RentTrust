import './bootstrap';

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
    resolve: async (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: false })
        const page = pages[`./Pages/${name}.jsx`]

        if (!page) {
            return import('./Pages/NotFound.jsx')
        }

        return page()
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})