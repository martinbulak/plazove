"use client";

import { useState, type FormEvent, type ReactNode } from "react";

/* ── Spoločné pomôcky ────────────────────────────────────────────────── */

type FormState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; message: string }
  | { status: "error"; message: string };

function useSubmit(endpoint: string) {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function submit(payload: Record<string, unknown>) {
    setState({ status: "loading" });
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setState({ status: "error", message: data.error ?? "Odoslanie zlyhalo." });
        return false;
      }
      setState({ status: "ok", message: data.message ?? "Hotovo. Ďakujeme!" });
      return true;
    } catch {
      setState({ status: "error", message: "Sieťová chyba. Skúste to znova." });
      return false;
    }
  }

  return { state, submit };
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-700">
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-ink-300 px-3.5 py-2.5 text-sm shadow-sm focus:border-brand-500";

/** Skryté honeypot pole proti spamu. */
function Honeypot() {
  return (
    <div aria-hidden className="absolute left-[-9999px]" tabIndex={-1}>
      <label>
        Nevypĺňať
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function Alert({ state }: { state: FormState }) {
  if (state.status === "ok")
    return (
      <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200" role="status">
        {state.message}
      </p>
    );
  if (state.status === "error")
    return (
      <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800 ring-1 ring-rose-200" role="alert">
        {state.message}
      </p>
    );
  return null;
}

function SubmitBtn({ state, children }: { state: FormState; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={state.status === "loading"}
      className="inline-flex items-center justify-center rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-semibold text-ink-900 hover:bg-accent-600 hover:text-white disabled:opacity-60"
    >
      {state.status === "loading" ? "Odosielam…" : children}
    </button>
  );
}

/* ── Verejná výzva ───────────────────────────────────────────────────── */

const MESSAGE_MAX = 280;

export function PetitionForm() {
  const { state, submit } = useSubmit("/api/vyzva");
  const [msgLen, setMsgLen] = useState(0);
  const [mode, setMode] = useState<"full" | "first" | "none">("first");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const ok = await submit({
      firstName: f.get("firstName"),
      lastName: f.get("lastName"),
      city: f.get("city"),
      email: f.get("email"),
      message: f.get("message"),
      publishMode: f.get("publishMode"),
      consent: f.get("consent") === "on",
      website: f.get("website"),
    });
    if (ok) {
      form.reset();
      setMsgLen(0);
      setFirstName("");
      setLastName("");
      setCity("");
      setMode("first");
    }
  }

  /** Živý náhľad toho, čo sa reálne objaví na webe. */
  const previewName =
    mode === "none"
      ? null
      : mode === "first"
        ? firstName || "Meno"
        : `${firstName || "Meno"} ${lastName || "Priezvisko"}`;

  const MODES: { v: typeof mode; label: string; hint: string }[] = [
    { v: "first", label: "Iba krstné meno a mesto", hint: "Odporúčané – priezvisko sa nezverejní" },
    { v: "full", label: "Meno, priezvisko a mesto", hint: "Plné meno bude viditeľné" },
    { v: "none", label: "Nezverejňovať", hint: "Podpis sa iba započíta do počtu" },
  ];

  return (
    <form onSubmit={onSubmit} className="relative space-y-5">
      <Honeypot />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Meno" required>
          <input
            name="firstName"
            required
            maxLength={80}
            className={inputCls}
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Field>
        <Field label="Priezvisko" required>
          <input
            name="lastName"
            required
            maxLength={80}
            className={inputCls}
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mesto" required>
          <input
            name="city"
            required
            maxLength={120}
            className={inputCls}
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Field>
        <Field label="E-mail (na overenie)" required>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            className={inputCls}
            autoComplete="email"
          />
        </Field>
      </div>

      {/* Verejný odkaz */}
      <Field label="Odkaz mestu (nepovinné, zverejní sa)">
        <textarea
          name="message"
          rows={3}
          maxLength={MESSAGE_MAX}
          className={inputCls}
          placeholder="Napríklad prečo vám na kúpalisku záleží…"
          onChange={(e) => setMsgLen(e.target.value.length)}
        />
        <span className="mt-1 flex justify-between text-xs text-ink-500">
          <span>Bez webových adries. Odkaz sa zverejní hneď po overení e-mailu.</span>
          <span className="tabular-nums">
            {msgLen}/{MESSAGE_MAX}
          </span>
        </span>
      </Field>

      {/* Rozsah zverejnenia */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-ink-700">
          Ako sa má zobraziť váš podpis?
        </legend>
        <div className="space-y-2">
          {MODES.map((m) => (
            <label
              key={m.v}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                mode === m.v
                  ? "border-brand-400 bg-brand-50"
                  : "border-ink-200 bg-white hover:border-ink-300"
              }`}
            >
              <input
                type="radio"
                name="publishMode"
                value={m.v}
                checked={mode === m.v}
                onChange={() => setMode(m.v)}
                className="mt-0.5"
              />
              <span>
                <span className="block font-medium text-ink-900">{m.label}</span>
                <span className="block text-xs text-ink-500">{m.hint}</span>
              </span>
            </label>
          ))}
        </div>

        <p className="mt-2 rounded-lg bg-ink-100 px-3 py-2 text-xs text-ink-600">
          <strong>Na webe sa zobrazí:</strong>{" "}
          {previewName ? (
            <span className="font-medium text-ink-900">
              {previewName}
              {city ? `, ${city}` : ""}
            </span>
          ) : (
            <span className="italic">nič – podpis sa iba započíta</span>
          )}
          . E-mail nezverejňujeme nikdy.
        </p>
      </fieldset>

      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>
          Súhlasím so spracovaním osobných údajov na účel evidencie podpisov výzvy
          v zmysle{" "}
          <a href="/ochrana-osobnych-udajov" className="underline text-brand-700">
            zásad ochrany osobných údajov
          </a>
          . <span className="text-rose-600">*</span>
        </span>
      </label>

      <Alert state={state} />
      <SubmitBtn state={state}>Podpísať výzvu</SubmitBtn>
      <p className="text-xs text-ink-500">
        Podpis sa započíta až po potvrdení e-mailu. Ide o verejnú výzvu, nie
        o formálnu elektronickú petíciu podľa zákona.
      </p>
    </form>
  );
}

/* ── Newsletter ──────────────────────────────────────────────────────── */

export function NewsletterForm() {
  const { state, submit } = useSubmit("/api/newsletter");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const ok = await submit({
      email: f.get("email"),
      consent: f.get("consent") === "on",
      website: f.get("website"),
    });
    if (ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-3">
      <Honeypot />
      <Field label="E-mail" required>
        <input name="email" type="email" required className={inputCls} autoComplete="email" />
      </Field>
      <label className="flex items-start gap-2 text-sm text-ink-700">
        <input type="checkbox" name="consent" required className="mt-1" />
        <span>Súhlasím so spracovaním e-mailu na účel zasielania noviniek. <span className="text-rose-600">*</span></span>
      </label>
      <Alert state={state} />
      <SubmitBtn state={state}>Prihlásiť sa na odber</SubmitBtn>
    </form>
  );
}

/* ── Podanie (tip / fotografia / oprava) ─────────────────────────────── */

export function SubmissionForm({
  type,
  submitLabel,
}: {
  type: "tip" | "photo" | "correction";
  submitLabel: string;
}) {
  const { state, submit } = useSubmit("/api/submission");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const ok = await submit({
      type,
      name: f.get("name"),
      email: f.get("email"),
      message: f.get("message"),
      attachmentNote: f.get("attachmentNote"),
      photoConsent: f.get("photoConsent") === "on",
      website: f.get("website"),
    });
    if (ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-3">
      <Honeypot />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Meno (nepovinné)">
          <input name="name" className={inputCls} maxLength={120} />
        </Field>
        <Field label="E-mail (nepovinné)">
          <input name="email" type="email" className={inputCls} maxLength={254} />
        </Field>
      </div>
      <Field label={type === "photo" ? "Popis fotografie / odkaz" : "Správa"} required>
        <textarea name="message" required rows={4} maxLength={5000} className={inputCls} />
      </Field>
      {type === "photo" && (
        <>
          <Field label="Odkaz na fotografiu (napr. cloud, ak je veľká)">
            <input name="attachmentNote" className={inputCls} maxLength={500} placeholder="https://…" />
          </Field>
          <label className="flex items-start gap-2 text-sm text-ink-700">
            <input type="checkbox" name="photoConsent" required className="mt-1" />
            <span>
              Potvrdzujem, že som autorom fotografie alebo mám právo ju poskytnúť,
              súhlasím s jej zverejnením a fotografia neprimerane nezasahuje do
              súkromia iných osôb. <span className="text-rose-600">*</span>
            </span>
          </label>
        </>
      )}
      <Alert state={state} />
      <SubmitBtn state={state}>{submitLabel}</SubmitBtn>
    </form>
  );
}

/* ── Zdieľanie ───────────────────────────────────────────────────────── */

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const enc = encodeURIComponent(url);
  const encT = encodeURIComponent(title);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const btn =
    "inline-flex items-center gap-1.5 rounded-lg border border-ink-300 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50";

  return (
    <div className="flex flex-wrap gap-2">
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${enc}`} target="_blank" rel="noopener noreferrer">
        Zdieľať na Facebooku
      </a>
      <a className={btn} href={`https://twitter.com/intent/tweet?url=${enc}&text=${encT}`} target="_blank" rel="noopener noreferrer">
        Zdieľať na X
      </a>
      <a className={btn} href={`mailto:?subject=${encT}&body=${enc}`}>
        Poslať e-mailom
      </a>
      <button type="button" onClick={copy} className={btn}>
        {copied ? "Skopírované ✓" : "Kopírovať odkaz"}
      </button>
    </div>
  );
}
