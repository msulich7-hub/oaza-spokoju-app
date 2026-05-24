export interface ReferenceProject {
  id: string;
  slug: string;
  name: string;
  source: string;
  provider: string;
  description: string;
  areaNetM2: number;
  garageM2: number;
  rooms: number;
  bathrooms: number;
  minPlotM: { width: number; length: number };
  buildCostNetPln?: number;
  epKwhM2?: number;
  features: string[];
  mirrorAvailable: boolean;
  /** Porównanie z Oazą Spokoju */
  vsOaza: string[];
}

export const HIKORA_3_URL =
  "https://www.archon.pl/projekty-domow/projekt-dom-pod-hikora-3-mb592291a9387a";

export const referenceProjects: ReferenceProject[] = [
  {
    id: "archon-hikora-3",
    slug: "dom-pod-hikora-3-mb592291a9387a",
    name: "Dom pod hikorą 3",
    source: HIKORA_3_URL,
    provider: "ARCHON+",
    description:
      "Dom jednorodzinny z poddaszem użytkowym, garaż jednostanowiskowy, salon+jadalnia 30,3 m², gabinet na parterze, 2 łazienki, kominek. Archon oferuje oficjalnie wersję lustrzaną (PDF + widok na stronie).",
    areaNetM2: 139.49,
    garageM2: 18.46,
    rooms: 5,
    bathrooms: 2,
    minPlotM: { width: 17.6, length: 21.4 },
    buildCostNetPln: 354900,
    epKwhM2: 66.97,
    features: [
      "Poddasze użytkowe",
      "Gabinet na parterze z wyjściem na taras",
      "Spiżarnia przy kuchni",
      "Wiatrołap + garaż od wejścia",
      "Wentylacja grawitacyjna (rekuperacja jako opcja)",
      "Dach dwuspadowy 40°",
    ],
    mirrorAvailable: true,
    vsOaza: [
      "Działka Oazy (43,72×21,05 m) jest szersza niż minimum Hikory (17,6×21,4 m) — lustrzane odbicie mieści się.",
      "Oaza ma większą powierzchnię zabudowy (12,5×12,5 m) i garaż 2-stanowiskowy vs 1-stan. w Hikorze.",
      "Hikora: salon 30,3 m² + kominek; Oaza: salon ~30 m² z HST na las — podobna strefa dzienna.",
      "Hikora ma 2 łazienki (parter + poddasze); Oaza też 2, ale brak drugiej łazienki dzieci na piętrze wg konsultacji.",
      "Hikora EP ~67 kWh/m²/rok (gaz); Oaza planuje pompę ciepła + rekuperację — lepszy standard.",
      "Archon: „odwrócona kalka” do sprawdzenia lustrzanego odbicia na mapie — ten sam workflow co w aplikacji.",
    ],
  },
];

export function findReferenceByUrl(url: string): ReferenceProject | undefined {
  try {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();
    return referenceProjects.find(
      (p) => path.includes(p.slug) || url.includes(p.slug),
    );
  } catch {
    return referenceProjects.find((p) => url.includes(p.slug));
  }
}
