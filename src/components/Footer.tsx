import Link from "next/link";
import { LEGAL_NAV, MAIN_NAV } from "@/lib/nav";
import { getSite } from "@/lib/content";

export async function Footer() {
  const site = await getSite();
  return (
    <footer className="mt-12 border-t border-ink-200 bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-base font-bold text-ink-900">{site.siteName}</p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-600">
              {site.disclaimer}
            </p>
            <p className="mt-3 text-sm text-ink-600">
              Kontakt:{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="font-medium text-brand-700 underline underline-offset-2"
              >
                {site.contactEmail}
              </a>
            </p>
          </div>

          <nav aria-label="Sekcie">
            <p className="mb-3 text-sm font-semibold text-ink-900">Sekcie</p>
            <ul className="space-y-1.5 text-sm">
              {MAIN_NAV.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-ink-600 hover:text-brand-700">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Právne informácie">
            <p className="mb-3 text-sm font-semibold text-ink-900">Právne informácie</p>
            <ul className="space-y-1.5 text-sm">
              {LEGAL_NAV.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="text-ink-600 hover:text-brand-700">
                    {i.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/admin" className="text-ink-400 hover:text-brand-700">
                  Administrácia
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-ink-200 pt-6 text-xs leading-relaxed text-ink-500">
          <p>
            © {new Date().getFullYear()} {site.operator}. Nezávislý občiansky
            informačný projekt. Web nie je oficiálnym webom prevádzkovateľa
            plážového kúpaliska ani Mesta Banská Bystrica.
          </p>
          <p className="mt-2">
            Obsah predstavuje informačné spracovanie verejne dostupných dokumentov
            a nenahrádza individuálne právne poradenstvo. Fakty sú odlíšené od
            citácií, právnych výkladov a názorov.
          </p>
        </div>
      </div>
    </footer>
  );
}
