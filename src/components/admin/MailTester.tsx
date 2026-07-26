"use client";

import { useState } from "react";

/**
 * Skúšobné odoslanie e-mailu. Ukáže presnú chybovú správu od Resendu –
 * najčastejšie ide o neoverenú doménu odosielateľa alebo neplatný kľúč.
 */
export function MailTester({ configured }: { configured: boolean }) {
  const [to, setTo] = useState("");
  const [state, setState] = useState<
    { kind: "idle" | "sending" } | { kind: "ok" | "error"; message: string }
  >({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/admin/test-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      setState(
        res.ok
          ? { kind: "ok", message: data.message || "Odoslané." }
          : { kind: "error", message: data.error || `Chyba ${res.status}.` },
      );
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Odoslanie zlyhalo.",
      });
    }
  }

  return (
    <div className="rounded-xl border border-ink-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-ink-900">Odosielanie e-mailov</h3>
        <span
          className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${
            configured
              ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
              : "bg-amber-50 text-amber-900 ring-amber-200"
          }`}
        >
          {configured ? "Nastavené" : "Nenastavené"}
        </span>
      </div>

      <p className="mt-1 text-xs leading-relaxed text-ink-600">
        {configured
          ? "Pošlite si skúšobný e-mail a overte, že potvrdzovacie správy k výzve naozaj dorazia."
          : "Chýba RESEND_API_KEY alebo MAIL_FROM. Bez nich sa potvrdzovacie e-maily neodošlú a podpisy výzvy sa nedajú potvrdiť."}
      </p>

      <form onSubmit={submit} className="mt-3 flex flex-wrap gap-2">
        <input
          type="email"
          required
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="vasa@adresa.sk"
          className="min-w-0 flex-1 rounded-lg border border-ink-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={!configured || state.kind === "sending"}
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state.kind === "sending" ? "Odosielam…" : "Poslať skúšobný e-mail"}
        </button>
      </form>

      {(state.kind === "ok" || state.kind === "error") && (
        <p
          className={`mt-2 rounded-lg px-3 py-2 text-xs leading-relaxed ${
            state.kind === "ok"
              ? "bg-emerald-50 text-emerald-900"
              : "bg-rose-50 text-rose-900"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
