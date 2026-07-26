"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DocumentItem } from "@/lib/types";

/**
 * Nahrávanie PDF k existujúcim dokumentom.
 *
 * Zoznam ukazuje, ktorým dokumentom ešte chýba súbor. Pri každom sa dá PDF
 * priamo nahrať – uloží sa do Vercel Blob (produkcia) alebo do /public/dokumenty
 * (lokálne) a jeho adresa sa zapíše do poľa `fileUrl` daného dokumentu.
 */
export function DocumentUploader({ documents }: { documents: DocumentItem[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // Články a vyjadrenia s odkazom na zdroj nepotrebujú vlastné PDF.
  const missing = documents.filter((d) => !d.fileUrl && !d.sourceUrl);
  const linkedOnly = documents.filter((d) => !d.fileUrl && d.sourceUrl);
  const withFile = documents.filter((d) => d.fileUrl);

  async function upload(doc: DocumentItem, file: File) {
    setBusyId(doc.id);
    setErr(null);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const upData = await up.json().catch(() => ({}));
      if (!up.ok) throw new Error(upData.error ?? "Nahrávanie zlyhalo.");

      const save = await fetch("/api/admin/collection/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id, fileUrl: upData.url }),
      });
      const saveData = await save.json().catch(() => ({}));
      if (!save.ok) throw new Error(saveData.error ?? "Uloženie zlyhalo.");

      setMsg(`„${doc.title}" – PDF nahraté a pripojené.`);
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusyId(null);
    }
  }

  function Row({ doc }: { doc: DocumentItem }) {
    return (
      <li className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-900">{doc.title}</p>
          <p className="mt-0.5 text-xs text-ink-500">
            {doc.date} · {doc.issuer}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {doc.fileUrl && (
            <a
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-brand-700 underline"
            >
              Zobraziť PDF
            </a>
          )}
          <label className="cursor-pointer rounded-md border border-ink-300 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50">
            {busyId === doc.id
              ? "Nahrávam…"
              : doc.fileUrl
                ? "Nahradiť PDF"
                : "Nahrať PDF"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={busyId !== null}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(doc, f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </li>
    );
  }

  return (
    <div className="mb-8 rounded-xl border border-ink-200 bg-white p-5">
      <h2 className="text-base font-bold text-ink-900">Súbory k dokumentom</h2>
      <p className="mt-1 text-sm text-ink-600">
        Nahrané PDF sa zverejní na stránke Dokumenty. Maximálna veľkosť 25 MB.
      </p>

      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
        <strong>Pred nahratím skontrolujte osobné údaje.</strong> Dokumenty od
        úradov často obsahujú meno, adresu alebo e-mail žiadateľa. Také miesta
        treba v PDF začierniť – po nahratí je súbor verejne dostupný.
      </div>

      {msg && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          {msg}
        </p>
      )}
      {err && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
          {err}
        </p>
      )}

      {/* Chýbajúce súbory */}
      <div className="mt-5">
        <p className="text-sm font-semibold text-ink-800">
          Chýba súbor ({missing.length})
        </p>
        {missing.length === 0 ? (
          <p className="mt-1 text-sm text-ink-500">
            Všetky dokumenty, ktoré si vyžadujú súbor, ho už majú.
          </p>
        ) : (
          <ul className="mt-1 divide-y divide-ink-100">
            {missing.map((d) => (
              <Row key={d.id} doc={d} />
            ))}
          </ul>
        )}
      </div>

      {/* Dostupné len ako odkaz */}
      {linkedOnly.length > 0 && (
        <details className="group mt-5">
          <summary className="cursor-pointer list-none text-sm font-semibold text-ink-700 hover:underline [&::-webkit-details-marker]:hidden">
            Dostupné online odkazom ({linkedOnly.length}) ↓
          </summary>
          <p className="mt-1 text-xs text-ink-500">
            Tieto položky sú články alebo vyjadrenia s odkazom na pôvodný zdroj,
            vlastné PDF nepotrebujú. Nahrať ho však môžete (napr. archívnu kópiu).
          </p>
          <ul className="mt-1 divide-y divide-ink-100">
            {linkedOnly.map((d) => (
              <Row key={d.id} doc={d} />
            ))}
          </ul>
        </details>
      )}

      {/* Už nahraté */}
      {withFile.length > 0 && (
        <details className="group mt-4">
          <summary className="cursor-pointer list-none text-sm font-semibold text-ink-700 hover:underline [&::-webkit-details-marker]:hidden">
            So súborom ({withFile.length}) ↓
          </summary>
          <ul className="mt-1 divide-y divide-ink-100">
            {withFile.map((d) => (
              <Row key={d.id} doc={d} />
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
