"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { CTA_NAV, MAIN_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <WaveMark />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-ink-900 sm:text-base">
              Aqualand BB
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-brand-600">
              verejná kontrola
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Hlavná navigácia">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-sm font-medium text-ink-600 hover:bg-brand-50 hover:text-brand-800",
                pathname === item.href && "bg-brand-50 text-brand-800",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={CTA_NAV.href}
            className="hidden rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-accent-600 hover:text-white sm:inline-flex"
          >
            {CTA_NAV.label}
          </Link>
          <button
            type="button"
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-ink-700 hover:bg-ink-100 lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink-200 bg-white lg:hidden" aria-label="Mobilná navigácia">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-brand-50",
                    pathname === item.href && "bg-brand-50 text-brand-800",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-ink-100 pt-2">
              <Link
                href={CTA_NAV.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-accent-500 px-3 py-2.5 text-center text-sm font-semibold text-ink-900"
              >
                {CTA_NAV.label}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/** Jednoduchá „vlnová" značka – vlastná, nesúvisí s identitou prevádzkovateľa. */
function WaveMark() {
  return (
    <span
      aria-hidden
      className="grid h-9 w-9 place-items-center rounded-lg bg-brand-700 text-white"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M2 9c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2M2 15c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
