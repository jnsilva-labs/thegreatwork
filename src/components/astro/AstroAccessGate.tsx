"use client";

import { useState } from "react";

export function AstroAccessGate() {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!password.trim()) {
      setError("Enter the private beta password.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/astro/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Password failed. Try again.");
        return;
      }

      window.location.reload();
    } catch {
      setError("Could not verify password right now. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl rounded-3xl border border-[color:var(--copper)]/45 bg-[color:var(--char)]/70 p-6 shadow-2xl backdrop-blur-md sm:p-8">
      <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--mist)]">Private Beta</p>
      <h1 className="mt-2 font-ritual text-3xl text-[color:var(--bone)] sm:text-4xl">Natal Oracle Access</h1>
      <p className="mt-3 text-sm leading-relaxed text-[color:var(--mist)]">
        This area is in closed testing. Enter the beta password to continue.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1 text-sm">
          <span className="text-[color:var(--bone)]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-[44px] w-full rounded-xl border border-[color:var(--copper)]/45 bg-[color:var(--bg)]/65 px-3 py-2 text-sm text-[color:var(--bone)]"
            autoComplete="current-password"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="min-h-[44px] rounded-full border border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/15 px-6 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--bone)] transition hover:bg-[color:var(--gilt)]/25 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Checking..." : "Enter Beta"}
        </button>

        {error ? (
          <p
            className="rounded-xl border border-rose-300/35 bg-rose-900/25 px-3 py-2 text-sm text-rose-100"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
