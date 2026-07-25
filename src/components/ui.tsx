import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ACTION_STATUS_LABEL,
  CLAIM_KIND_LABEL,
  type ActionStatus,
  type ClaimKind,
  type SourceRef,
} from "@/lib/types";

/* ── Sekcia + nadpis ─────────────────────────────────────────────────── */

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn("mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
}) {
  return (
    <header className="mb-8 max-w-3xl">
      {eyebrow && (
        <p className="eyebrow mb-3 flex items-center gap-2.5 text-brand-600">
          <span aria-hidden className="h-px w-6 bg-brand-400" />
          {eyebrow}
        </p>
      )}
      <As className="display text-balance text-[2rem] text-ink-900 sm:text-[2.6rem]">
        {title}
      </As>
      {intro && (
        <p className="mt-4 text-lg leading-relaxed text-ink-600">{intro}</p>
      )}
    </header>
  );
}

/* ── Karta ───────────────────────────────────────────────────────────── */

export function Card({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={cn(
        "rounded-[var(--radius-card)] border border-ink-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── Tlačidlá / CTA ──────────────────────────────────────────────────── */

type BtnVariant = "primary" | "accent" | "outline" | "ghost";
const BTN_VARIANTS: Record<BtnVariant, string> = {
  primary:
    "bg-brand-800 text-white shadow-sm hover:bg-brand-900 active:translate-y-px",
  accent:
    "bg-accent-500 text-ink-900 shadow-sm hover:bg-accent-400 active:translate-y-px",
  outline:
    "border border-ink-300 bg-white/70 text-ink-800 hover:border-brand-400 hover:bg-white",
  ghost: "text-brand-700 hover:bg-brand-50",
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  type,
  ...rest
}: {
  href?: string;
  variant?: BtnVariant;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all focus-visible:outline-none";
  if (href) {
    const external = href.startsWith("http");
    return (
      <Link
        href={href}
        className={cn(base, BTN_VARIANTS[variant], className)}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} className={cn(base, BTN_VARIANTS[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/* ── Odznak druhu tvrdenia (fakt / citácia / názor …) ────────────────── */

/** Farba bodky pri odznaku – nesie význam, text zostáva tlmený a čitateľný. */
const CLAIM_DOT: Record<ClaimKind, string> = {
  fact: "bg-emerald-500",
  document_conclusion: "bg-sky-500",
  citation: "bg-violet-500",
  legal_interpretation: "bg-amber-500",
  opinion: "bg-ink-400",
  open_question: "bg-rose-500",
};

export function ClaimBadge({ kind }: { kind: ClaimKind }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-500"
      title="Druh tvrdenia"
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", CLAIM_DOT[kind])} />
      {CLAIM_KIND_LABEL[kind]}
    </span>
  );
}

/* ── Odznak stavu (splnené / prebieha / …) ───────────────────────────── */

const STATUS_STYLES: Record<ActionStatus, string> = {
  done: "bg-emerald-50 text-emerald-900 ring-emerald-300/70",
  in_progress: "bg-amber-50 text-amber-900 ring-amber-300/70",
  not_done: "bg-rose-50 text-rose-900 ring-rose-300/70",
  no_answer: "bg-ink-100 text-ink-600 ring-ink-300",
};

export function StatusBadge({ status }: { status: ActionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset",
        STATUS_STYLES[status],
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "done" && "bg-emerald-500",
          status === "in_progress" && "bg-amber-500",
          status === "not_done" && "bg-rose-500",
          status === "no_answer" && "bg-ink-400",
        )}
      />
      {ACTION_STATUS_LABEL[status]}
    </span>
  );
}

/* ── Zdroje ──────────────────────────────────────────────────────────── */

export function SourceList({ sources }: { sources?: SourceRef[] }) {
  // Bez zdrojov nezobrazujeme nič – napr. názory autora zdroj nevyžadujú
  // a upozornenie „zdroj nedoplnený“ by čitateľa zbytočne mýlilo.
  if (!sources || sources.length === 0) return null;
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
      {sources.map((s, i) => {
        const href =
          s.url ?? (s.documentId ? `/dokumenty#${s.documentId}` : undefined);
        return (
          <li key={i} className="inline-flex items-center gap-1">
            <span aria-hidden>↳</span>
            {href ? (
              <a
                href={href}
                className="underline decoration-dotted underline-offset-2 hover:text-brand-700"
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {s.label}
                {s.page ? `, s. ${s.page}` : ""}
              </a>
            ) : (
              <span>
                {s.label}
                {s.page ? `, s. ${s.page}` : ""}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ── Vysvetlenie odznakov pre bežného čitateľa ───────────────────────── */

const CLAIM_EXPLANATION: Record<ClaimKind, string> = {
  fact: "vyplýva priamo z dokumentu alebo oficiálneho zdroja",
  citation: "doslovné znenie zo zmluvy alebo dokumentu",
  document_conclusion: "čo tvrdí konkrétny dokument (audit, správa, stanovisko)",
  legal_interpretation: "ako právnici vykladajú zmluvu či zákon – nie je to rozhodnutie súdu",
  opinion: "naše hodnotenie, jasne oddelené od faktov",
  open_question: "odpoveď nie je verejne známa",
};

/** Rozbaľovacie vysvetlenie farebných odznakov (fakt / citácia / názor…). */
export function ClaimLegend() {
  return (
    <details className="group mb-6 rounded-lg border border-ink-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-ink-700 [&::-webkit-details-marker]:hidden">
        <span>
          <span aria-hidden>🏷️ </span>Čo znamenajú farebné označenia?
        </span>
        <span aria-hidden className="text-ink-400 transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <ul className="space-y-2 border-t border-ink-100 px-4 py-3">
        {(Object.keys(CLAIM_EXPLANATION) as ClaimKind[]).map((kind) => (
          <li key={kind} className="flex flex-wrap items-baseline gap-2 text-sm text-ink-600">
            <ClaimBadge kind={kind} />
            <span>– {CLAIM_EXPLANATION[kind]}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

/* ── Rýchla navigácia v rámci dlhej stránky ──────────────────────────── */

export function QuickNav({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Obsah stránky" className="mb-10 border-y border-ink-200 py-3">
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <li className="eyebrow text-ink-400">Na stránke</li>
        {items.map((i) => (
          <li key={i.href}>
            <a
              href={i.href}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-brand-700"
            >
              {i.label}
              <span
                aria-hidden
                className="text-ink-400 transition-transform group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ── Označenie vzorových dát ─────────────────────────────────────────── */

export function PlaceholderBadge() {
  return (
    <span className="inline-flex items-center rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200">
      Vzorové dáta
    </span>
  );
}

export function PlaceholderNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <strong>Upozornenie:</strong>{" "}
      {children ??
        "Nižšie uvedené položky sú vzorové (placeholder) dáta určené na ukážku štruktúry. Nejde o overené fakty ani reálne dokumenty."}
    </div>
  );
}
