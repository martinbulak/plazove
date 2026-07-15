import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { COLLECTION_LIST } from "@/lib/admin-schema";
import { readJson, readSubmission } from "@/lib/store";

export const dynamic = "force-dynamic";

async function count(name: string) {
  const items = await readJson<unknown[]>(name, []);
  return items.length;
}

export default async function AdminDashboard() {
  const counts = await Promise.all(
    COLLECTION_LIST.map(async (c) => ({ ...c, n: await count(c.name) })),
  );
  const petition = await readSubmission<Array<{ confirmed?: boolean }>>("petition", []);
  const newsletter = await readSubmission<Array<{ confirmed?: boolean }>>("newsletter", []);
  const submissions = await readSubmission<Array<{ handled?: boolean }>>("submissions", []);

  const petitionConfirmed = petition.filter((p) => p.confirmed).length;
  const newsletterConfirmed = newsletter.filter((n) => n.confirmed).length;
  const submissionsNew = submissions.filter((s) => !s.handled).length;

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

      <h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wide text-ink-500">
        Podania od verejnosti
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Podpisy výzvy (potvrdené)" value={`${petitionConfirmed} / ${petition.length}`} href="/admin/podania" />
        <Stat label="Odber noviniek (potvrdené)" value={`${newsletterConfirmed} / ${newsletter.length}`} href="/admin/podania" />
        <Stat label="Nové tipy / foto / opravy" value={String(submissionsNew)} href="/admin/podania" highlight={submissionsNew > 0} />
      </div>
    </AdminShell>
  );
}

function Stat({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border p-4 ${
        highlight ? "border-accent-500 bg-accent-400/10" : "border-ink-200 bg-white"
      } hover:border-brand-300`}
    >
      <p className="text-sm font-medium text-ink-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink-900">{value}</p>
    </Link>
  );
}
