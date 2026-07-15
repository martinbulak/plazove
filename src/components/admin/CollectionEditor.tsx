"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CollectionDef, FieldDef } from "@/lib/admin-schema";
import type { SourceRef } from "@/lib/types";

type Item = Record<string, unknown> & { id?: string };

const inputCls =
  "w-full rounded-lg border border-ink-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500";

export function CollectionEditor({
  def,
  initialItems,
}: {
  def: CollectionDef;
  initialItems: Item[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editing, setEditing] = useState<Item | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startNew() {
    const draft: Item = {};
    for (const f of def.fields) {
      if (f.default !== undefined) draft[f.name] = f.default;
    }
    setEditing(draft);
    setError(null);
  }

  function edit(item: Item) {
    setEditing({ ...item });
    setError(null);
  }

  function setField(name: string, value: unknown) {
    setEditing((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  async function save() {
    if (!editing) return;
    // validácia povinných polí
    for (const f of def.fields) {
      if (f.required && !String(editing[f.name] ?? "").trim()) {
        setError(`Pole „${f.label}" je povinné.`);
        return;
      }
    }
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/admin/collection/${def.name}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Uloženie zlyhalo.");
      return;
    }
    const { item } = await res.json();
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx === -1) return [...prev, item];
      const copy = [...prev];
      copy[idx] = item;
      return copy;
    });
    setEditing(null);
    router.refresh();
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Naozaj zmazať túto položku?")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/collection/${def.name}?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setBusy(false);
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-500">{items.length} položiek</p>
        <button
          onClick={startNew}
          className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
        >
          + Nová položka
        </button>
      </div>

      {/* Zoznam */}
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-ink-200 bg-white px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-900">
                {String(item[def.labelField] ?? "(bez názvu)")}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                {def.subField && item[def.subField] ? (
                  <span>{String(item[def.subField])}</span>
                ) : null}
                <StatusChip value={String(item.status ?? "concept")} />
                {item.isPlaceholder ? (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800">vzorové</span>
                ) : null}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => edit(item)}
                className="rounded-md border border-ink-300 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50"
              >
                Upraviť
              </button>
              <button
                onClick={() => remove(item.id)}
                disabled={busy}
                className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
              >
                Zmazať
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="rounded-lg border border-dashed border-ink-300 p-6 text-center text-sm text-ink-500">
            Zatiaľ žiadne položky. Pridajte prvú cez „Nová položka".
          </li>
        )}
      </ul>

      {/* Editor (modálny panel) */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink-900/40" onClick={() => setEditing(null)}>
          <div
            className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">
                {editing.id ? "Upraviť položku" : "Nová položka"}
              </h2>
              <button onClick={() => setEditing(null)} className="text-ink-500 hover:text-ink-800" aria-label="Zavrieť">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {def.fields.map((f) => (
                <FieldInput key={f.name} field={f} value={editing[f.name]} onChange={(v) => setField(f.name, v)} />
              ))}
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800" role="alert">
                {error}
              </p>
            )}

            <div className="mt-6 flex gap-2">
              <button
                onClick={save}
                disabled={busy}
                className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60"
              >
                {busy ? "Ukladám…" : "Uložiť"}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="rounded-lg border border-ink-300 px-5 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50"
              >
                Zrušiť
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusChip({ value }: { value: string }) {
  const published = value === "published";
  return (
    <span
      className={`rounded px-1.5 py-0.5 ${
        published ? "bg-emerald-100 text-emerald-800" : "bg-ink-100 text-ink-600"
      }`}
    >
      {published ? "publikované" : "koncept"}
    </span>
  );
}

/* ── Vykreslenie jedného poľa podľa typu ─────────────────────────────── */

function Label({ field, children }: { field: FieldDef; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-700">
        {field.label}
        {field.required && <span className="text-rose-600"> *</span>}
      </span>
      {children}
      {field.help && <span className="mt-1 block text-xs text-ink-500">{field.help}</span>}
    </label>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <Label field={field}>
          <textarea
            rows={field.name === "body" ? 10 : 3}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
          />
        </Label>
      );
    case "number":
      return (
        <Label field={field}>
          <input
            type="number"
            value={value === undefined || value === null ? "" : Number(value)}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
            className={inputCls}
          />
        </Label>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
          <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      );
    case "select":
      return (
        <Label field={field}>
          <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Label>
      );
    case "date":
      return (
        <Label field={field}>
          <input type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        </Label>
      );
    case "stringList": {
      const text = Array.isArray(value) ? (value as string[]).join("\n") : "";
      return (
        <Label field={field}>
          <textarea
            rows={3}
            value={text}
            placeholder="Jedna položka na riadok"
            onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
            className={inputCls}
          />
          <span className="mt-1 block text-xs text-ink-500">Jedna položka na riadok.</span>
        </Label>
      );
    }
    case "sourceRef":
      return <SourceRefInput field={field} value={value as SourceRef | undefined} onChange={onChange} />;
    case "sources":
      return <SourcesInput field={field} value={(value as SourceRef[]) ?? []} onChange={onChange} />;
    default:
      return (
        <Label field={field}>
          <input value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={inputCls} />
        </Label>
      );
  }
}

function SourceRefInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value?: SourceRef;
  onChange: (v: unknown) => void;
}) {
  const v = value ?? { label: "" };
  function set(patch: Partial<SourceRef>) {
    onChange({ ...v, ...patch });
  }
  return (
    <fieldset className="rounded-lg border border-ink-200 p-3">
      <legend className="px-1 text-sm font-medium text-ink-700">{field.label}</legend>
      <div className="space-y-2">
        <input placeholder="Popis (napr. Nájomná zmluva, čl. IV)" value={v.label ?? ""} onChange={(e) => set({ label: e.target.value })} className={inputCls} />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="ID dokumentu (voliteľné)" value={v.documentId ?? ""} onChange={(e) => set({ documentId: e.target.value || undefined })} className={inputCls} />
          <input placeholder="Strana PDF" type="number" value={v.page ?? ""} onChange={(e) => set({ page: e.target.value ? Number(e.target.value) : undefined })} className={inputCls} />
        </div>
        <input placeholder="URL (voliteľné)" value={v.url ?? ""} onChange={(e) => set({ url: e.target.value || undefined })} className={inputCls} />
      </div>
    </fieldset>
  );
}

function SourcesInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: SourceRef[];
  onChange: (v: unknown) => void;
}) {
  function update(idx: number, patch: Partial<SourceRef>) {
    const next = value.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange(next);
  }
  function add() {
    onChange([...value, { label: "" }]);
  }
  function removeAt(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }
  return (
    <fieldset className="rounded-lg border border-ink-200 p-3">
      <legend className="px-1 text-sm font-medium text-ink-700">{field.label}</legend>
      <div className="space-y-3">
        {value.map((s, i) => (
          <div key={i} className="rounded-md bg-ink-50 p-2">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-ink-500">Zdroj {i + 1}</span>
              <button type="button" onClick={() => removeAt(i)} className="text-xs text-rose-600 hover:underline">
                odstrániť
              </button>
            </div>
            <input placeholder="Popis zdroja" value={s.label ?? ""} onChange={(e) => update(i, { label: e.target.value })} className={`${inputCls} mb-1`} />
            <input placeholder="URL (voliteľné)" value={s.url ?? ""} onChange={(e) => update(i, { url: e.target.value || undefined })} className={inputCls} />
          </div>
        ))}
        <button type="button" onClick={add} className="rounded-md border border-ink-300 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50">
          + Pridať zdroj
        </button>
      </div>
    </fieldset>
  );
}
