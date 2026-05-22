<script setup lang="ts">
import { ref } from "vue";
import { getHealth, getHello } from "./lib/api/client";
import logoAvif from "./assets/semestack_512.avif";
import logoWebp from "./assets/semestack_512.webp";

const stack = __STACK__;

const nameInput = ref("");
const greetingMessage = ref<string | null>(null);
const greetingRuntime = ref<string | null>(null);
const greetingLoading = ref(false);

const pingStatus = ref<"idle" | "success" | "error">("idle");
const pingLatency = ref<number | null>(null);
const pingLoading = ref(false);
const systemTime = ref<string | null>(null);

async function triggerPing() {
	if (pingLoading.value) return;
	pingLoading.value = true;
	pingStatus.value = "idle";
	const startTime = performance.now();
	try {
		const data = await getHealth();
		const endTime = performance.now();
		pingLatency.value = Math.round(endTime - startTime);
		systemTime.value = new Date(data.timestamp).toLocaleTimeString();
		pingStatus.value = "success";
	} catch {
		pingStatus.value = "error";
		pingLatency.value = null;
	} finally {
		pingLoading.value = false;
	}
}

async function sendGreeting() {
	if (!nameInput.value.trim() || greetingLoading.value) return;
	greetingLoading.value = true;
	greetingMessage.value = null;
	greetingRuntime.value = null;
	try {
		const data = await getHello(nameInput.value.trim());
		greetingMessage.value = data.message;
		greetingRuntime.value = data.runtime;
	} catch {
		greetingMessage.value = `Could not communicate with ${stack[1]} edge server.`;
		greetingRuntime.value = null;
	} finally {
		greetingLoading.value = false;
	}
}
</script>

<template>
	<div
		class="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 selection:text-blue-900 flex flex-col relative z-0"
	>
		<div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
			<div class="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
			<div class="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/30 rounded-full blur-[120px] animate-pulse" style="animation-delay: 1s"></div>
			<div class="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
		</div>

		<header
			class="relative z-10 w-full bg-white/30 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
		>
			<div class="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div
						class="relative flex items-center justify-center size-9 rounded-xl shadow-lg overflow-hidden bg-white"
					>
						<picture class="w-full h-full flex">
							<source :srcset="logoAvif" type="image/avif" />
							<source :srcset="logoWebp" type="image/webp" />
							<img :src="logoWebp" alt="Semestack Logo" class="w-full h-full object-cover" />
						</picture>
					</div>
					<span class="text-lg font-bold tracking-tight text-slate-800 hidden sm:block drop-shadow-sm">Semestack</span>
				</div>

				<div
					class="flex items-center gap-2 px-3 py-1 bg-white/40 backdrop-blur-md border border-white/60 shadow-sm rounded-full"
				>
					<span class="relative flex size-2">
						<span
							class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
						></span>
						<span class="relative inline-flex rounded-full size-2 bg-blue-500"></span>
					</span>
					<span class="text-[11px] font-semibold text-blue-700 uppercase tracking-wider"
						>Edge Active</span
					>
				</div>
			</div>
		</header>

		<main
			class="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center gap-16"
		>
			<div class="flex flex-col items-center text-center gap-6 max-w-3xl w-full">
				<div
					class="inline-flex items-center px-3 py-1 text-xs font-semibold text-blue-800 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-full tracking-wide"
				>
					UNIVERSAL FULLSTACK FRAMEWORK
				</div>
				<h1
					class="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm"
				>
					{{ stack[0] }} <span class="text-blue-500">+</span> {{ stack[1] }} <span class="text-blue-500">+</span> {{ stack[3] }}
				</h1>
				<p class="text-lg/8 md:text-xl/8 text-slate-700 max-w-2xl font-medium drop-shadow-sm">
					A CLI tool to instantly scaffold a modern, full-stack web application. It combines the best of frontend and backend technologies with zero configuration, ready to deploy.
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
				<div
					class="flex flex-col bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/40"
				>
					<div class="p-6 border-b border-white/30 flex justify-between items-center bg-white/10">
						<div>
							<h2 class="text-sm font-bold text-slate-800">
								Edge Latency Ping
							</h2>
							<p class="text-xs text-slate-600 mt-0.5 font-medium">Measure response time from the edge</p>
						</div>
						<div class="px-2 py-1 rounded-lg bg-white/40 shadow-sm text-[10px] font-mono text-slate-700 font-bold border border-white/50">
							GET /api/health
						</div>
					</div>

					<div
						class="flex-1 p-6 flex flex-col items-center justify-center min-h-[140px]"
					>
						<div v-if="pingLoading" class="flex flex-col items-center starting:opacity-0 opacity-100 transition-opacity duration-500">
							<div class="relative flex items-center justify-center size-14 mb-2">
								<div class="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
								<div class="absolute inset-2 rounded-full border-2 border-blue-500/50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite_0.3s]"></div>
								<div class="absolute inset-5 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
							</div>
							<span class="text-[10px] font-bold tracking-widest text-slate-500 uppercase animate-pulse">Contacting Edge...</span>
						</div>
						<div
							v-else-if="pingStatus === 'success'"
							class="flex flex-col items-center starting:opacity-0 starting:scale-95 opacity-100 scale-100 transition-all duration-300"
						>
							<div class="flex items-baseline gap-1 text-blue-700 drop-shadow-sm">
								<span class="text-4xl font-black font-mono tracking-tighter">{{ pingLatency }}</span><span class="text-lg font-bold">ms</span>
							</div>
							<span class="text-[11px] text-slate-600 font-mono mt-2 bg-white/50 shadow-sm px-2 py-0.5 rounded-md border border-white/50">
								{{ systemTime }}
							</span>
						</div>
						<span
							v-else-if="pingStatus === 'error'"
							class="text-red-600 text-sm font-bold starting:opacity-0 opacity-100 transition-opacity duration-300 drop-shadow-sm"
						>
							Connection Failed
						</span>
						<span
							v-else
							class="text-slate-500 font-mono text-sm font-medium starting:opacity-0 opacity-100 transition-opacity duration-300"
						>
							Ready to ping
						</span>
					</div>

					<div class="p-4 border-t border-white/30 bg-white/10">
						<button
							@click="triggerPing"
							:disabled="pingLoading"
							class="w-full py-3 px-4 bg-slate-800/90 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg backdrop-blur-md border border-slate-700 cursor-pointer"
						>
							{{ pingLoading ? "Measuring..." : "Ping Edge Network" }}
						</button>
					</div>
				</div>

				<div
					class="flex flex-col bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/40"
				>
					<div class="p-6 border-b border-white/30 flex justify-between items-center bg-white/10">
						<div>
							<h2 class="text-sm font-bold text-slate-800">
								Interactive Greeting
							</h2>
							<p class="text-xs text-slate-600 mt-0.5 font-medium">Send a parameter to the edge API</p>
						</div>
						<div class="px-2 py-1 rounded-lg bg-white/40 shadow-sm text-[10px] font-mono text-slate-700 font-bold border border-white/50">
							GET /api/hello
						</div>
					</div>

					<div
						class="flex-1 p-6 flex flex-col items-center justify-center min-h-[140px]"
					>
						<div v-if="greetingLoading" class="flex flex-col items-center gap-3 starting:opacity-0 opacity-100 transition-opacity duration-500">
							<svg class="size-8 animate-spin text-blue-600 drop-shadow-md" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span class="text-xs font-bold text-slate-500 animate-pulse tracking-wide uppercase">Processing...</span>
						</div>
						<div
							v-else-if="greetingMessage"
							class="flex flex-col items-center text-center starting:opacity-0 starting:scale-95 opacity-100 scale-100 transition-all duration-300"
						>
							<p class="text-blue-700 font-bold text-lg drop-shadow-sm">
								{{ greetingMessage }}
							</p>
							<span
								v-if="greetingRuntime"
								class="mt-2 text-[10px] font-mono text-slate-600 bg-white/50 shadow-sm px-2 py-0.5 rounded-md border border-white/50"
							>
								Runtime: {{ greetingRuntime }}
							</span>
						</div>
						<span
							v-else
							class="text-slate-500 font-mono text-sm font-medium starting:opacity-0 opacity-100 transition-opacity duration-300"
						>
							Awaiting input
						</span>
					</div>
					
					<div class="p-4 border-t border-white/30 bg-white/10">
						<form @submit.prevent="sendGreeting" class="flex gap-2">
							<input
								type="text"
								v-model="nameInput"
								placeholder="Enter your name"
								required
								:disabled="greetingLoading"
								class="flex-1 bg-white/40 backdrop-blur-xl border border-white/60 shadow-inner focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 text-slate-900 placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50 font-semibold"
							/>
							<button
								type="submit"
								:disabled="greetingLoading || !nameInput.trim()"
								class="py-3 px-6 bg-blue-600/90 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg backdrop-blur-md border border-blue-500 cursor-pointer whitespace-nowrap"
							>
								{{ greetingLoading ? "Sending..." : "Send" }}
							</button>
						</form>
					</div>
				</div>
			</div>

			<div
				class="w-full max-w-4xl mx-auto flex flex-col gap-4 items-center"
			>
				<h3 class="text-[10px] font-bold tracking-widest uppercase text-slate-500 text-center drop-shadow-sm">
					Configured Project Tech Stack
				</h3>
				<div class="flex flex-wrap items-center justify-center gap-3">
					<div
						v-for="(tech, i) in stack"
						:key="i"
						class="px-5 py-2 bg-white/30 backdrop-blur-md border border-white/50 rounded-xl text-xs font-bold text-slate-700 cursor-default shadow-sm hover:shadow-md hover:bg-white/40 transition-all duration-200"
					>
						{{ tech }}
					</div>
				</div>
			</div>
		</main>

		<footer
			class="relative z-10 w-full py-8 border-t border-white/30 bg-white/20 backdrop-blur-lg mt-auto"
		>
			<div class="max-w-7xl mx-auto px-6 flex items-center justify-center">
				<p class="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
					Crafted with Semestack &bull; Built for the Edge &bull; {{ new Date().getFullYear() }}
				</p>
			</div>
		</footer>
	</div>
</template>
