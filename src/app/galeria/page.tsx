import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui";
import { Gallery } from "@/components/Gallery";
import { getGallery, getGalleryAlbums, onlyPublished } from "@/lib/content";
import { formatDateSk } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Galéria",
  description:
    "Fotografie stavu areálu plážového kúpaliska v Banskej Bystrici vrátane záberov z kontrolného dňa 30. júna 2026. Nezávislý informačný projekt.",
};

// ISR: obsah sa obnovuje z KV (ak je nastavené) každých 60 s.
export const revalidate = 60;

export default async function GalleryPage() {
  const [all, albums] = await Promise.all([
    getGallery().then(onlyPublished),
    getGalleryAlbums().then(onlyPublished),
  ]);

  const grouped = albums
    .map((a) => ({ album: a, items: all.filter((i) => i.album === a.id) }))
    .filter((g) => g.items.length > 0);
  // Fotografie bez albumu (alebo s neznámym albumom) nesmú vypadnúť z výpisu.
  const loose = all.filter((i) => !grouped.some((g) => g.items.includes(i)));

  return (
    <Section>
      <SectionHeading
        as="h1"
        eyebrow="Galéria"
        title="Stav areálu na fotografiách"
        intro="Fotografie dokumentujúce stav verejného majetku. Po kliknutí sa fotografia otvorí vo väčšom zobrazení. Pri každej uvádzame dátum a autora."
      />

      {grouped.length === 0 && loose.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 bg-white p-10 text-center text-sm text-ink-500">
          Galéria sa práve dopĺňa. Fotografie pribudnú čoskoro.
        </p>
      ) : (
        <div className="space-y-14">
          {grouped.map(({ album, items }) => (
            <section key={album.id} id={album.id} className="scroll-mt-24">
              <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="display text-2xl text-ink-900">{album.title}</h2>
                <span className="text-sm text-ink-500">{countLabel(items.length)}</span>
              </div>

              <p className="max-w-3xl text-sm leading-relaxed text-ink-600">
                {album.description}
              </p>

              {album.note && (
                <div className="mt-3 max-w-3xl rounded-lg border-l-4 border-brand-500 bg-ink-50 px-4 py-3 text-sm leading-relaxed text-ink-700">
                  {album.note}
                </div>
              )}

              <p className="mb-5 mt-3 text-xs text-ink-500">
                {album.credit ? `Autorka fotografií: ${album.credit} · ` : ""}
                {formatDateSk(album.date)}
              </p>

              <Gallery items={items} />
            </section>
          ))}

          {loose.length > 0 && (
            <section>
              <h2 className="display mb-5 text-2xl text-ink-900">Ostatné fotografie</h2>
              <Gallery items={loose} />
            </section>
          )}
        </div>
      )}

      <div className="mt-10 rounded-lg border border-ink-200 bg-ink-50 px-4 py-3 text-sm leading-relaxed text-ink-600">
        <strong>Staršia fotodokumentácia:</strong> zábery stavu areálu z rokov
        2013 – 2024 zhromaždil petičný výbor za záchranu plážového kúpaliska
        a predložil ich aj mestskému zastupiteľstvu. Kompletné materiály
        s pôvodnými popismi sú na stiahnutie ako{" "}
        <a
          href="/dokumenty/fotodokumentacia-2013-2016.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 underline"
        >
          fotodokumentácia 2013 – 2016
        </a>{" "}
        a{" "}
        <a
          href="/dokumenty/fotodokumentacia-2024.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-700 underline"
        >
          fotodokumentácia 2024
        </a>
        .
      </div>

      <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
        Máte vlastnú fotografiu areálu?{" "}
        <Link href="/nahlasit" className="font-semibold underline">
          Pošlite nám ju
        </Link>
        . Pri odosielaní potvrdzujete autorstvo, súhlas so zverejnením a to, že
        fotografia neprimerane nezasahuje do súkromia iných osôb.
      </div>
    </Section>
  );
}

/** Slovenské skloňovanie počtu fotografií. */
function countLabel(n: number): string {
  if (n === 1) return "1 fotografia";
  if (n >= 2 && n <= 4) return `${n} fotografie`;
  return `${n} fotografií`;
}
