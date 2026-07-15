import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aqualandbb.sk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Aqualand BB – verejná kontrola | Nezávislý informačný projekt o plážovom kúpalisku v Banskej Bystrici",
    template: "%s | Aqualand BB – verejná kontrola",
  },
  description:
    "Nezávislý občiansky informačný projekt. Dokumenty, právne analýzy, časová os a fakty o plážovom kúpalisku v Banskej Bystrici, nájomnej zmluve mesta a stave areálu. Nie je to oficiálny web prevádzkovateľa ani mesta.",
  keywords: [
    "plážové kúpalisko Banská Bystrica",
    "Aqualand Banská Bystrica",
    "zmluva plážové kúpalisko",
    "kúpalisko Banská Bystrica",
    "Aqualand BB",
    "nájomná zmluva mesta Banská Bystrica",
  ],
  authors: [{ name: "Aqualand BB – verejná kontrola" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: SITE_URL,
    siteName: "Aqualand BB – verejná kontrola",
    title:
      "Aqualand BB – verejná kontrola | Nezávislý informačný projekt",
    description:
      "Dokumenty, právne analýzy, časová os a fakty o plážovom kúpalisku v Banskej Bystrici. Nezávislý občiansky informačný projekt – nie je to web prevádzkovateľa ani mesta.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aqualand BB – verejná kontrola",
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
    <html lang="sk" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans text-ink-800 antialiased">
        <a href="#obsah" className="skip-link">
          Preskočiť na obsah
        </a>
        <Header />
        <main id="obsah">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
