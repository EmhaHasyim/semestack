import { cancel, group, log, select, text } from "@clack/prompts";
import { blue } from "kolorist";

const FRONTEND_OPTIONS = [
	{
		value: "react" as const,
		label: "React",
		hint: "The library for web and native user interfaces",
	},
	{
		value: "vue" as const,
		label: "Vue",
		hint: "The Progressive JavaScript Framework",
	},
	{
		value: "svelte" as const,
		label: "Svelte",
		hint: "Cybernetically enhanced web apps",
	},
	{
		value: "solid" as const,
		label: "Solid",
		hint: "Simple and performant reactivity for building user interfaces",
	},
];
const BACKEND_OPTIONS = [
	{
		value: "hono" as const,
		label: "Hono",
		hint: "Web framework built on Web Standards",
	},
	{
		value: "elysia" as const,
		label: "Elysia",
		hint: "Ergonomic Framework for Humans",
	},
];
const DEPLOY_OPTIONS = [
	{
		value: "cf" as const,
		label: "Cloudflare Workers",
		hint: "Deploy serverless code instantly across the globe",
	},
	{
		value: "vercel" as const,
		label: "Vercel",
		hint: "Develop. Preview. Ship.",
	},
];

type Frontend = (typeof FRONTEND_OPTIONS)[number]["value"];
type Backend = (typeof BACKEND_OPTIONS)[number]["value"];
type Deploy = (typeof DEPLOY_OPTIONS)[number]["value"];

export interface SemestackOptions {
	projectName: string;
	frontend: Frontend;
	backend: Backend;
	deploy: Deploy;
}

function validateProjectName(value: string | undefined): string | undefined {
	if (!value) return "Please enter a project name.";
	if (!/^[a-z0-9-_]+$/.test(value)) {
		return "Only lowercase letters, numbers, dashes, and underscores.";
	}
	return undefined;
}

export async function askQuestions(existingName?: string): Promise<SemestackOptions> {
	console.log();
	console.log(blue("Semestack – Universal Fullstack Framework"));
	console.log();

	if (existingName) {
		const error = validateProjectName(existingName);
		if (error) {
			log.error(`Invalid project name "${existingName}": ${error}`);
			process.exit(1);
		}
	}

	const options = await group(
		{
			projectName: () => {
				if (existingName) return Promise.resolve(existingName);
				return text({
					message: "Project name:",
					placeholder: "my-semestack-app",
					validate: validateProjectName,
				});
			},
			frontend: () =>
				select({ message: "Choose a frontend framework:", options: FRONTEND_OPTIONS }),
			backend: () => select({ message: "Choose a backend framework:", options: BACKEND_OPTIONS }),
			deploy: () => select({ message: "Choose deployment target:", options: DEPLOY_OPTIONS }),
		},
		{
			onCancel: () => {
				cancel("Operation cancelled.");
				process.exit(0);
			},
		},
	);

	return options as SemestackOptions;
}
