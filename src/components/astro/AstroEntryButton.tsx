"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AstroEntryButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeModal = () => {
    if (submitting) return;
    setOpen(false);
    setPassword("");
    setError(null);
  };

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Password failed. Try again.");
        return;
      }

      setOpen(false);
      router.push("/astro");
      router.refresh();
    } catch {
      setError("Could not verify password right now. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-[44px] items-center rounded-full border border-[color:var(--gilt)]/70 bg-[color:var(--gilt)]/12 px-6 py-3 text-xs uppercase tracking-[0.28em] text-[color:var(--bone)] transition hover:bg-[color:var(--gilt)]/22"
      >
        Enter Natal Oracle
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="astro-beta-title"
        >
          <div className="w-full max-w-md rounded-3xl border border-[color:var(--copper)]/45 bg-[color:var(--char)]/95 p-6 shadow-2xl backdrop-blur-md sm:p-7">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[color:var(--mist)]">Private Beta</p>
            <h2 id="astro-beta-title" className="mt-2 font-ritual text-3xl text-[color:var(--bone)]">
              Natal Oracle Access
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--mist)]">
              Enter the beta password to continue.
            </p>

            <form className="mt-5 space-y-4" onSubmit={onSubmit}>
              <label className="block space-y-1 text-sm">
                <span className="text-[color:var(--bone)]">Password</span>
                <input
                  type="password"
                  autoFocus
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-h-[44px] w-full rounded-xl border border-[color:var(--copper)]/45 bg-[color:var(--bg)]/65 px-3 py-2 text-sm text-[color:var(--bone)]"
                  autoComplete="current-password"
                />
              </label>

              {error ? (
                <p
                  className="rounded-xl border border-rose-300/35 bg-rose-900/25 px-3 py-2 text-sm text-rose-100"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-[44px] rounded-full border border-[color:var(--gilt)]/65 bg-[color:var(--gilt)]/15 px-5 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--bone)] transition hover:bg-[color:var(--gilt)]/25 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Checking..." : "Continue"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="min-h-[44px] rounded-full border border-[color:var(--copper)]/45 bg-transparent px-5 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--mist)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
