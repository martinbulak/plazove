"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Nahrávanie fotografií do galérie.
 *
 * Obrázky sa pred odoslaním zmenšia priamo v prehliadači (max. 1600 px,
 * JPEG q0.82) – server tak nepotrebuje sharp a nahrávanie je rýchle aj
 * z mobilu. Ku každej fotke sa dá hneď vyplniť popis, alt text, dátum
 * a autor; uložením vzniknú položky v galérii.
 */

const MAX_EDGE = 1600;
const QUALITY = 0.82;

interface Draft {
  key: string;
  file: File;
  preview: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  date: string;
  credit: string;
  origin: "own" | "external";
  status: "published" | "concept";
  state: "ready" | "uploading" | "done" | "error";
  error?: string;
}

/** Zmenší obrázok na max. MAX_EDGE a vráti JPEG blob + rozmery. */
async function shrink(file: File): Promise<{ blob: Blob; w: number; h: number; url: string }> {
  const bitmap = await createImageBitmap(file);
  let { width: w, height: h } = bitmap;
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  w = Math.round(w * scale);
  h = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob: Blob = await new Promise((res) =>
    canvas.toBlob((b) => res(b!), "image/jpeg", QUALITY),
  );
  return { blob, w, h, url: URL.createObjectURL(blob) };
}

const inputCls =
  "w-full rounded-lg border border-ink-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500";

export function GalleryUploader() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  /** Spoločné hodnoty, ktoré sa predvyplnia do každej novej fotky. */
  const [bulkDate, setBulkDate] = useState("");
  const [bulkCredit, setBulkCredit] = useState("");

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    setMsg(null);
    const next: Draft[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      try {
        const { blob, w, h, url } = await shrink(f);
        next.push({
          key: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
          file: new File([blob], f.name.replace(/\.[^.]+$/, "") + ".jpg", {
            type: "image/jpeg",
          }),
          preview: url,
          width: w,
          height: h,
          alt: "",
          caption: "",
          date: bulkDate,
          credit: bulkCredit,
          origin: "external",
          status: "published",
          state: "ready",
        });
      } catch {
        /* nečitateľný súbor preskočíme */
      }
    }
    setDrafts((d) => [...d, ...next]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function patch(key: string, p: Partial<Draft>) {
    setDrafts((d) => d.map((x) => (x.key === key ? { ...x, ...p } : x)));
  }

  function removeDraft(key: string) {
    setDrafts((d) => d.filter((x) => x.key !== key));
  }

  /** Predvyplní dátum/autora do všetkých fotiek, ktoré ich ešte nemajú. */
  function applyBulk() {
    setDrafts((d) =>
      d.map((x) => ({
        ...x,
        date: x.date || bulkDate,
        credit: x.credit || bulkCredit,
      })),
    );
  }

  async function saveAll() {
    const pending = drafts.filter((d) => d.state !== "done");
    if (!pending.length) return;

    const missingAlt = pending.find((d) => !d.alt.trim());
    if (missingAlt) {
      setMsg("Pri každej fotografii vyplňte alt text – je povinný kvôli prístupnosti.");
      return;
    }

    setBusy(true);
    setMsg(null);
    let ok = 0;

    for (const d of pending) {
      patch(d.key, { state: "uploading", error: undefined });
      try {
        const fd = new FormData();
        fd.append("file", d.file);
        const up = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const upData = await up.json().catch(() => ({}));
        if (!up.ok) throw new Error(upData.error ?? "Nahrávanie zlyhalo.");

        const save = await fetch("/api/admin/collection/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            src: upData.url,
            alt: d.alt.trim(),
            caption: d.caption.trim() || undefined,
            date: d.date || undefined,
            credit: d.credit.trim() || undefined,
            origin: d.origin,
            width: d.width,
            height: d.height,
            status: d.status,
          }),
        });
        const saveData = await save.json().catch(() => ({}));
        if (!save.ok) throw new Error(saveData.error ?? "Uloženie položky zlyhalo.");

        patch(d.key, { state: "done" });
        ok++;
      } catch (e) {
        patch(d.key, { state: "error", error: (e as Error).message });
      }
    }

    setBusy(false);
    setMsg(
      ok === pending.length
        ? `Nahraných ${ok} fotografií. Nájdete ich v zozname nižšie.`
        : `Nahraných ${ok} z ${pending.length}. Pri zvyšných je uvedená chyba.`,
    );
    if (ok > 0) router.refresh();
  }

  const pendingCount = drafts.filter((d) => d.state !== "done").length;
  const doneCount = drafts.filter((d) => d.state === "done").length;

  return (
    <div className="mb-8 rounded-xl border border-ink-200 bg-white p-5">
      <h2 className="text-base font-bold text-ink-900">Nahrať fotografie</h2>
      <p className="mt-1 text-sm text-ink-600">
        Vyberte jednu alebo viac fotografií. Zmenšia sa priamo v prehliadači na
        max. {MAX_EDGE} px, takže sa dajú nahrať aj priamo z mobilu.
      </p>

      {/* Hromadné predvyplnenie */}
      <div className="mt-4 grid gap-3 rounded-lg bg-ink-50 p-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-600">
            Dátum pre všetky
          </span>
          <input
            type="date"
            value={bulkDate}
            onChange={(e) => setBulkDate(e.target.value)}
            className={inputCls}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-600">
            Autor / zdroj pre všetky
          </span>
          <input
            value={bulkCredit}
            onChange={(e) => setBulkCredit(e.target.value)}
            placeholder="napr. Meno Priezvisko"
            className={inputCls}
          />
        </label>
        <button
          type="button"
          onClick={applyBulk}
          className="self-end rounded-lg border border-ink-300 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-white"
        >
          Použiť na všetky
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => onPick(e.target.files)}
        className="mt-4 block w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-800"
      />

      {drafts.length > 0 && (
        <ul className="mt-5 space-y-4">
          {drafts.map((d) => (
            <li
              key={d.key}
              className={`rounded-lg border p-3 ${
                d.state === "done"
                  ? "border-emerald-200 bg-emerald-50"
                  : d.state === "error"
                    ? "border-rose-200 bg-rose-50"
                    : "border-ink-200"
              }`}
            >
              <div className="flex gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.preview}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded-md object-cover ring-1 ring-ink-200"
                />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-ink-600">
                        Alt text <span className="text-rose-600">*</span>
                      </span>
                      <input
                        value={d.alt}
                        onChange={(e) => patch(d.key, { alt: e.target.value })}
                        placeholder="Čo je na fotografii"
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-ink-600">
                        Popis pod fotkou
                      </span>
                      <input
                        value={d.caption}
                        onChange={(e) => patch(d.key, { caption: e.target.value })}
                        className={inputCls}
                      />
                    </label>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-4">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-ink-600">
                        Dátum
                      </span>
                      <input
                        type="date"
                        value={d.date}
                        onChange={(e) => patch(d.key, { date: e.target.value })}
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-ink-600">
                        Autor / zdroj
                      </span>
                      <input
                        value={d.credit}
                        onChange={(e) => patch(d.key, { credit: e.target.value })}
                        className={inputCls}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-ink-600">
                        Pôvod
                      </span>
                      <select
                        value={d.origin}
                        onChange={(e) =>
                          patch(d.key, { origin: e.target.value as Draft["origin"] })
                        }
                        className={inputCls}
                      >
                        <option value="own">Vlastná</option>
                        <option value="external">Prevzatá</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-ink-600">
                        Stav
                      </span>
                      <select
                        value={d.status}
                        onChange={(e) =>
                          patch(d.key, { status: e.target.value as Draft["status"] })
                        }
                        className={inputCls}
                      >
                        <option value="published">Publikované</option>
                        <option value="concept">Koncept</option>
                      </select>
                    </label>
                  </div>

                  <p className="text-xs text-ink-500">
                    {d.width} × {d.height} px · {(d.file.size / 1024).toFixed(0)} KB
                    {d.state === "uploading" && " · nahrávam…"}
                    {d.state === "done" && " · ✓ nahraté"}
                    {d.state === "error" && (
                      <span className="font-semibold text-rose-700"> · {d.error}</span>
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeDraft(d.key)}
                  className="h-7 shrink-0 rounded border border-ink-300 px-2 text-xs text-ink-600 hover:bg-ink-50"
                >
                  Odobrať
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {doneCount > 0 && (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-900">
          <strong>Poznámka pre lokálne spustenie:</strong> pri <code>npm run start</code>{" "}
          sa novo nahrané súbory z priečinka <code>public/</code> začnú zobrazovať
          až po reštarte servera. Na Verceli s nastaveným Blob úložiskom sa
          zobrazia okamžite.
        </p>
      )}

      {msg && (
        <p className="mt-4 rounded-lg bg-ink-100 px-3 py-2 text-sm text-ink-700" role="status">
          {msg}
        </p>
      )}

      {pendingCount > 0 && (
        <button
          type="button"
          onClick={saveAll}
          disabled={busy}
          className="mt-4 rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
        >
          {busy ? "Nahrávam…" : `Nahrať a uložiť (${pendingCount})`}
        </button>
      )}
    </div>
  );
}
