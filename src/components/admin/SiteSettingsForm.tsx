"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HeroFact, SiteConfig } from "@/lib/types";
import { CLAIM_KIND_LABEL, type ClaimKind } from "@/lib/types";

const inputCls =
  "w-full rounded-lg border border-ink-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500";

const CLAIM_OPTIONS = Object.entries(CLAIM_KIND_LABEL) as [ClaimKind, string][];

export function SiteSettingsForm({ initial }: { initial: SiteConfig }) {
  const router = useRouter();
  const [site, setSite] = useState<SiteConfig>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function set<K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) {
    setSite((s) => ({ ...s, [key]: value }));
  }

  function setFact(idx: number, patch: Partial<HeroFact>) {
    set("heroFacts", site.heroFacts.map((f, i) => (i === idx ? { ...f, ...patch } : f)));
  }
  function addFact() {
    set("heroFacts", [...site.heroFacts, { label: "", value: "", kind: "fact" }]);
  }
  function removeFact(idx: number) {
    set("heroFacts", site.heroFacts.filter((_, i) => i !== idx));
  }

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setBusy(false);
    setMsg(res.ok ? "Uložené." : "Uloženie zlyhalo.");
    if (res.ok) router.refresh();
  }

  const Text = ({ label, k, area }: { label: string; k: keyof SiteConfig; area?: boolean }) => (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-700">{label}</span>
      {area ? (
        <textarea rows={3} value={String(site[k] ?? "")} onChange={(e) => set(k, e.target.value as never)} className={inputCls} />
      ) : (
        <input value={String(site[k] ?? "")} onChange={(e) => set(k, e.target.value as never)} className={inputCls} />
      )}
    </label>
  );

  return (
    <div className="max-w-2xl space-y-5">
      <div className="rounded-xl border border-ink-200 bg-white p-5 space-y-4">
        <Text label="Názov webu" k="siteName" />
        <Text label="Podtitul (tagline)" k="tagline" />
        <Text label="Hlavný nadpis (hero)" k="heroTitle" area />
        <Text label="Podnadpis (hero)" k="heroSubtitle" area />
        <Text label="Upozornenie o nezávislosti" k="disclaimer" area />
        <Text label="Kontaktný e-mail" k="contactEmail" />
        <Text label="Prevádzkovateľ" k="operator" />
        <Text label="Text verejnej výzvy" k="petitionText" area />
      </div>

      <div className="rounded-xl border border-ink-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-900">Základné fakty (hero)</h2>
          <button onClick={addFact} className="rounded-md border border-ink-300 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50">
            + Pridať
          </button>
        </div>
        <div className="space-y-3">
          {site.heroFacts.map((f, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-lg bg-ink-50 p-2 sm:grid-cols-[1fr_1fr_auto_auto]">
              <input placeholder="Popis" value={f.label} onChange={(e) => setFact(i, { label: e.target.value })} className={inputCls} />
              <input placeholder="Hodnota" value={f.value} onChange={(e) => setFact(i, { value: e.target.value })} className={inputCls} />
              <select value={f.kind} onChange={(e) => setFact(i, { kind: e.target.value as ClaimKind })} className={inputCls}>
                {CLAIM_OPTIONS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <button onClick={() => removeFact(i)} className="rounded-md border border-rose-200 px-2 text-xs text-rose-700 hover:bg-rose-50">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={save} disabled={busy} className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
          {busy ? "Ukladám…" : "Uložiť nastavenia"}
        </button>
        {msg && <span className="text-sm text-ink-600">{msg}</span>}
      </div>
    </div>
  );
}
