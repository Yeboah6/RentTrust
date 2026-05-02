import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',   // ← must be here
                'resources/js/app.jsx',    // or app.js
            ],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],
   // server: {
     //   watch: {
       //     ignored: ['**/storage/framework/views/**'],
       // },
   // },

    // server: {
    //    	host: '0.0.0.0', // Listen on all network interfaces
    //      port: 5173,
    //      hmr: {
    //          host: '192.168.100.16' // Replace with your machine's IP
    //      }
    //  },
    server: {
        host: '0.0.0.0', // Listen on all network interfaces
        port: 5173,
        hmr: {
            host: '192.168.0.141' // Replace with your machine's IP
        }
    }
});
