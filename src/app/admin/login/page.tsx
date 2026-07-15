"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: form.get("password") }),
    });
    setLoading(false);
    if (res.ok) {
      const next = params.get("next") || "/admin";
      router.replace(next);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Prihlásenie zlyhalo.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-8 shadow-sm">
      <h1 className="text-xl font-bold text-ink-900">Administrácia</h1>
      <p className="mt-1 text-sm text-ink-500">Aqualand BB – verejná kontrola</p>

      <label className="mt-6 block">
        <span className="mb-1 block text-sm font-medium text-ink-700">Heslo</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          className="w-full rounded-lg border border-ink-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-brand-500"
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
      >
        {loading ? "Prihlasujem…" : "Prihlásiť sa"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
