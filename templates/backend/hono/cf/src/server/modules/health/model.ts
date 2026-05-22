import { z } from "@hono/zod-openapi";

export const HealthModel = {
	response: z.object({
		status: z.enum(["ok", "degraded", "down"]),
		timestamp: z.number(),
	}),
};
