import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	outDir: "dist",
	clean: true,
	sourcemap: true,
	dts: true,
	target: "node18",
	platform: "node",
	shims: true,
	minify: true,
	deps: {
		onlyBundle: false,
		alwaysBundle: ["@clack/prompts", "kolorist"],
	},
});
