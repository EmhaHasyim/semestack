import { intro, outro, spinner } from "@clack/prompts";
import { green } from "kolorist";
import { generateProject } from "./generator";
import { askQuestions } from "./prompts";

function getPackageManager(): "npm" | "bun" {
	const userAgent = process.env.npm_config_user_agent || "";
	if (userAgent.startsWith("bun")) return "bun";
	return "npm";
}

export async function main() {
	intro("✨ Semestack v0.1.2 – Universal Fullstack Framework");

	const cliName = process.argv[2];
	const options = await askQuestions(cliName);

	const s = spinner();
	s.start("Generating project stack...");
	const targetDir = generateProject(options);
	s.stop("Project stack generated successfully!");

	const pm = getPackageManager();
	const installCmd = `${pm} install`;
	const devCmd = `${pm} run dev`;

	console.log(green(`\nProject ready at ${targetDir}`));
	console.log(`\n  cd ${options.projectName}`);
	console.log(`  ${installCmd}`);
	console.log(`  ${devCmd}\n`);
	outro("✅ Happy coding with Semestack!");
}

const isMain =
	process.argv[1] &&
	(process.argv[1].endsWith("index.ts") || process.argv[1].endsWith("index.mjs"));
if (isMain) {
	main().catch(console.error);
}
