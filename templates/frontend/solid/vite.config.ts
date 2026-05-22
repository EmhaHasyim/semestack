import { cloudflare } from "@cloudflare/vite-plugin";
import solidPlugin from "vite-plugin-solid";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [solidPlugin(), cloudflare(), tailwindcss()],
	build: {
		minify: "oxc",
	},
});
