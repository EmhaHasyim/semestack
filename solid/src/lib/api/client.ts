import { treaty } from "@elysia/eden";
import type { App } from "../../server";

const domain = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

const api = treaty<App>(domain).api;

export async function getHealth() {
	const { data, error } = await api.health.get();
	if (error) throw error;
	return data;
}

export async function getHello(name: string) {
	const { data, error } = await api.hello.get({ query: { name } });
	if (error) throw error;
	return data;
}
