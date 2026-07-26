import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ochrana osobných údajov",
  description:
    "Zásady ochrany osobných údajov projektu Za Pláž. Web nepoužíva cookies ani sledovacie nástroje. Aké údaje spracúvame pri výzve, odbere noviniek a podaniach a aké máte práva.",
};

export default function PrivacyPage() {
  return (
    <Section className="max-w-3xl">
      <SectionHeading
        as="h1"
        eyebrow="Právne informácie"
        title="Ochrana osobných údajov"
        intro="Osobné údaje spracúvame len vtedy, keď nám ich sami pošlete – pri podpise výzvy, odbere noviniek alebo podaní. Samotné prezeranie webu žiadne spracúvanie nespúšťa."
      />

      <div className="prose-sk space-y-6 text-ink-700">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
          <strong>Web nepoužíva cookies.</strong> Nemáme analytiku, reklamné ani
          sledovacie nástroje a nenačítavame nič od tretích strán – žiadne
          externé písma, mapy, prehrávače ani tlačidlá sociálnych sietí. Preto
          na webe nenájdete ani cookie lištu: nie je čo odsúhlasovať.
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">1. Prevádzkovateľ</h2>
          <p className="mt-2">
            Prevádzkovateľom osobných údajov je <strong>Martin Bulák</strong>,
            Družby 31, 974 04 Banská Bystrica, ako fyzická osoba prevádzkujúca
            občiansky projekt „Za Pláž" (ďalej „prevádzkovateľ").
          </p>
          <p className="mt-2">
            Kontakt:{" "}
            <a href="mailto:info@zaplaz.sk" className="font-medium text-brand-700 underline">
              info@zaplaz.sk
            </a>{" "}
            alebo{" "}
            <a
              href="mailto:bulak.martin@gmail.com"
              className="font-medium text-brand-700 underline"
            >
              bulak.martin@gmail.com
            </a>
            . Prevádzkovateľ nemá určenú zodpovednú osobu (DPO) – rozsah
            spracúvania to nevyžaduje.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">2. Aké údaje spracúvame</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Verejná výzva:</strong> meno, priezvisko, mesto, e-mail,
              nepovinný verejný odkaz a vami zvolený rozsah zverejnenia (plné meno
              a mesto / iba krstné meno a mesto / nezverejňovať).
            </li>
            <li>
              <strong>Odber noviniek:</strong> e-mailová adresa.
            </li>
            <li>
              <strong>Podania (tip, fotografia, nahlásenie):</strong> nepovinné
              meno a e-mail, obsah správy a prípadné prílohy alebo odkazy.
            </li>
            <li>
              <strong>Technické údaje:</strong> bežné logy webového servera
              u poskytovateľa hostingu (IP adresa, čas a typ požiadavky). Slúžia
              na prevádzku a bezpečnosť webu a nespájame ich s vašou osobou.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">3. Účel a právny základ</h2>
          <p className="mt-2">
            Údaje z formulárov spracúvame na základe vášho súhlasu (čl. 6 ods. 1
            písm. a GDPR) na účel evidencie podpisov výzvy, rozosielania noviniek
            a spracovania podaní. Serverové logy spracúvame na základe oprávneného
            záujmu na bezpečnej prevádzke webu (čl. 6 ods. 1 písm. f GDPR).
          </p>
          <p className="mt-2">
            Verejne zobrazujeme nanajvýš meno a mesto v rozsahu, ktorý si sami
            zvolíte, a nepovinný odkaz, ktorý napíšete. Zverejnenie nastáva až po
            overení e-mailu. <strong>E-mailovú adresu nezverejňujeme nikdy</strong>{" "}
            a neposkytujeme ju tretím stranám na marketingové účely.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">4. Doba uchovávania</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Podpisy výzvy:</strong> do naplnenia účelu výzvy voči mestu,
              najdlhšie však do odvolania súhlasu. Nepotvrdené podpisy (bez
              overenia e-mailu) mažeme priebežne.
            </li>
            <li>
              <strong>Odber noviniek:</strong> do odhlásenia alebo odvolania
              súhlasu.
            </li>
            <li>
              <strong>Podania:</strong> počas doby, kým je zverejnený obsah, ktorý
              sa o ne opiera; potom ich mažeme.
            </li>
            <li>
              <strong>Serverové logy:</strong> podľa nastavenia poskytovateľa
              hostingu, spravidla v rádoch dní až týždňov.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">5. Vaše práva</h2>
          <p className="mt-2">
            Máte právo na prístup k údajom, ich opravu, vymazanie, obmedzenie
            spracúvania, prenosnosť a právo namietať. Súhlas môžete kedykoľvek
            odvolať – podpis aj odkaz na požiadanie odstránime. Žiadosti posielajte
            na{" "}
            <a href="mailto:info@zaplaz.sk" className="font-medium text-brand-700 underline">
              info@zaplaz.sk
            </a>{" "}
            alebo použite formulár na stránke{" "}
            <Link href="/nahlasit" className="font-medium text-brand-700 underline">
              Nahlásiť chybu / obsah
            </Link>
            .
          </p>
          <p className="mt-2">
            Máte tiež právo podať sťažnosť dozornému orgánu, ktorým je Úrad na
            ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07
            Bratislava.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">6. Príjemcovia a spracovatelia</h2>
          <p className="mt-2">
            Údaje nepredávame ani neposkytujeme na marketingové účely. Pri
            prevádzke webu využívame týchto sprostredkovateľov:
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-6">
            <li>
              <strong>Vercel Inc.</strong> – hosting webu a ukladanie odoslaných
              formulárov.
            </li>
            <li>
              <strong>Resend</strong> – odosielanie overovacích e-mailov
              a noviniek.
            </li>
          </ul>
          <p className="mt-2">
            Obaja poskytovatelia môžu údaje spracúvať aj mimo Európskeho
            hospodárskeho priestoru, a to na základe štandardných zmluvných
            doložiek schválených Európskou komisiou.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-ink-900">7. Cookies a sledovanie</h2>
          <p className="mt-2">
            Verejná časť webu <strong>nenastavuje žiadne cookies</strong> a
            neukladá nič do prehliadača. Nepoužívame analytiku ani žiadne
            sledovacie skripty.
          </p>
          <p className="mt-2">
            Jedinou výnimkou je prihlásenie do administrácie na adrese{" "}
            <code>/admin</code>, kde sa po zadaní hesla nastaví jedna technická
            cookie na udržanie prihlásenia. Týka sa výhradne prevádzkovateľa
            webu, nie návštevníkov, a súhlas nevyžaduje, keďže ide o nevyhnutnú
            technickú cookie.
          </p>
        </div>

        <p className="border-t border-ink-200 pt-4 text-sm text-ink-500">
          Znenie je účinné od 26. júla 2026.
        </p>
      </div>
    </Section>
  );
}
