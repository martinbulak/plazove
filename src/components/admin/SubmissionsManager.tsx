"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsletterSubscriber, PetitionSignature, Submission } from "@/lib/types";

type Tab = "petition" | "newsletter" | "submissions";

export function SubmissionsManager({
  petition,
  newsletter,
  submissions,
}: {
  petition: PetitionSignature[];
  newsletter: NewsletterSubscriber[];
  submissions: Submission[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("petition");
  const [busy, setBusy] = useState(false);

  async function act(file: Tab, id: string, action: string) {
    if (action === "delete" && !confirm("Naozaj zmazať tento záznam?")) return;
    setBusy(true);
    await fetch("/api/admin/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file, id, action }),
    });
    setBusy(false);
    router.refresh();
  }

  const tabs: { key: Tab; label: string; n: number }[] = [
    { key: "petition", label: "Podpisy výzvy", n: petition.length },
    { key: "newsletter", label: "Newsletter", n: newsletter.length },
    { key: "submissions", label: "Tipy / foto / opravy", n: submissions.length },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === t.key ? "bg-brand-700 text-white" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:bg-ink-50"
            }`}
          >
            {t.label} ({t.n})
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-ink-200 bg-white p-2">
        {tab === "petition" && (
          <Table
            head={["Meno", "Mesto", "E-mail", "Verejne", "Potvrdené", ""]}
            rows={petition.map((p) => [
              `${p.firstName} ${p.lastName}`,
              p.city,
              p.email,
              p.showPublicly ? "áno" : "nie",
              p.confirmed ? "✓" : "čaká",
              <Actions key={p.id} busy={busy} onDelete={() => act("petition", p.id, "delete")} />,
            ])}
          />
        )}
        {tab === "newsletter" && (
          <Table
            head={["E-mail", "Potvrdené", "Vytvorené", ""]}
            rows={newsletter.map((n) => [
              n.email,
              n.confirmed ? "✓" : "čaká",
              n.createdAt.slice(0, 10),
              <Actions key={n.id} busy={busy} onDelete={() => act("newsletter", n.id, "delete")} />,
            ])}
          />
        )}
        {tab === "submissions" && (
          <Table
            head={["Typ", "Od", "Správa", "Stav", ""]}
            rows={submissions.map((s) => [
              TYPE_LABEL[s.type],
              [s.name, s.email].filter(Boolean).join(" · ") || "—",
              <span key="m" className="block max-w-md whitespace-pre-wrap text-ink-700">{s.message}</span>,
              s.handled ? "vybavené" : "nové",
              <Actions
                key={s.id}
                busy={busy}
                onToggle={() => act("submissions", s.id, s.handled ? "markUnhandled" : "markHandled")}
                toggleLabel={s.handled ? "Označiť ako nové" : "Označiť vybavené"}
                onDelete={() => act("submissions", s.id, "delete")}
              />,
            ])}
          />
        )}
      </div>

      <p className="mt-4 text-xs text-ink-500">
        Podania obsahujú osobné údaje. Uchovávajte ich len nevyhnutne dlho a
        rešpektujte práva dotknutých osôb podľa zásad ochrany osobných údajov.
      </p>
    </div>
  );
}

const TYPE_LABEL: Record<Submission["type"], string> = {
  tip: "Tip / dokument",
  photo: "Fotografia",
  correction: "Nahlásenie / oprava",
};

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  if (rows.length === 0) {
    return <p className="p-6 text-center text-sm text-ink-500">Žiadne záznamy.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-ink-500">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-3 py-2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.map((row, i) => (
            <tr key={i} className="align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-ink-700">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Actions({
  busy,
  onDelete,
  onToggle,
  toggleLabel,
}: {
  busy: boolean;
  onDelete: () => void;
  onToggle?: () => void;
  toggleLabel?: string;
}) {
  return (
    <div className="flex gap-2 whitespace-nowrap">
      {onToggle && (
        <button onClick={onToggle} disabled={busy} className="rounded border border-ink-300 px-2 py-1 text-xs text-ink-700 hover:bg-ink-50">
          {toggleLabel}
        </button>
      )}
      <button onClick={onDelete} disabled={busy} className="rounded border border-rose-200 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50">
        Zmazať
      </button>
    </div>
  );
}
