#!/usr/bin/env node
import("../dist/index.mjs")
	.then(({ main }) => main())
	.catch((err) => {
		console.error("Failed to run Semestack:", err);
		process.exit(1);
	});
