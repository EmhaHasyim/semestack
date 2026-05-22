import { t } from "elysia";

export const HealthModel = {
	response: t.Object({
		status: t.Literal("ok"),
		timestamp: t.Number({
			description: "Unix timestamp when health check was called (ms)",
		}),
	}),
} as const;
