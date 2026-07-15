import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui";
import { readSubmission, writeSubmission } from "@/lib/store";
import type { PetitionSignature } from "@/lib/types";

export const metadata: Metadata = {
  title: "Potvrdenie podpisu",
  robots: { index: false, follow: false },
};

async function confirm(token: string): Promise<"ok" | "already" | "invalid"> {
  if (!token) return "invalid";
  const list = await readSubmission<PetitionSignature[]>("petition", []);
  const item = list.find((s) => s.confirmToken === token);
  if (!item) return "invalid";
  if (item.confirmed) return "already";
  item.confirmed = true;
  item.confirmedAt = new Date().toISOString();
  item.confirmToken = undefined;
  await writeSubmission("petition", list);
  return "ok";
}

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = await confirm(token ?? "");

  const messages = {
    ok: {
      title: "Podpis potvrdený. Ďakujeme!",
      body: "Váš podpis verejnej výzvy sme zaznamenali. Vážime si vašu podporu.",
    },
    already: {
      title: "Podpis už bol potvrdený",
      body: "Tento odkaz už bol použitý – váš podpis je platný a započítaný.",
    },
    invalid: {
      title: "Neplatný alebo expirovaný odkaz",
      body: "Potvrdzovací odkaz nie je platný. Skúste podpísať výzvu znova.",
    },
  } as const;

  const m = messages[result];

  return (
    <Section className="max-w-2xl text-center">
      <div className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-8 shadow-sm">
        <div
          className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full ${
            result === "invalid" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
          }`}
          aria-hidden
        >
          {result === "invalid" ? "!" : "✓"}
        </div>
        <h1 className="text-2xl font-bold text-ink-900">{m.title}</h1>
        <p className="mt-3 text-ink-600">{m.body}</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/podporte" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
            Späť na výzvu
          </Link>
          <Link href="/" className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50">
            Domov
          </Link>
        </div>
      </div>
    </Section>
  );
}
