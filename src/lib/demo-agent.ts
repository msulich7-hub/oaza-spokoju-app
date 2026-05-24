import { kartaTechniczna } from "@/data/karta-techniczna";
import { plotData } from "@/data/project-context";

interface DemoResponse {
  text: string;
  actions: Array<{ name: string; params: Record<string, string> }>;
}

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

export function buildDemoResponse(message: string): DemoResponse {
  const q = normalize(message);

  if (q.includes("rzut") && (q.includes("pietr") || q.includes("poddas") || q.includes("gor"))) {
    return {
      text: "Oto rzut piętra — sypialnia master od wschodu z widokiem na las, pokoje dzieci od południa, pralnia nad kotłownią od zachodu.",
      actions: [{ name: "showFloorPlan", params: { floor: "pietro" } }],
    };
  }

  if (q.includes("rzut") || q.includes("parter") || q.includes("pomieszczen")) {
    return {
      text: "Pokazuję rzut parteru. Garaż i kotłownia od zachodu (bufor od drogi), salon z HST na wschód, kuchnia+jadalnia od południa.",
      actions: [{ name: "showFloorPlan", params: { floor: "parter" } }],
    };
  }

  if (q.includes("salon") || q.includes("kuchnia") || q.includes("garaz") || q.includes("garaż")) {
    const roomMap: Record<string, string> = {
      salon: "salon",
      kuchnia: "kuchnia",
      garaz: "garaz",
      garaż: "garaz",
    };
    const roomId = Object.keys(roomMap).find((k) => q.includes(k)) ?? "salon";
    return {
      text: `Podświetlam pomieszczenie: ${roomId}.`,
      actions: [{ name: "highlightRoom", params: { roomId: roomMap[roomId] ?? roomId, floor: "parter" } }],
    };
  }

  if (q.includes("satelit") || q.includes("google") || q.includes("sasiad") || q.includes("sąsiad") || q.includes("48r") || q.includes("zdjec") || q.includes("zdjęc")) {
    return {
      text: `Oto potwierdzony kadr satelitarny działki ${kartaTechniczna.plot.egibId}. Dane opisowe: Cieszyn, ul. Północna, obręb ${kartaTechniczna.plot.obreb}, działka ${kartaTechniczna.plot.id}. Działka jest pusta — trawa, bez zabudowy.`,
      actions: [{ name: "showSatellite", params: {} }],
    };
  }

  if (q.includes("mapa") || q.includes("dzialk") || q.includes("działk") || q.includes("usytuow")) {
    return {
      text: `Działka 4/5 ma ${plotData.dimensions.lengthWE} × ${plotData.dimensions.widthNS} m (~${plotData.dimensions.area} m²). Budynek 12,5×12,5 m: od drogi (Z) ${plotData.building.setbacks.west} m, od północy ${plotData.building.setbacks.north} m, od południa ${plotData.building.setbacks.south} m, od wschodu ${plotData.building.setbacks.east} m.`,
      actions: [{ name: "showPlotMap", params: {} }],
    };
  }

  if (q.includes("topograf") || q.includes("rzedn") || q.includes("rzędn") || q.includes("spadek")) {
    return {
      text: `Teren rośnie z NW (${plotData.elevation.minNW} m) na SE (${plotData.elevation.maxSE} m). Poziom ±0,00 budynku: ${plotData.elevation.reference} m n.p.m.`,
      actions: [{ name: "showTopography", params: {} }],
    };
  }

  if (q.includes("3d") || q.includes("bryla") || q.includes("bryła") || q.includes("makieta") || q.includes("elewac")) {
    return {
      text: "Pokazuję makietę bryły: dach dwuspadowy, HST na ogród, taras E/S i kontekst stron świata. To widok koncepcyjny, nie render fotorealistyczny.",
      actions: [{ name: "show3D", params: {} }],
    };
  }

  if (q.includes("polnoc") || q.includes("północ")) {
    return {
      text: `Odległość budynku od granicy północnej (dz. 4/4, sąsiad): ${plotData.building.setbacks.north} m. Tu planowane są przyłącza wod-kan.`,
      actions: [{ name: "showPlotMap", params: {} }],
    };
  }

  if (q.includes("przylacz") || q.includes("przyłącz") || q.includes("kanaliz") || q.includes("woda")) {
    return {
      text: "Przyłącza: woda + kanalizacja z północy (sieci wzdłuż granicy N), prąd + gaz z zachodu (ul. Północna), telekomunikacja z NE.",
      actions: [{ name: "showPlotMap", params: {} }],
    };
  }

  if (q.includes("ogrod") || q.includes("ogród")) {
    return {
      text: "Proponuję ogród kaskadowy na wschodzie: trawnik → ogród sensoryczny → leśna polana. Taras L-shape (ThermoWood) na wschód i południe.",
      actions: [{ name: "showPlotMap", params: {} }],
    };
  }

  return {
    text: `Projekt Oaza Spokoju — działka ${plotData.dimensions.lengthWE}×${plotData.dimensions.widthNS} m w Cieszynie, budynek kwadrat 12,5×12,5 m, 2 piętra, dach 42°. Zapytaj o rzut parteru, mapę działki, topografię lub odległości od granic.`,
    actions: [{ name: "showFloorPlan", params: { floor: "parter" } }],
  };
}

export async function* streamDemoResponse(message: string): AsyncGenerator<string> {
  const { text, actions } = buildDemoResponse(message);
  const actionBlocks = actions
    .map((a) => `[[ACTION:${JSON.stringify(a)}]]`)
    .join("\n");
  const full = `${text}\n\n${actionBlocks}`;

  const chunkSize = 12;
  for (let i = 0; i < full.length; i += chunkSize) {
    yield full.slice(i, i + chunkSize);
    await new Promise((r) => setTimeout(r, 20));
  }
}
