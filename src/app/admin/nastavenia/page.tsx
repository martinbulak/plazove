import { AdminShell } from "@/components/admin/AdminShell";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { getSite } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const site = await getSite();
  return (
    <AdminShell active="settings" title="Nastavenia webu">
      <SiteSettingsForm initial={site} />
    </AdminShell>
  );
}
