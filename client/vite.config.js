import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const API_URL = `${env.VITE_API_URL ?? 'http://localhost:8000'}`;

  return {
    server: {
      proxy: {
        '/api': API_URL,
      },
    },
    plugins: [react()],
  };
});