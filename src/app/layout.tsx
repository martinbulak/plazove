import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

/** Redakčný serif pre nadpisy – dáva webu novinársky, nie šablónový charakter. */
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zaplaz.sk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Za Pláž – ktorá nebude hanbou | Plážové kúpalisko v Banskej Bystrici",
    template: "%s | Za Pláž",
  },
  description:
    "Nezávislý občiansky informačný projekt. Dokumenty, právne analýzy, časová os a fakty o plážovom kúpalisku v Banskej Bystrici, nájomnej zmluve mesta a stave areálu. Nie je to oficiálny web prevádzkovateľa ani mesta.",
  keywords: [
    "plážové kúpalisko Banská Bystrica",
    "Aqualand Banská Bystrica",
    "zmluva plážové kúpalisko",
    "kúpalisko Banská Bystrica",
    "Za Pláž",
    "zaplaz.sk",
    "nájomná zmluva mesta Banská Bystrica",
  ],
  authors: [{ name: "Za Pláž" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: SITE_URL,
    siteName: "Za Pláž",
    title: "Za Pláž – ktorá nebude hanbou",
    description:
      "Dokumenty, právne analýzy, časová os a fakty o plážovom kúpalisku v Banskej Bystrici. Nezávislý občiansky informačný projekt – nie je to web prevádzkovateľa ani mesta.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Za Pláž",
    description:
      "Nezávislý občiansky informačný projekt o plážovom kúpalisku v Banskej Bystrici.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#245e73",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink-800 antialiased">
        <a href="#obsah" className="skip-link">
          Preskočiť na obsah
        </a>
        <Header />
        <main id="obsah">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
