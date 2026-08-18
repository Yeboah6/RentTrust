import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx', 
            ],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@inertiajs')) {
                            return 'vendor-inertia';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
    // server: {
    //    	host: '0.0.0.0', // Listen on all network interfaces
    //      port: 5173,
    //      cors: {
    //         origin: 'http://192.168.100.16:8000'  // allow Laravel's origin
    //     },
    //      hmr: {
    //          host: '192.168.100.16' // Replace with your machine's IP
    //      }
    //  },

    // server: {
    //     host: '0.0.0.0', // Listen on all network interfaces
    //     port: 5173,
    //     hmr: {
    //         host: '192.168.0.141' // Replace with your machine's IP
    //     }
    // }
});
