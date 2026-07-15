"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Cookie banner len pre NEPODSTATNÉ (analytické/marketingové) cookies.
 * Web sám o sebe žiadne také cookies nenasadzuje, kým používateľ nesúhlasí.
 * Voľba sa ukladá do localStorage (nie do cookie), aby banner nič nenastavoval
 * pred súhlasom.
 */
const KEY = "aqb_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* localStorage nedostupné – banner nezobrazujeme */
    }
  }, []);

  function decide(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
    // Tu by sa po súhlase inicializovala analytika. Zámerne nič nespúšťame,
    // kým nie je pridaný konkrétny analytický nástroj.
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Súhlas s používaním cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-200 bg-white p-4 shadow-lg sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink-600">
          Web používa iba nevyhnutné technické cookies. Analytické alebo
          marketingové cookies nespustíme bez vášho súhlasu. Viac v{" "}
          <Link href="/cookies" className="font-medium text-brand-700 underline underline-offset-2">
            zásadách používania cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => decide("rejected")}
            className="rounded-lg border border-ink-300 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100"
          >
            Odmietnuť nepodstatné
          </button>
          <button
            onClick={() => decide("accepted")}
            className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
          >
            Prijať všetky
          </button>
        </div>
      </div>
    </div>
  );
}
