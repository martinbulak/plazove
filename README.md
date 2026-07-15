# Aqualand BB – verejná kontrola

Nezávislý občiansky informačný web o situácii okolo **plážového kúpaliska v Banskej Bystrici**, nájomnej zmluve mesta s prevádzkovateľom, aktuálnom stave areálu a krokoch mesta.

> **Dôležité:** Toto **nie je** oficiálny web prevádzkovateľa kúpaliska ani Mesta Banská Bystrica. Ide o nezávislý občiansky a informačný projekt. Všetok dodaný obsah je **vzorový (placeholder)** a je tak aj označený – pred spustením ho treba nahradiť overenými faktami, dokumentmi a zdrojmi.

- **Doména (cieľová):** aqualandbb.sk
- **Technológie:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · súborová JSON obsahová vrstva

---

## Obsah
1. [Rýchly štart](#rýchly-štart)
2. [Informačná architektúra](#informačná-architektúra)
3. [Dátový model](#dátový-model)
4. [Obsahová vrstva a administrácia](#obsahová-vrstva-a-administrácia)
5. [E-maily (výzva a newsletter)](#e-maily-výzva-a-newsletter)
6. [Štruktúra projektu](#štruktúra-projektu)
7. [Dizajnový systém](#dizajnový-systém)
8. [SEO](#seo)
9. [Nasadenie](#nasadenie)
10. [Právna a redakčná bezpečnosť](#právna-a-redakčná-bezpečnosť)

---

## Rýchly štart

Požiadavky: **Node.js 20+** (testované na Node 24), npm.

```bash
# 1. inštalácia závislostí
npm install

# 2. konfigurácia prostredia
cp .env.example .env.local
#   Súbor .env.local už existuje s dev hodnotami (heslo do adminu: admin123).
#   Pred reálnym použitím zmeňte ADMIN_PASSWORD a ADMIN_SESSION_SECRET!

# 3. vývojový server
npm run dev
#   → http://localhost:3000

# 4. produkčný build a spustenie
npm run build
npm run start

# 5. kontrola konzistentnosti obsahu (voliteľné)
npm run seed
```

Administrácia je na **`/admin`** (predvolené dev heslo: `admin123`).

---

## Informačná architektúra

```
/                          Úvod (hero, fakty, rozcestník, náhľady sekcií, CTA)
├── /pripad                Prípad v skratke (fakty / závery dokumentov / otvorené otázky / názory)
├── /casova-os             Časová os – vertikálna chronológia so zdrojmi
├── /zmluva                Zmluva a jej rozbor (Q&A, druh tvrdenia, odkaz na článok/PDF)
├── /dokumenty             Archív dokumentov (vyhľadávanie + filter podľa kategórie)
├── /galeria               Fotogaléria s lightboxom (dátum, autor, vlastná/prevzatá)
├── /nazory                Názory verejnosti (schválené, s odkazom na originál)
├── /co-urobilo-mesto      Kroky a prísľuby mesta + stav (splnené/prebieha/…)
├── /otvorene-otazky       Otvorené otázky + stav + odpoveď mesta
├── /podporte              Verejná výzva, newsletter, poslať foto/tip, zdieľať
│   ├── /podporte/potvrdenie             potvrdenie podpisu výzvy (double opt-in)
│   └── /podporte/newsletter-potvrdenie  potvrdenie odberu
├── /o-projekte            Kto/prečo, overovanie zdrojov, redakčná metodika, kontakt
├── /nahlasit              Nahlásenie chyby / žiadosť o opravu alebo odstránenie
├── /ochrana-osobnych-udajov, /cookies, /podmienky   Právne stránky
└── /admin                 Zabezpečená administrácia (mimo indexovania)
    ├── /admin/login
    ├── /admin/c/[name]    Generický editor pre každú kolekciu
    ├── /admin/nastavenia  Nastavenia webu (hero, disclaimer, text výzvy…)
    └── /admin/podania     Podpisy výzvy, newsletter, tipy/foto/opravy
```

`sitemap.xml` a `robots.txt` sa generujú automaticky (admin a API sú vylúčené z indexovania).

---

## Dátový model

Jediný zdroj pravdy je [`src/lib/types.ts`](src/lib/types.ts). Kľúčové prvky:

- **`BaseEntity`** – spoločné pre všetky obsahové položky: `status` (koncept/publikované), `publishedAt`, `updatedAt`, `author`, `seoTitle`, `seoDescription`, `sources`, `isPlaceholder`.
- **`ClaimKind`** – druh tvrdenia: *fakt · záver dokumentu · citácia · právny výklad · názor · otvorená otázka*. Používa sa všade, kde treba odlíšiť overený fakt od názoru.
- **`SourceRef`** – odkaz na zdroj (popis, URL, `documentId`, strana PDF). Pripája sa k tvrdeniam.

Kolekcie (každá = jeden JSON súbor v `/content`):

| Kolekcia | Súbor | Typ | Sekcia |
|---|---|---|---|
| Nastavenia webu | `site.json` | `SiteConfig` | Úvod / global |
| Prípad v skratke | `case.json` | `CaseSection[]` | /pripad |
| Časová os | `timeline.json` | `TimelineItem[]` | /casova-os |
| Zmluva Q&A | `contract.json` | `ContractQA[]` | /zmluva |
| Dokumenty | `documents.json` | `DocumentItem[]` | /dokumenty |
| Galéria | `gallery.json` | `GalleryItem[]` | /galeria |
| Názory | `opinions.json` | `OpinionItem[]` | /nazory |
| Kroky mesta | `cityActions.json` | `CityAction[]` | /co-urobilo-mesto |
| Otvorené otázky | `openQuestions.json` | `OpenQuestion[]` | /otvorene-otazky |
| Články | `articles.json` | `Article[]` | (voliteľné) |

Podania od verejnosti (osobné údaje) sa ukladajú oddelene do `content/_submissions/` (`petition.json`, `newsletter.json`, `submissions.json`) a **nie sú verzované v gite**.

---

## Obsahová vrstva a administrácia

Obsah je uložený ako **JSON súbory v `/content`**. Čítanie/zápis rieši [`src/lib/store.ts`](src/lib/store.ts), typované čítanie [`src/lib/content.ts`](src/lib/content.ts).

**Administrácia** (`/admin`):
- Prihlásenie jedným heslom (`ADMIN_PASSWORD`), session je HMAC-podpísaná cookie. Prístup chráni [`src/middleware.ts`](src/middleware.ts).
- **Generický editor** – formuláre sa generujú z definícií v [`src/lib/admin-schema.ts`](src/lib/admin-schema.ts). Každá položka podporuje koncept/publikované, dátum publikovania, poslednú aktualizáciu, zdroje, autora a SEO názov/popis.
- Podpora typov polí: text, viacriadkový text, číslo, výber, checkbox, dátum, zoznam reťazcov, zoznam zdrojov aj jednotlivý odkaz na dokument.
- **Podania** – prehľad podpisov výzvy, odberateľov newslettera a prijatých tipov/fotografií, vrátane označenia „vybavené" a mazania.

> Ako pridať nový typ obsahu: doplňte typ do `types.ts`, kolekciu do `admin-schema.ts` (`COLLECTIONS`) a čítač do `content.ts`. Editor, API aj sitemap sa prispôsobia automaticky.

---

## E-maily (výzva a newsletter)

Podpis výzvy aj odber newslettera používajú **double opt-in** (potvrdenie e-mailom).

- **Predvolene (bez konfigurácie):** e-mail sa **neodošle**, iba sa **vypíše potvrdzovací odkaz do konzoly servera** – ideálne na lokálne testovanie. Odkaz nájdete vo výstupe `npm run dev`.
- **Reálne odosielanie (Resend):** doplňte do `.env.local`:
  ```env
  RESEND_API_KEY=re_...
  MAIL_FROM=vyzva@aqualandbb.sk   # odosielateľ musí byť na overenej doméne
  ```
  Implementácia je v [`src/lib/mail.ts`](src/lib/mail.ts) (volá Resend HTTP API cez `fetch`, bez SDK). Pre iného poskytovateľa (SMTP, Mailgun…) upravte túto jednu funkciu.

Ochrana proti spamu: skryté honeypot pole vo všetkých formulároch + serverová validácia. Formálnu **elektronickú petíciu** podľa zákona zámerne zatiaľ neimplementujeme – najprv treba doplniť presné právne a identifikačné náležitosti. Aktuálne ide o **verejnú výzvu**.

---

## Štruktúra projektu

```
content/                 JSON obsah (verzovaný) + _submissions/ (osobné údaje, neverzované)
public/placeholders/     Vzorové SVG obrázky do galérie
scripts/verify-content.mjs   Kontrola JSON obsahu (npm run seed)
src/
├── app/                 App Router – stránky, API routes, sitemap, robots, OG image
│   ├── api/             Verejné (vyzva, newsletter, submission) a admin API
│   └── admin/           Administrácia
├── components/          UI (Header, Footer, Hero, Gallery, forms…) + admin/
├── lib/                 types, store, content, auth, mail, validate, utils, nav, admin-schema
└── middleware.ts        Ochrana /admin a /api/admin
```

---

## Dizajnový systém

- Definovaný v [`src/app/globals.css`](src/app/globals.css) cez Tailwind v4 `@theme`.
- **Farebnosť:** `brand` (voda – tlmená petrolejová), `accent` (leto – jantárová, pre CTA), `ink` (mesto – bridlicová sivá) + stavové farby.
- **Prístupnosť (WCAG):** sémantické HTML, viditeľný focus, skip-link, `aria-*`, rešpekt `prefers-reduced-motion`, alt texty povinné pri obrázkoch, dostatočný kontrast.
- **Mobile-first**, responzívne, rýchle (server components, minimum JS).
- Vizuálna identita je **vlastná** – zámerne nepoužíva logo ani grafiku prevádzkovateľa, aby nevznikla zámena s jeho oficiálnym webom.

---

## SEO

- Metadáta a Open Graph v [`src/app/layout.tsx`](src/app/layout.tsx), OG obrázok generovaný v [`src/app/opengraph-image.tsx`](src/app/opengraph-image.tsx).
- Cielené výrazy: *plážové kúpalisko Banská Bystrica, Aqualand Banská Bystrica, zmluva plážové kúpalisko, kúpalisko Banská Bystrica, Aqualand BB, nájomná zmluva mesta Banská Bystrica*.
- V titulkoch aj popisoch je vždy jasne uvedené, že ide o **nezávislý informačný projekt**.
- `lang="sk"`, `sitemap.xml`, `robots.txt`.

Nastavte `NEXT_PUBLIC_SITE_URL` na produkčnú doménu (kvôli kanonickým URL, OG a sitemap).

---

## Nasadenie

Aplikácia je celá v **Next.js** a je pripravená na **Vercel** aj na vlastný Node.js server.

### Úložisko a Vercel
Na serverless hostingu (Vercel) je súborový systém **read-only**, preto sa runtime zápisy (podpisy výzvy, newsletter, tipy, úpravy obsahu v admine) ukladajú do **KV (Upstash Redis)**. Obsahová vrstva [`src/lib/store.ts`](src/lib/store.ts) funguje v troch režimoch:

- **KV** – ak sú nastavené `KV_REST_API_URL` + `KV_REST_API_TOKEN` (alebo `UPSTASH_REDIS_REST_*`). Počiatočný obsah tvorí zabalený seed z `/content`, zápisy idú do KV a prekryjú seed.
- **Súborový systém** – lokálny vývoj (zápis do `/content`).
- **Read-only fallback** – Vercel bez KV: web sa zobrazuje (zo seedu), ale zápisy vrátia zrozumiteľnú chybu 503.

Verejné stránky používajú **ISR** (`revalidate = 60`), takže úpravy z KV sa prejavia do ~minúty.

### Nasadenie na Vercel (krok za krokom)
1. **Import repozitára** na [vercel.com/new](https://vercel.com/new) (Vercel deteguje Next.js automaticky, žiadny build config netreba).
2. **Vytvorte KV úložisko:** v projekte → *Storage* → *Create Database* → **Upstash Redis** (free tier). Vercel doň automaticky doplní `KV_REST_API_URL` a `KV_REST_API_TOKEN`.
3. **Nastavte Environment Variables** (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` = `https://aqualandbb.sk` (alebo pridelená vercel.app doména)
   - `ADMIN_PASSWORD` = silné heslo do administrácie
   - `ADMIN_SESSION_SECRET` = náhodný reťazec (min. 32 znakov)
   - *(voliteľné)* `RESEND_API_KEY` + `MAIL_FROM` pre reálne e-maily
4. **Deploy.** Doménu `aqualandbb.sk` pridáte v *Settings → Domains*.

> Migrácia na inú DB (Postgres/Neon/Turso) je jednoduchá: stačí prepísať telo funkcií v `src/lib/store.ts` a `src/lib/kv.ts`; rozhranie (`readJson`/`writeJson`, `readSubmission`/`appendSubmission`) ostáva rovnaké.

### Vlastný Node.js server
Súborová obsahová vrstva funguje s **trvalým zapisovateľným diskom** (KV netreba):
```bash
npm run build
npm run start   # port 3000 (nastaviteľné cez PORT)
```
Za reverznou proxy (Nginx/Caddy) nasmerujte doménu na aplikáciu a nastavte `.env`:
`NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, prípadne `RESEND_API_KEY` a `MAIL_FROM`.

---

## Právna a redakčná bezpečnosť

Web je navrhnutý s dôrazom na dôveryhodnosť:

- **Odlišuje** fakty, citácie, právne výklady a názory (typ `ClaimKind`, farebné odznaky).
- **Nepoužíva** označenie „oficiálny" a na viditeľných miestach (hero, pätička, SEO) uvádza, že ide o nezávislý projekt.
- **Nepreberá** logo ani dizajn prevádzkovateľa.
- Pri citáciách uvádza zdroj a používa len primerane krátke úryvky.
- Obsahuje stránky **ochrany osobných údajov, cookies a podmienok používania** (vzorové znenia – dajte právne skontrolovať).
- **Cookie banner** sa zobrazuje len pre nepodstatné (analytické/marketingové) cookies; web sám žiadne také nenasadzuje.
- Má mechanizmus na **nahlásenie chyby, porušenia práv či žiadosť o odstránenie** obsahu (`/nahlasit`).
- Sekcia názorov nezhromažďuje anonymné recenzie tvorené na webe – len **verejne publikované** príspevky, **manuálne schválené** administrátorom, s odkazom na originál a možnosťou požiadať o odstránenie.

> ⚠️ **Pred spustením:** nahraďte všetok placeholder obsah overenými údajmi a zdrojmi, doplňte skutočné identifikačné údaje prevádzkovateľa projektu do právnych stránok a nechajte právne texty skontrolovať. Nepublikujte nepodložené obvinenia z trestnej činnosti, korupcie ani úmyselného konania.

---

## Licencia / autor

Občiansky informačný projekt „Aqualand BB – verejná kontrola". Kód je určený na prevádzku tohto projektu; obsah je vzorový a určený na nahradenie.
