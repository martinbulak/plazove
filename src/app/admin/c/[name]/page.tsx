import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { DocumentUploader } from "@/components/admin/DocumentUploader";
import { COLLECTIONS } from "@/lib/admin-schema";
import { readJson } from "@/lib/store";
import type { DocumentItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function CollectionAdminPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const def = COLLECTIONS[name];
  if (!def) notFound();

  const items = await readJson<Array<Record<string, unknown>>>(name, []);

  return (
    <AdminShell active={name} title={def.title}>
      {name === "gallery" && <GalleryUploader />}
      {name === "documents" && (
        <DocumentUploader documents={items as unknown as DocumentItem[]} />
      )}
      <CollectionEditor def={def} initialItems={items} />
    </AdminShell>
  );
}
