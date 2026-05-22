export abstract class HealthService {
	static getStatus() {
		return {
			status: "ok" as const,
			timestamp: Date.now(),
		};
	}
}
