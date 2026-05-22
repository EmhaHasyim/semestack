import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { healthRoute } from "./modules/health";

const api = new OpenAPIHono()
	.doc("/doc", {
		openapi: "3.0.0",
		info: {
			version: "1.0.0",
			title: "Semestack API",
		},
	})
	.route("/health", healthRoute)
	.openapi(
		createRoute({
			method: "get",
			path: "/hello",
			request: {
				query: z.object({
					name: z.string().optional(),
				}),
			},
			responses: {
				200: {
					description: "Greeting response",
					content: {
						"application/json": {
							schema: z.object({
								message: z.string(),
								timestamp: z.number(),
								runtime: z.string(),
							}),
						},
					},
				},
			},
		}),
		(c) => {
			const { name } = c.req.valid("query");
			return c.json({
				message: `Greeting from Semestack backend! Hello, ${name || "Guest"}! ✨`,
				timestamp: Date.now(),
				runtime: "Cloudflare Worker Edge",
			});
		},
	);

api.get("/openapi", Scalar({ spec: { url: "/api/doc" }, theme: "elysiajs" }));

const app = new OpenAPIHono().route("/api", api);

export type App = typeof app;
export default app;
