import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

// GitHub Pages serves 404.html for unknown paths; copying index.html there
// lets client-side routes such as /work/kerasobha load directly.
const spaFallback = () => ({
  name: "spa-404-fallback",
  closeBundle() {
    const dist = resolve(import.meta.dirname, "dist");
    copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback()],
  build: { target: "es2022", cssCodeSplit: true },
});
