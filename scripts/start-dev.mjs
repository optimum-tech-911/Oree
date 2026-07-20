import { createServer } from "node:net";
import { spawn } from "node:child_process";

const requestedPortIndex = process.argv.findIndex((argument) => argument === "--port");
const requestedPort = requestedPortIndex >= 0 ? Number(process.argv[requestedPortIndex + 1]) : null;
const candidates = requestedPort ? [requestedPort] : [5173, 5183, 5184, 5185];

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    // Vite listens on all interfaces by default. Testing IPv6 wildcard also
    // catches the common macOS case where another process owns the port on ::.
    server.listen({ host: "::", port }, () => {
      server.close(() => resolve(true));
    });
  });
}

const port = (await (async () => {
  for (const candidate of candidates) {
    if (Number.isInteger(candidate) && candidate > 0 && await isPortAvailable(candidate)) return candidate;
  }
  return null;
})());

if (!port) {
  console.error("Aucun port de développement disponible. Utilisez npm run dev -- --port 5190.");
  process.exit(1);
}

if (!requestedPort && port !== 5173) {
  console.warn(`Le port 5173 est déjà utilisé ; Vite démarre sur http://localhost:${port}/.`);
}

const viteArguments = process.argv.slice(2);
if (!viteArguments.includes("--host")) viteArguments.push("--host", "127.0.0.1");
if (requestedPortIndex < 0) viteArguments.push("--port", String(port));

const vite = spawn(process.execPath, ["node_modules/vite/bin/vite.js", ...viteArguments], {
  stdio: "inherit",
  env: { ...process.env, OREE_DEV_PORT: String(port) },
});

vite.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code ?? 1);
});
