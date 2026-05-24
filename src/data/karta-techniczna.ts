/**
 * KARTA TECHNICZNA DZIAŁKI — źródło prawdy dla projektu „Oaza Spokoju”
 * Ostatnia aktualizacja: 2026-05-24
 * Źródła: PZT PROCEL 08.2022, SIP Cieszyn, dane geodezyjne
 */

import type { PlotData, Setbacks } from "@/types/project";

/** Wymiary oryginalne z koncepcji (12,50 × 12,50) */
export const buildingOriginal = {
  widthWE: 12.5,
  lengthNS: 12.5,
  footprint: 156.25,
} as const;

/**
 * Bryła powiększona — mieści się na działce wg PZT:
 * N–S: 4,00 + 10,84 + 6,21 = 21,05 m ✓ (P=4 m przepisy, Poł≥4 m min.)
 * W–E: 9,80 + 14,00 + 19,92 = 43,72 m ✓
 */
export const buildingEnlarged = {
  widthWE: 14.0,
  lengthNS: 10.84,
  footprint: 151.76,
} as const;

export const kartaTechniczna = {
  updatedAt: "2026-05-24",
  plot: {
    id: "4/5",
    obreb: "240301_1.0002",
    egibId: "240301_1.0002.4/5",
    city: "Cieszyn",
    street: "Północna",
    voivodeship: "śląskie",
    mpzp: "67MN",
    landClass: "PsIV",
    lengthWE: 43.72,
    widthNS: 21.05,
    areaM2: 920,
    coordinates: { lat: 49.7730294, lng: 18.6456357 },
  },
  elevation: {
    reference: 368.5,
    westEntry: 367.2,
    eastGarden: 368.9,
    minNW: 366.8,
    maxSE: 369.8,
    slopeWE_percent: 3.9,
    slopeNS_percent: 6.0,
    slopeDiagonal_percent: 6.2,
    source: "NMT GUGiK / ULDK, siatka 2 m dla min/max, 2026-05-24",
  },
  neighbors: {
    west: { plot: "4/10", description: "Pas/wjazd od strony ul. Północnej; droga dalej na zachód" },
    north: { plot: "4/4", description: "Dom sąsiada 48R — min. 4 m od bryły (przepisy)" },
    south: { plot: "4/6", description: "Bezpośrednia działka południowa — min. 4 m od granicy" },
    east: { plot: "25/27, 25/20, 25/18", description: "Tereny zielone / działki serii 25/xx" },
  },
  geometry: {
    source: "ULDK GUGiK GetParcelById",
    srid: 2180,
    areaM2: 919.2,
    bboxApproxM: { westEast: 44.3, northSouth: 21.5 },
    centroid: {
      lat: 49.7730294,
      lng: 18.6456357,
      puwg1992: { x: 211801.12, y: 474492.07 },
    },
    wkt:
      "SRID=2180;POLYGON((474466.874608498 211808.850931704,474467.453930656 211787.824837034,474511.166242863 211788.311717932,474510.839335675 211799.779732795,474510.697404157 211804.878804504,474510.56693539 211809.33807731,474466.874608498 211808.850931704))",
  },
  terrainModel: {
    source: "GUGiK NMT GetMinMaxByPolygon / GetHByXY",
    heightSystem: "PL-KRON86-NH",
    accuracyNote: "Model NMT 1 m; publiczne odczyty wysokości traktować orientacyjnie (rzędu decymetrów), nie jako pomiar geodezyjny do projektu.",
    min: { h: 366.8, puwg1992: { x: 211807, y: 474468 } },
    max: { h: 369.8, puwg1992: { x: 211789, y: 474506 } },
    centroidH: 368.5,
    cornerHeights: {
      nw: 366.5,
      sw: 367.9,
      se: 369.5,
      ne: 368.4,
    },
  },
  /** Minimalne odległości regulaminowe (MPZP 67MN / WT26) */
  odleglosciRegulaminowe: {
    odGranicyPolnoc: 4.0,
    odGranicyPoludnieMin: 4.0,
    odSasiada48R: 4.0,
  },
  satelliteImagery: {
    capturedAt: "2026-05-24",
    source: "Google Maps — kadr działki 4/5 od użytkownika",
    imagePath: "/images/satellite-dzialka-4-5-confirmed.png",
    mapsUrl:
      "https://www.google.com/maps?q=49.7730294,18.6456357",
    geoportalSources: [
      {
        name: "Geoportal Cieszyn — instrukcja wyszukiwania działki",
        url: "https://www.geoportal.geodezja.cieszyn.pl/",
      },
      {
        name: "OnGeo / Geoportal obręb 0002 — lista zawiera 240301_1.0002.4/5",
        url: "https://ongeo.pl/geoportal/cieszyn/dzialki-ewidencyjne/240301_1-0002-02",
      },
    ],
    confirms: [
      "Dane opisowe: Cieszyn, ul. Północna, obręb 240301_1.0002, działka 4/5",
      "Identyfikator EGiB potwierdzony w publicznym indeksie obrębu: 240301_1.0002.4/5",
      "Zachód — dz. 4/10 / wjazd od strony ul. Północnej",
      "Północ — dz. 4/4",
      "Południe — dz. 4/6 (dz. 4/8 leży kierunkowo SW, nie jako główny sąsiad południowy)",
      "Wschód — działki serii 25/xx",
      "Działka 4/5 — trawa, bez zabudowy (greenfield)",
    ],
  },
  /** Odległości budynku powiększonego od granic — P=4 m (48R), Poł≥4 m */
  setbacksEnlarged: {
    west: 9.8,
    north: 4.0,
    south: 6.21,
    east: 19.92,
  } satisfies Setbacks,
  /** Odległości budynku 12,50×12,50 (koncepcja arch.) */
  setbacksOriginal: {
    west: 9.8,
    north: 4.0,
    south: 4.55,
    east: 21.42,
  } satisfies Setbacks,
  building: {
    floors: 2,
    roofAngle: 42,
    roofType: "dwuspadowy" as const,
    kalenicaAxis: "W-E" as const,
  },
  utilities: {
    waterSewer: "PÓŁNOC — sieci wzdłuż granicy N (S1, S2, w)",
    powerGas: "ZACHÓD — ul. Północna (e1, gw)",
    telecom: "PÓŁNOCNY-WSCHÓD",
  },
  designPhilosophy: [
    "Warm Minimalism / Japandi / Biophilic",
    "Pancerz zachodni — garaż, kotłownia",
    "Salon HST na WSCHÓD — las",
    "Kuchnia/jadalnia na POŁUDNIE",
    "Ogród kaskadowy 3 poziomy",
  ],
} as const;

export function buildPlotData(useEnlarged = true): PlotData {
  const b = useEnlarged ? buildingEnlarged : buildingOriginal;
  const s = useEnlarged ? kartaTechniczna.setbacksEnlarged : kartaTechniczna.setbacksOriginal;
  return {
    id: kartaTechniczna.plot.id,
    location: {
      city: kartaTechniczna.plot.city,
      street: kartaTechniczna.plot.street,
      voivodeship: kartaTechniczna.plot.voivodeship,
      coordinates: kartaTechniczna.plot.coordinates,
    },
    dimensions: {
      lengthWE: kartaTechniczna.plot.lengthWE,
      widthNS: kartaTechniczna.plot.widthNS,
      area: kartaTechniczna.plot.areaM2,
    },
    zoning: {
      mpzp: kartaTechniczna.plot.mpzp,
      landClass: kartaTechniczna.plot.landClass,
    },
    elevation: {
      reference: kartaTechniczna.elevation.reference,
      west: kartaTechniczna.elevation.westEntry,
      east: kartaTechniczna.elevation.eastGarden,
      minNW: kartaTechniczna.elevation.minNW,
      maxSE: kartaTechniczna.elevation.maxSE,
    },
    building: {
      width: b.widthWE,
      length: b.lengthNS,
      footprint: b.footprint,
      floors: kartaTechniczna.building.floors,
      roofAngle: kartaTechniczna.building.roofAngle,
      roofType: kartaTechniczna.building.roofType,
      setbacks: { ...s },
    },
    neighbors: {
      north: kartaTechniczna.neighbors.north,
      south: kartaTechniczna.neighbors.south,
      east: kartaTechniczna.neighbors.east,
      west: kartaTechniczna.neighbors.west,
    },
  };
}

/** Skrócony kontekst LLM — generowany z karty technicznej */
export function buildProjectContext(): string {
  const p = kartaTechniczna.plot;
  const b = buildingEnlarged;
  const s = kartaTechniczna.setbacksEnlarged;
  return `
# PROJEKT "OAZA SPOKOJU" — KARTA TECHNICZNA (${kartaTechniczna.updatedAt})

## DZIAŁKA ${p.id}, ${p.city}, ul. ${p.street}
- Identyfikator EGiB: ${p.egibId}
- Wymiary: ${p.lengthWE} m (W–E) × ${p.widthNS} m (N–S) = ~${p.areaM2} m²
- MPZP: ${p.mpzp} | Klasa: ${p.landClass}
- ±0,00 budynku: ${kartaTechniczna.elevation.reference} m n.p.m.

## TOPOGRAFIA
- Teren rośnie głównie NW → SE (~${kartaTechniczna.elevation.slopeWE_percent}% W–E, ~${kartaTechniczna.elevation.slopeNS_percent}% N–S, diagonalnie ~${kartaTechniczna.elevation.slopeDiagonal_percent}%)
- Wjazd (Z): ~${kartaTechniczna.elevation.westEntry} m | Ogród (E): ~${kartaTechniczna.elevation.eastGarden} m
- NMT GUGiK: min. ~${kartaTechniczna.elevation.minNW} m, max. ~${kartaTechniczna.elevation.maxSE} m; dane orientacyjne, nie pomiar geodezyjny
- Drenaż krytyczny: narożnik NW (podmakanie)

## SĄSIEDZTWO (STAŁE — nie zmienia się w wariantach)
- ZACHÓD: dz. 4/10 / wjazd od ul. ${p.street} | PÓŁNOC: dz. 4/4 (dom 48R) | POŁUDNIE: dz. 4/6 | WSCHÓD: dz. 25/27, 25/20, 25/18

## REGUŁY NIEZMIENNOŚCI
- TWarde: działka, strony świata, topografia, sąsiedztwo, przyłącza, MPZP
- Zmienne: bryła, usytuowanie budynku, układ pomieszczeń

## BUDYNEK ${b.widthWE} × ${b.lengthNS} m (powiększona bryła, ${b.footprint} m² zabudowy)
Odległości od granic (min. 4 m od P i Poł wg przepisów / sąsiada 48R):
- Z (dz. 4/10 / droga dalej): ${s.west} m | P (dz. 4/4, 48R): ${s.north} m | Poł (dz. 4/6): ${s.south} m | Wschód (25/xx): ${s.east} m

## STREFOWANIE
- PARTER Z: garaż, wiatrołap, kotłownia | P: biuro/gabinet | W: salon HST ~30 m² | Poł: kuchnia+spiżarnia
- PIĘTRO W: master + garderoba | Poł: 2 sypialnie dzieci | Z: pralnia, 2. łazienka dzieci

## PRZYŁĄCZA
- ${kartaTechniczna.utilities.waterSewer}
- ${kartaTechniczna.utilities.powerGas}

## KONCEPCJA
${kartaTechniczna.designPhilosophy.map((x) => `- ${x}`).join("\n")}
`.trim();
}
