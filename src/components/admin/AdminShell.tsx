import Link from "next/link";
import type { ReactNode } from "react";
import { COLLECTION_LIST } from "@/lib/admin-schema";
import { LogoutButton } from "./LogoutButton";

export function AdminShell({
  active,
  title,
  children,
}: {
  active?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="rounded-xl border border-ink-200 bg-white p-4">
          <Link href="/admin" className="block">
            <p className="text-sm font-bold text-ink-900">Administrácia</p>
            <p className="text-xs text-brand-600">Aqualand BB</p>
          </Link>
          <nav className="mt-4 space-y-0.5 text-sm" aria-label="Admin navigácia">
            <NavLink href="/admin" active={active === "dashboard"}>
              Prehľad
            </NavLink>
            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              Obsah
            </p>
            {COLLECTION_LIST.map((c) => (
              <NavLink key={c.name} href={`/admin/c/${c.name}`} active={active === c.name}>
                {c.title}
              </NavLink>
            ))}
            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              Ostatné
            </p>
            <NavLink href="/admin/nastavenia" active={active === "settings"}>
              Nastavenia webu
            </NavLink>
            <NavLink href="/admin/podania" active={active === "submissions"}>
              Podania od verejnosti
            </NavLink>
          </nav>
          <div className="mt-4 border-t border-ink-100 pt-4">
            <LogoutButton />
            <Link href="/" className="mt-2 block px-3 text-xs text-ink-500 hover:text-brand-700">
              ← Zobraziť web
            </Link>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <h1 className="mb-4 text-2xl font-bold text-ink-900">{title}</h1>
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 ${
        active ? "bg-brand-50 font-semibold text-brand-800" : "text-ink-600 hover:bg-ink-50"
      }`}
    >
      {children}
    </Link>
  );
}
