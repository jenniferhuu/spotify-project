import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const backendPort = env.VITE_BACKEND_PORT || 5000;

    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                "/api": `http://localhost:${backendPort}`,
                "/topSongs": `http://localhost:${backendPort}`,
                "/auth": `http://localhost:${backendPort}`,
            },
        },
    };
});
