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
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
          {eyebrow}
        </p>
      )}
      <As className="text-balance text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
        {title}
      </As>
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink-600">{intro}</p>}
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
  primary: "bg-brand-700 text-white hover:bg-brand-800",
  accent: "bg-accent-500 text-ink-900 hover:bg-accent-600 hover:text-white",
  outline: "border border-brand-300 text-brand-800 hover:bg-brand-50",
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
    "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none";
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

const CLAIM_STYLES: Record<ClaimKind, string> = {
  fact: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  document_conclusion: "bg-sky-50 text-sky-800 ring-sky-200",
  citation: "bg-violet-50 text-violet-800 ring-violet-200",
  legal_interpretation: "bg-amber-50 text-amber-900 ring-amber-200",
  opinion: "bg-ink-100 text-ink-700 ring-ink-300",
  open_question: "bg-rose-50 text-rose-800 ring-rose-200",
};

export function ClaimBadge({ kind }: { kind: ClaimKind }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        CLAIM_STYLES[kind],
      )}
      title="Druh tvrdenia"
    >
      {CLAIM_KIND_LABEL[kind]}
    </span>
  );
}

/* ── Odznak stavu (splnené / prebieha / …) ───────────────────────────── */

const STATUS_STYLES: Record<ActionStatus, string> = {
  done: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  in_progress: "bg-amber-50 text-amber-900 ring-amber-200",
  not_done: "bg-rose-50 text-rose-800 ring-rose-200",
  no_answer: "bg-ink-100 text-ink-600 ring-ink-300",
};

export function StatusBadge({ status }: { status: ActionStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
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
  if (!sources || sources.length === 0) {
    return (
      <p className="mt-2 text-xs italic text-ink-400">
        Zdroj zatiaľ nedoplnený (vzorové dáta).
      </p>
    );
  }
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
