import "server-only";

/**
 * Vzorový (seed) obsah staticky zabalený do buildu. Na Verceli je súborový
 * systém read-only, preto sa obsah nedá čítať cez fs za behu – tieto importy
 * garantujú, že počiatočný obsah je vždy dostupný. Za behu ho môže prekryť
 * hodnota z KV (viď src/lib/store.ts).
 */

import site from "../../content/site.json";
import caseData from "../../content/case.json";
import timeline from "../../content/timeline.json";
import contract from "../../content/contract.json";
import documents from "../../content/documents.json";
import gallery from "../../content/gallery.json";
import opinions from "../../content/opinions.json";
import cityActions from "../../content/cityActions.json";
import openQuestions from "../../content/openQuestions.json";
import articles from "../../content/articles.json";

/** Mapa názov kolekcie → počiatočné dáta. */
export const SEED: Record<string, unknown> = {
  site,
  case: caseData,
  timeline,
  contract,
  documents,
  gallery,
  opinions,
  cityActions,
  openQuestions,
  articles,
};
