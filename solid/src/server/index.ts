import { openapi } from "@elysia/openapi";
import { Elysia, t } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { healthRoute } from "./modules/health";

const isDev = import.meta.env?.DEV === true;

const app = new Elysia({
	adapter: CloudflareAdapter,
	prefix: "/api",
	...(isDev ? { aot: false } : {}),
})
	.use(
		openapi({
			provider: "scalar",
			documentation: {
				info: {
					title: "Semestack API",
					version: "1.0.0",
					description: "API documentation for Semestack",
				},
			},
		}),
	)
	.use(healthRoute)
	.get(
		"/hello",
		({ query: { name } }) => {
			return {
				message: `Greeting from Semestack backend! Hello, ${name || "Guest"}! ✨`,
				timestamp: Date.now(),
				runtime: "Cloudflare Worker Edge",
			};
		},
		{
			query: t.Object({
				name: t.Optional(t.String()),
			}),
		},
	);

if (!isDev) {
	app.compile();
}

export type App = typeof app;
export default app;
