
import { useEffect, useState } from "react";

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function checkHealth() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseUrl}/api/health/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setHealth(data);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error ? err.message : "Connection failed"
        );
      }
    }

    checkHealth();

    return () => controller.abort();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 p-6 text-zinc-100">
      <section className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-amber-400">
          Interactive storytelling
        </p>

        <h1 className="mb-4 text-4xl font-bold">StoryWeaver</h1>

        <p className="mb-6 text-zinc-400">
          Every choice opens a new path.
        </p>

        {health ? (
          <p className="text-emerald-400">
            ● {health.application} connected
          </p>
        ) : error ? (
          <p className="text-red-400">● {error}</p>
        ) : (
          <p className="text-amber-400">
            Connecting to backend...
          </p>
        )}
      </section>
    </main>
  );
}
