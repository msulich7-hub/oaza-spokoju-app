/**
 * TWarde ograniczenia projektu — działka, strony świata, topografia, sąsiedztwo
 * NIGDY nie modyfikuj w wariantach ani transformacjach.
 */
import { kartaTechniczna, buildPlotData } from "@/data/karta-techniczna";
import type { Setbacks } from "@/types/project";
import type { BuildingSize, ProjectVariant } from "@/types/variant";

/** Działka + orientacja świata — stałe (PZT PROCEL 08.2022) */
export const IMMUTABLE = {
  plot: kartaTechniczna.plot,
  elevation: kartaTechniczna.elevation,
  neighbors: kartaTechniczna.neighbors,
  utilities: kartaTechniczna.utilities,
  utilitiesGesut: kartaTechniczna.utilitiesGesut,
  cardinal: {
    west: "Zachód — dz. 4/10 / dojazd od ul. Północnej",
    east: "Wschód — dz. 25/27, 25/20, 25/18",
    north: "Północ — dz. 4/4 (dom sąsiada 48R, skarpa)",
    south: "Południe — dz. 4/6",
  },
} as const;

/** Minimalne odległości regulaminowe (MPZP / sąsiad 48R) */
export const SETBACK_MIN = {
  north: kartaTechniczna.odleglosciRegulaminowe.odGranicyPolnoc,
  south: kartaTechniczna.odleglosciRegulaminowe.odGranicyPoludnieMin,
} as const;

/** Zawsze ten sam obiekt działki do wizualizacji (mapa, topo, info) */
export const immutablePlotData = buildPlotData(true);

/** Co wolno zmieniać w wariantach */
export const MUTABLE_FIELDS = [
  "wymiary bryły (W–E × N–S)",
  "usytuowanie budynku na działce (odległości od granic)",
  "układ pomieszczeń wewnątrz bryły",
  "inspiracje / referencje z internetu",
  "adaptacje funkcjonalne (Hikora, Japandi…)",
] as const;

export const IMMUTABLE_FIELDS = [
  "wymiary działki 43,72 × 21,05 m",
  "strony świata (Z=dojazd od ul. Północnej, P=dz. 4/4, Poł=dz. 4/6)",
  "nachylenie terenu i rzędne NMT (teren rośnie NW→SE)",
  "sąsiedztwo (dz. 4/10, 4/4, 4/6, 25/27, 25/20, 25/18)",
  "przyłącza (GESUT 2026-10-04: woda wzdłuż północy, kanalizacja głównie na dz. 4/4 i pas wschodni 4/5, prąd Z i E; gaz/tel. nie w kadrze)",
  "MPZP 67MN, klasa PsIV",
] as const;

/** Prompt dla agenta LLM */
export const PLOT_CONSTRAINTS_PROMPT = `
## REGUŁY NIEZMIENNOŚCI (BEZWZGLĘDNE)

TWarde (nie proponuj zmian, nie „obracaj działki”):
${IMMUTABLE_FIELDS.map((f) => `- ${f}`).join("\n")}

Zmienne (tu możesz doradzać i proponować warianty):
${MUTABLE_FIELDS.map((f) => `- ${f}`).join("\n")}

Strony świata na mapie i PZT są stałe:
- ZACHÓD (lewa strona mapy) = dz. 4/10 / dojazd od ul. Północnej
- WSCHÓD (prawa strona) = dz. 25/27, 25/20, 25/18
- PÓŁNOC (góra) = dz. 4/4
- POŁUDNIE (dół) = dz. 4/6

Lustrzane odbicie bryły = tylko przesunięcie budynku NA tej samej działce.
Nie zamieniaj lasu z drogą. Salon powinien patrzeć na WSCHÓD (las).

Minimalne odległości regulaminowe (nie proponuj mniejszych):
- Północ (dz. 4/4, sąsiad 48R): ${SETBACK_MIN.north} m od bryły
- Południe (dz. 4/6): min. ${SETBACK_MIN.south} m od granicy działki
`.trim();

/**
 * Kotwica: zachód + północ. Wymusza min. 4 m od P (48R) i min. 4 m od Poł.
 * Południe może być większe (np. 6,21 m), gdy bryła 10,84 m nie wypełnia całej szerokości N–S.
 */
export function clampSetbacksToPlot(
  setbacks: Setbacks,
  building: BuildingSize,
): Setbacks {
  const plotW = IMMUTABLE.plot.lengthWE;
  const plotH = IMMUTABLE.plot.widthNS;
  const west = Math.max(0, setbacks.west);
  const north = Math.max(SETBACK_MIN.north, setbacks.north);
  const south = Math.max(
    SETBACK_MIN.south,
    Math.round((plotH - north - building.lengthNS) * 100) / 100,
  );
  const east = Math.max(0, Math.round((plotW - west - building.widthWE) * 100) / 100);
  return {
    west: Math.round(west * 100) / 100,
    north: Math.round(north * 100) / 100,
    south: Math.round(south * 100) / 100,
    east: Math.round(east * 100) / 100,
  };
}

/** Wariant nie może nadpisać twardej działki — tylko bryła i układ */
export function sanitizeVariant(variant: ProjectVariant): ProjectVariant {
  const building = variant.buildingSize ?? {
    widthWE: immutablePlotData.building.width,
    lengthNS: immutablePlotData.building.length,
  };
  let setbacks = variant.setbacks ?? immutablePlotData.building.setbacks;

  if (variant.transform === "mirror-ns") {
    setbacks = {
      ...setbacks,
      north: immutablePlotData.building.setbacks.north,
      south: immutablePlotData.building.setbacks.south,
    };
  }

  setbacks = clampSetbacksToPlot(setbacks, building);

  return {
    ...variant,
    buildingSize: building,
    setbacks,
  };
}

export function isMirrorOnlyOnFixedPlot(transform: ProjectVariant["transform"]): boolean {
  return transform === "mirror-ew" || transform === "mirror-ns";
}
