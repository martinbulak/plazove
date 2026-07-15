import { AdminShell } from "@/components/admin/AdminShell";
import { SubmissionsManager } from "@/components/admin/SubmissionsManager";
import { readSubmission } from "@/lib/store";
import type { NewsletterSubscriber, PetitionSignature, Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage() {
  const [petition, newsletter, submissions] = await Promise.all([
    readSubmission<PetitionSignature[]>("petition", []),
    readSubmission<NewsletterSubscriber[]>("newsletter", []),
    readSubmission<Submission[]>("submissions", []),
  ]);

  return (
    <AdminShell active="submissions" title="Podania od verejnosti">
      <SubmissionsManager petition={petition} newsletter={newsletter} submissions={submissions} />
    </AdminShell>
  );
}
