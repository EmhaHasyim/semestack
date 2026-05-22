import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { HealthModel } from "./model";
import { HealthService } from "./service";

export const healthRoute = new OpenAPIHono().openapi(
	createRoute({
		method: "get",
		path: "/",
		responses: {
			200: {
				description: "Health Check endpoint",
				content: {
					"application/json": {
						schema: HealthModel.response,
					},
				},
			},
		},
		tags: ["System"],
		summary: "Health Check",
		description: "Server availability monitoring endpoint",
	}),
	(c) => c.json(HealthService.getStatus()),
);
