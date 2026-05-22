<script lang="ts">
import { getHealth, getHello } from "./lib/api/client";
import { fade, slide } from "svelte/transition";

const stack: string[] = __STACK__;

let nameInput = $state("");
let greetingMessage = $state<string | null>(null);
let greetingRuntime = $state<string | null>(null);
let greetingLoading = $state(false);

let pingStatus = $state<"idle" | "success" | "error">("idle");
let pingLatency = $state<number | null>(null);
let pingLoading = $state(false);
let systemTime = $state<string | null>(null);

async function triggerPing() {
	if (pingLoading) return;
	pingLoading = true;
	pingStatus = "idle";
	const startTime = performance.now();
	try {
		const data = await getHealth();
		const endTime = performance.now();
		pingLatency = Math.round(endTime - startTime);
		systemTime = new Date(data.timestamp).toLocaleTimeString();
		pingStatus = "success";
	} catch {
		pingStatus = "error";
		pingLatency = null;
	} finally {
		pingLoading = false;
	}
}

async function sendGreeting(e: Event) {
	e.preventDefault();
	if (!nameInput.trim() || greetingLoading) return;
	greetingLoading = true;
	greetingMessage = null;
	greetingRuntime = null;
	try {
		const data = await getHello(nameInput.trim());
		greetingMessage = data.message;
		greetingRuntime = data.runtime;
	} catch {
		greetingMessage = "Could not communicate with Elysia edge server.";
		greetingRuntime = null;
	} finally {
		greetingLoading = false;
	}
}
</script>

<main class="relative min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-violet-200 antialiased overflow-hidden flex flex-col justify-between">
  <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-150 h-75 bg-linear-to-b from-violet-600/15 via-fuchsia-600/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

  <header class="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-zinc-900">
    <div class="flex items-center gap-3">
      <div class="relative flex items-center justify-center size-8 rounded-lg bg-zinc-900 border border-zinc-800 shadow-inner overflow-hidden">
        <div class="absolute inset-0 bg-linear-to-tr from-violet-600/20 to-fuchsia-600/20"></div>
        <span class="text-sm font-bold text-violet-400">S</span>
      </div>
      <span class="text-sm font-semibold tracking-wider uppercase text-zinc-400">Semestack</span>
    </div>

    <div class="flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-900/50 rounded-full">
      <span class="relative flex size-2">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
      </span>
      <span class="text-[11px] font-medium text-emerald-400 uppercase tracking-widest">Edge Network Active</span>
    </div>
  </header>

  <section class="relative z-10 flex-1 flex flex-col justify-center max-w-4xl w-full mx-auto px-6 py-12 gap-12">
    <div class="text-center flex flex-col gap-4">
      <div class="inline-flex self-center px-3 py-1 text-xs font-semibold text-violet-400 bg-violet-950/20 border border-violet-900/50 rounded-full tracking-wide">
        UNIVERSAL FULLSTACK FRAMEWORK
      </div>
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white via-zinc-200 to-zinc-500 leading-tight">
        Svelte 5 + Elysia + Cloudflare
      </h1>
      <p class="max-w-xl mx-auto text-base text-zinc-400 font-normal leading-relaxed">
        A premium full-stack foundation built for blistering speed, type-safe APIs, and serverless edge deployments.
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 w-full">
      <div class="flex flex-col justify-between bg-zinc-900/30 backdrop-blur-md border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-6 transition-all duration-300">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h2 class="text-sm font-semibold tracking-wider uppercase text-zinc-400">Edge Latency Ping</h2>
            <span class="text-xs text-zinc-500 font-mono">/api/health</span>
          </div>

          <div class="flex flex-col items-center justify-center bg-zinc-950/80 border border-zinc-900 rounded-xl py-8 gap-2 relative overflow-hidden group">
            {#if pingLoading}
              <div class="flex flex-col items-center gap-3">
                <span class="size-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></span>
                <span class="text-xs text-zinc-500 font-mono">Measuring latency...</span>
              </div>
            {:else if pingStatus === "success"}
              <div class="text-center" in:fade>
                <div class="text-4xl font-black text-emerald-400 tracking-tight font-mono">
                  {pingLatency}<span class="text-lg font-medium ml-1">ms</span>
                </div>
                <div class="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">
                  Edge Time: {systemTime}
                </div>
              </div>
            {:else if pingStatus === "error"}
              <div class="text-center text-red-400" in:fade>
                <span class="text-sm font-semibold font-mono">Connection Failed</span>
              </div>
            {:else}
              <div class="text-center text-zinc-600" in:fade>
                <span class="text-2xl font-bold tracking-widest font-mono">-- ms</span>
                <p class="text-[10px] uppercase tracking-widest mt-1">Ready to test</p>
              </div>
            {/if}
          </div>
        </div>

        <button
          onclick={triggerPing}
          disabled={pingLoading}
          class="mt-6 w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-800/60 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pingLoading ? "Pinging..." : "Test Latency"}
        </button>
      </div>

      <div class="flex flex-col justify-between bg-zinc-900/30 backdrop-blur-md border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-6 transition-all duration-300">
        <div class="flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h2 class="text-sm font-semibold tracking-wider uppercase text-zinc-400">Interactive Greeting</h2>
            <span class="text-xs text-zinc-500 font-mono">/api/hello</span>
          </div>

          <form onsubmit={sendGreeting} class="flex gap-2">
            <input
              type="text"
              bind:value={nameInput}
              placeholder="Enter your name"
              required
              disabled={greetingLoading}
              class="flex-1 bg-zinc-950/80 border border-zinc-900 hover:border-zinc-800 focus:border-violet-500/80 text-zinc-200 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-xs outline-none transition-all duration-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={greetingLoading || !nameInput.trim()}
              class="py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(124,58,237,0.15)] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            >
              {greetingLoading ? "Sending..." : "Send"}
            </button>
          </form>

          <div class="min-h-19 flex items-center justify-center bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 relative overflow-hidden">
            {#if greetingLoading}
              <div class="flex items-center gap-2.5">
                <span class="size-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></span>
                <span class="text-xs text-zinc-500 font-mono">Requesting edge...</span>
              </div>
            {:else if greetingMessage}
              <div class="w-full text-center" in:slide={{ duration: 250 }}>
                <p class="text-xs font-semibold text-violet-400 tracking-wide">
                  {greetingMessage}
                </p>
                {#if greetingRuntime}
                  <span class="inline-block text-[9px] uppercase font-mono tracking-widest text-zinc-600 mt-1.5">
                    Runtime: {greetingRuntime}
                  </span>
                {/if}
              </div>
            {:else}
              <span class="text-xs text-zinc-600 uppercase tracking-widest font-mono" in:fade>No response received</span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <div class="w-full bg-zinc-900/10 border border-zinc-900/60 rounded-2xl p-6 flex flex-col gap-4">
      <h3 class="text-xs font-semibold tracking-widest uppercase text-zinc-500 text-center">Configured Project Tech Stack</h3>
      <div class="flex flex-wrap items-center justify-center gap-2">
        {#each stack as tech}
          <div class="px-4 py-1.5 bg-zinc-900/50 hover:bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700/50 rounded-xl text-xs font-medium text-zinc-300 cursor-default transition-all duration-200">
            {tech}
          </div>
        {/each}
      </div>
    </div>
  </section>

  <footer class="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-center border-t border-zinc-900">
    <p class="text-[11px] font-medium tracking-widest text-zinc-600 uppercase">
      Crafted with Semestack &bull; Built for the Edge &bull; {new Date().getFullYear()}
    </p>
  </footer>
</main>
