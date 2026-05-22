import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SemestackOptions } from "./prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, "..", "templates");

const DISPLAY_NAMES: Record<string, string> = {
	react: "React",
	vue: "Vue",
	svelte: "Svelte",
	solid: "Solid",
	hono: "Hono",
	elysia: "Elysia",
	cf: "Cloudflare Workers",
	vercel: "Vercel",
};

const APP_EXTENSIONS: Record<string, string> = {
	react: "tsx",
	vue: "vue",
	svelte: "svelte",
	solid: "tsx",
};

const MAIN_EXTENSIONS: Record<string, string> = {
	react: "tsx",
	vue: "ts",
	svelte: "ts",
	solid: "tsx",
};

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
	scripts?: Record<string, string>;
	[key: string]: unknown;
}

function copyDir(src: string, dest: string) {
	fs.cpSync(src, dest, { recursive: true });
}

function mergePackageJson(
	targetDir: string,
	projectName: string,
	...sourceDirs: (string | null)[]
) {
	const targetPath = path.join(targetDir, "package.json");
	const targetPkg: PackageJson = fs.existsSync(targetPath)
		? JSON.parse(fs.readFileSync(targetPath, "utf-8"))
		: {};

	targetPkg.name = projectName;
	targetPkg.version = "0.1.0";

	const rootFields = ["type", "private"] as const;

	for (const srcDir of sourceDirs) {
		if (!srcDir) continue;
		const srcPkgPath = path.join(srcDir, "package.json");
		if (!fs.existsSync(srcPkgPath)) continue;
		const srcPkg: PackageJson = JSON.parse(fs.readFileSync(srcPkgPath, "utf-8"));
		for (const key of ["dependencies", "devDependencies", "scripts"] as const) {
			if (srcPkg[key]) {
				targetPkg[key] = { ...targetPkg[key], ...srcPkg[key] };
			}
		}
		for (const key of rootFields) {
			if (srcPkg[key] && !targetPkg[key]) {
				targetPkg[key] = srcPkg[key];
			}
		}
	}

	fs.writeFileSync(targetPath, JSON.stringify(targetPkg, null, 2));
}

function renderStackPlaceholders(targetDir: string, options: SemestackOptions) {
	const ext = APP_EXTENSIONS[options.frontend] || "ts";
	const filePath = path.join(targetDir, "src", `App.${ext}`);
	if (!fs.existsSync(filePath)) return;

	const stack = JSON.stringify([
		DISPLAY_NAMES[options.frontend],
		DISPLAY_NAMES[options.backend],
		"Vite",
		DISPLAY_NAMES[options.deploy],
	]);

	const content = fs.readFileSync(filePath, "utf-8");
	fs.writeFileSync(filePath, content.replaceAll("__STACK__", stack), "utf-8");
}

function patchIndexHtml(targetDir: string, options: SemestackOptions) {
	const ext = MAIN_EXTENSIONS[options.frontend] || "ts";
	if (ext === "ts") return;

	const indexPath = path.join(targetDir, "index.html");
	if (!fs.existsSync(indexPath)) return;

	const content = fs.readFileSync(indexPath, "utf-8");
	fs.writeFileSync(
		indexPath,
		content.replace('src="/src/main.ts"', `src="/src/main.${ext}"`),
		"utf-8",
	);
}

export function generateProject(options: SemestackOptions): string {
	const targetDir = path.resolve(process.cwd(), options.projectName);

	if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
		throw new Error(`Directory "${targetDir}" already exists and is not empty.`);
	}

	const base = path.join(templatesDir, "base");
	const frontendDir = path.join(templatesDir, "frontend", options.frontend);
	const backendDir = path.join(templatesDir, "backend", options.backend, options.deploy);

	if (!fs.existsSync(frontendDir)) {
		throw new Error(`Frontend template "${options.frontend}" is not available yet.`);
	}
	if (!fs.existsSync(backendDir)) {
		throw new Error(
			`Backend template "${options.backend}" for "${options.deploy}" is not available yet.`,
		);
	}

	try {
		copyDir(base, targetDir);
		copyDir(frontendDir, targetDir);
		copyDir(backendDir, targetDir);
		mergePackageJson(targetDir, options.projectName, frontendDir, backendDir);
		renderStackPlaceholders(targetDir, options);
		patchIndexHtml(targetDir, options);
	} catch (err) {
		fs.rmSync(targetDir, { recursive: true, force: true });
		throw err;
	}

	return targetDir;
}
