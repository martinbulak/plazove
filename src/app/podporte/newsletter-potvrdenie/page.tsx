import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui";
import { readSubmission, writeSubmission } from "@/lib/store";
import type { NewsletterSubscriber } from "@/lib/types";

export const metadata: Metadata = {
  title: "Potvrdenie odberu",
  robots: { index: false, follow: false },
};

async function confirm(token: string): Promise<"ok" | "already" | "invalid"> {
  if (!token) return "invalid";
  const list = await readSubmission<NewsletterSubscriber[]>("newsletter", []);
  const item = list.find((s) => s.confirmToken === token);
  if (!item) return "invalid";
  if (item.confirmed) return "already";
  item.confirmed = true;
  item.confirmedAt = new Date().toISOString();
  item.confirmToken = undefined;
  await writeSubmission("newsletter", list);
  return "ok";
}

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = await confirm(token ?? "");
  const ok = result !== "invalid";

  return (
    <Section className="max-w-2xl text-center">
      <div className="rounded-[var(--radius-card)] border border-ink-200 bg-white p-8 shadow-sm">
        <div
          className={`mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full ${
            ok ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
          aria-hidden
        >
          {ok ? "✓" : "!"}
        </div>
        <h1 className="text-2xl font-bold text-ink-900">
          {result === "ok" && "Odber potvrdený. Ďakujeme!"}
          {result === "already" && "Odber už bol potvrdený"}
          {result === "invalid" && "Neplatný odkaz"}
        </h1>
        <p className="mt-3 text-ink-600">
          {ok
            ? "Budeme vás informovať o novinkách v prípade."
            : "Potvrdzovací odkaz nie je platný. Skúste sa prihlásiť znova."}
        </p>
        <div className="mt-6">
          <Link href="/podporte" className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
            Späť
          </Link>
        </div>
      </div>
    </Section>
  );
}
