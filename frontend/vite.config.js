import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            '/api': 'http://localhost:5000',
            '/auth': 'http://localhost:5000',
            '/songs': 'http://localhost:5000',
            '/topSongs': 'http://localhost:5000',
            '/users': 'http://localhost:5000',
        },
    },
});
