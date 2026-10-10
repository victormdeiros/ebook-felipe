import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    // The Vercel frontend and API share the same origin by default.
    define: {
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL ?? ""),
    },
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": "http://localhost:5000",
      },
      hmr: {
        overlay: false,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
