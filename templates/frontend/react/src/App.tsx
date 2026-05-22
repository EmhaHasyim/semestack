import { useState, type FormEvent } from "react";
import { getHealth, getHello } from "./lib/api/client";
import logoAvif from "./assets/semestack_512.avif";
import logoWebp from "./assets/semestack_512.webp";

const stack: string[] = __STACK__;

export default function App() {
	const [nameInput, setNameInput] = useState("");
	const [greetingMessage, setGreetingMessage] = useState<string | null>(null);
	const [greetingRuntime, setGreetingRuntime] = useState<string | null>(null);
	const [greetingLoading, setGreetingLoading] = useState(false);

	const [pingStatus, setPingStatus] = useState<"idle" | "success" | "error">("idle");
	const [pingLatency, setPingLatency] = useState<number | null>(null);
	const [pingLoading, setPingLoading] = useState(false);
	const [systemTime, setSystemTime] = useState<string | null>(null);

	async function triggerPing() {
		if (pingLoading) return;
		setPingLoading(true);
		setPingStatus("idle");
		const startTime = performance.now();
		try {
			const data = await getHealth();
			const endTime = performance.now();
			setPingLatency(Math.round(endTime - startTime));
			setSystemTime(new Date(data.timestamp).toLocaleTimeString());
			setPingStatus("success");
		} catch {
			setPingStatus("error");
			setPingLatency(null);
		} finally {
			setPingLoading(false);
		}
	}

	async function sendGreeting(e: FormEvent) {
		e.preventDefault();
		if (!nameInput.trim() || greetingLoading) return;
		setGreetingLoading(true);
		setGreetingMessage(null);
		setGreetingRuntime(null);
		try {
			const data = await getHello(nameInput.trim());
			setGreetingMessage(data.message);
			setGreetingRuntime(data.runtime);
		} catch {
			setGreetingMessage(`Could not communicate with ${stack[1]} edge server.`);
			setGreetingRuntime(null);
		} finally {
			setGreetingLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500/30 selection:text-blue-900 flex flex-col relative z-0">
			<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
				<div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
				<div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
				<div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
			</div>

			<header className="relative z-10 w-full bg-white/30 backdrop-blur-xl border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
				<div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="relative flex items-center justify-center size-9 rounded-xl shadow-lg overflow-hidden bg-white">
							<picture className="w-full h-full flex">
								<source srcSet={logoAvif} type="image/avif" />
								<source srcSet={logoWebp} type="image/webp" />
								<img src={logoWebp} alt="Semestack Logo" className="w-full h-full object-cover" />
							</picture>
						</div>
						<span className="text-lg font-bold tracking-tight text-slate-800 hidden sm:block drop-shadow-sm">Semestack</span>
					</div>
					<div className="flex items-center gap-2 px-3 py-1 bg-white/40 backdrop-blur-md border border-white/60 shadow-sm rounded-full">
						<span className="relative flex size-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full size-2 bg-blue-500"></span>
						</span>
						<span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider">Edge Active</span>
					</div>
				</div>
			</header>

			<main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center gap-16">
				
				<div className="flex flex-col items-center text-center gap-6 max-w-3xl w-full">
					<div className="inline-flex items-center px-3 py-1 text-xs font-semibold text-blue-800 bg-white/40 backdrop-blur-md border border-white/50 shadow-sm rounded-full tracking-wide">
						UNIVERSAL FULLSTACK FRAMEWORK
					</div>
					<h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 drop-shadow-sm">
						{stack[0]} <span className="text-blue-500">+</span> {stack[1]} <span className="text-blue-500">+</span> {stack[3]}
					</h1>
					<p className="text-lg/8 md:text-xl/8 text-slate-700 max-w-2xl font-medium drop-shadow-sm">
						A CLI tool to instantly scaffold a modern, full-stack web application. It combines the best of frontend and backend technologies with zero configuration, ready to deploy.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
					
					<div className="flex flex-col bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/40">
						<div className="p-6 border-b border-white/30 flex justify-between items-center bg-white/10">
							<div>
								<h2 className="text-sm font-bold text-slate-800">Edge Latency Ping</h2>
								<p className="text-xs text-slate-600 mt-0.5 font-medium">Measure response time from the edge</p>
							</div>
							<div className="px-2 py-1 rounded-lg bg-white/40 shadow-sm text-[10px] font-mono text-slate-700 font-bold border border-white/50">
								GET /api/health
							</div>
						</div>

						<div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[140px]">
							{pingLoading ? (
								<div className="flex flex-col items-center starting:opacity-0 opacity-100 transition-opacity duration-500">
									<div className="relative flex items-center justify-center size-14 mb-2">
										<div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
										<div className="absolute inset-2 rounded-full border-2 border-blue-500/50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite_0.3s]" />
										<div className="absolute inset-5 rounded-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
									</div>
									<span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase animate-pulse">Contacting Edge...</span>
								</div>
							) : pingStatus === "success" ? (
								<div className="flex flex-col items-center starting:opacity-0 starting:scale-95 opacity-100 scale-100 transition-all duration-300">
									<div className="flex items-baseline gap-1 text-blue-700 drop-shadow-sm">
										<span className="text-4xl font-black font-mono tracking-tighter">{pingLatency}</span>
										<span className="text-lg font-bold">ms</span>
									</div>
									<span className="text-[11px] text-slate-600 font-mono mt-2 bg-white/50 shadow-sm px-2 py-0.5 rounded-md border border-white/50">{systemTime}</span>
								</div>
							) : pingStatus === "error" ? (
								<span className="text-red-600 text-sm font-bold starting:opacity-0 opacity-100 transition-opacity duration-300 drop-shadow-sm">Connection Failed</span>
							) : (
								<span className="text-slate-500 font-mono text-sm font-medium starting:opacity-0 opacity-100 transition-opacity duration-300">Ready to ping</span>
							)}
						</div>

						<div className="p-4 border-t border-white/30 bg-white/10">
							<button
								onClick={triggerPing}
								disabled={pingLoading}
								className="w-full py-3 px-4 bg-slate-800/90 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg backdrop-blur-md border border-slate-700 cursor-pointer"
							>
								{pingLoading ? "Measuring..." : "Ping Edge Network"}
							</button>
						</div>
					</div>

					<div className="flex flex-col bg-white/30 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/40">
						<div className="p-6 border-b border-white/30 flex justify-between items-center bg-white/10">
							<div>
								<h2 className="text-sm font-bold text-slate-800">Interactive Greeting</h2>
								<p className="text-xs text-slate-600 mt-0.5 font-medium">Send a parameter to the edge API</p>
							</div>
							<div className="px-2 py-1 rounded-lg bg-white/40 shadow-sm text-[10px] font-mono text-slate-700 font-bold border border-white/50">
								GET /api/hello
							</div>
						</div>

						<div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[140px]">
							{greetingLoading ? (
								<div className="flex flex-col items-center gap-3 starting:opacity-0 opacity-100 transition-opacity duration-500">
									<svg className="size-8 animate-spin text-blue-600 drop-shadow-md" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									<span className="text-xs font-bold text-slate-500 animate-pulse tracking-wide uppercase">Processing...</span>
								</div>
							) : greetingMessage ? (
								<div className="flex flex-col items-center text-center starting:opacity-0 starting:scale-95 opacity-100 scale-100 transition-all duration-300">
									<p className="text-blue-700 font-bold text-lg drop-shadow-sm">{greetingMessage}</p>
									{greetingRuntime && (
										<span className="mt-2 text-[10px] font-mono text-slate-600 bg-white/50 shadow-sm px-2 py-0.5 rounded-md border border-white/50">
											Runtime: {greetingRuntime}
										</span>
									)}
								</div>
							) : (
								<span className="text-slate-500 font-mono text-sm font-medium starting:opacity-0 opacity-100 transition-opacity duration-300">Awaiting input</span>
							)}
						</div>

						<div className="p-4 border-t border-white/30 bg-white/10">
							<form onSubmit={sendGreeting} className="flex gap-2">
								<input
									type="text"
									value={nameInput}
									onChange={(e) => setNameInput(e.target.value)}
									placeholder="Enter your name"
									required
									disabled={greetingLoading}
									className="flex-1 bg-white/40 backdrop-blur-xl border border-white/60 shadow-inner focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 text-slate-900 placeholder-slate-500 rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-50 font-semibold"
								/>
								<button
									type="submit"
									disabled={greetingLoading || !nameInput.trim()}
									className="py-3 px-6 bg-blue-600/90 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none shadow-lg backdrop-blur-md border border-blue-500 cursor-pointer whitespace-nowrap"
								>
									{greetingLoading ? "Sending..." : "Send"}
								</button>
							</form>
						</div>
					</div>
				</div>

				<div className="w-full max-w-4xl mx-auto flex flex-col gap-4 items-center">
					<h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-500 text-center drop-shadow-sm">
						Configured Project Tech Stack
					</h3>
					<div className="flex flex-wrap items-center justify-center gap-3">
						{stack.map((tech, i) => (
							<div
								key={i}
								className="px-5 py-2 bg-white/30 backdrop-blur-md border border-white/50 rounded-xl text-xs font-bold text-slate-700 cursor-default shadow-sm hover:shadow-md hover:bg-white/40 transition-all duration-200"
							>
								{tech}
							</div>
						))}
					</div>
				</div>

			</main>

			<footer className="w-full py-8 border-t border-white/30 bg-white/20 backdrop-blur-lg mt-auto relative z-10">
				<div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
					<p className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
						Crafted with Semestack &bull; Built for the Edge &bull; {new Date().getFullYear()}
					</p>
				</div>
			</footer>
			
		</div>
	);
}
