import { Elysia } from "elysia";
import { HealthModel } from "./model";
import { HealthService } from "./service";

export const healthRoute = new Elysia({ prefix: "/health" }).get(
	"/",
	() => HealthService.getStatus(),
	{
		response: HealthModel.response,
		detail: {
			summary: "Health Check",
			description: "Server availability monitoring endpoint",
			tags: ["System"],
		},
	},
);
