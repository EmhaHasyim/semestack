import { hc } from "hono/client";
import type { App } from "../../server";

const domain = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

const api = hc<App>(domain).api;

export async function getHealth() {
	const res = await api.health.$get();
	if (!res.ok) throw new Error("Failed to fetch health");
	return res.json();
}

export async function getHello(name: string) {
	const res = await api.hello.$get({ query: { name } });
	if (!res.ok) throw new Error("Failed to fetch hello");
	return res.json();
}
