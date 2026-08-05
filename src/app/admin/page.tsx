import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { COLLECTION_LIST } from "@/lib/admin-schema";
import { readJson } from "@/lib/store";

export const dynamic = "force-dynamic";

async function count(name: string) {
  const items = await readJson<unknown[]>(name, []);
  return items.length;
}

export default async function AdminDashboard() {
  const counts = await Promise.all(
    COLLECTION_LIST.map(async (c) => ({ ...c, n: await count(c.name) })),
  );
  return (
    <AdminShell active="dashboard" title="Prehľad">
      <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Obsah je uložený v JSON súboroch v priečinku <code>/content</code>. Zmeny
        sa zapisujú do súborov – vhodné pre lokálny vývoj a Node.js server s trvalým
        diskom. Na serverless hostingu (Vercel) je zápis len dočasný, viď README.
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">
        Obsah
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {counts.map((c) => (
          <Link
            key={c.name}
            href={`/admin/c/${c.name}`}
            className="rounded-xl border border-ink-200 bg-white p-4 hover:border-brand-300 hover:bg-brand-50"
          >
            <p className="text-sm font-medium text-ink-600">{c.title}</p>
            <p className="mt-1 text-2xl font-bold text-ink-900">{c.n}</p>
            <p className="text-xs text-brand-700">Spravovať →</p>
          </Link>
        ))}
      </div>

    </AdminShell>
  );
}

