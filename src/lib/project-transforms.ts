import { plotData } from "@/data/project-context";
import { buildingEnlarged } from "@/data/karta-techniczna";
import { clampSetbacksToPlot, immutablePlotData, sanitizeVariant } from "@/lib/plot-constraints";
import { parterRooms, pietroRooms } from "@/data/rooms";
import { parterHikoraAdapt, pietroHikoraAdapt } from "@/data/rooms-hikora-adapt";
import {
  buildingFamilyProgram,
  familyProgramSetbacks,
  parterFamilyProgram,
  pietroFamilyProgram,
} from "@/data/rooms-family-program";
import { HIKORA_3_URL } from "@/data/reference-projects";
import type { Room, Setbacks } from "@/types/project";
import type { BuildingSize, ProjectVariant, TransformType } from "@/types/variant";

function getDefaultBuilding(): BuildingSize {
  return { widthWE: plotData.building.width, lengthNS: plotData.building.length };
}

function flipOrientation(o: Room["orientation"]): Room["orientation"] {
  const map: Record<string, Room["orientation"]> = {
    E: "W", W: "E", NE: "NW", NW: "NE", SE: "SW", SW: "SE",
    N: "N", S: "S", C: "C",
  };
  return map[o] ?? o;
}

export function mirrorRoomsEW(rooms: Room[], widthWE: number): Room[] {
  return rooms.map((r) => ({
    ...r,
    x: widthWE - r.x - r.width,
    orientation: flipOrientation(r.orientation),
  }));
}

export function mirrorRoomsNS(rooms: Room[], lengthNS: number): Room[] {
  return rooms.map((r) => ({
    ...r,
    y: lengthNS - r.y - r.height,
    orientation: r.orientation === "N" ? "S" : r.orientation === "S" ? "N" : r.orientation,
  }));
}

export function mirrorSetbacksEW(setbacks: Setbacks, building: BuildingSize): Setbacks {
  const plotW = immutablePlotData.dimensions.lengthWE;
  const newWest = plotW - setbacks.east - building.widthWE;
  const newEast = plotW - setbacks.west - building.widthWE;
  return clampSetbacksToPlot(
    {
      west: Math.round(newWest * 100) / 100,
      north: setbacks.north,
      south: setbacks.south,
      east: Math.round(newEast * 100) / 100,
    },
    building,
  );
}

export function applyTransform(
  type: TransformType,
  building: BuildingSize = getDefaultBuilding(),
): Pick<ProjectVariant, "setbacks" | "roomsOverride" | "buildingSize"> {
  const base = plotData.building.setbacks;
  switch (type) {
    case "mirror-ew":
      return {
        buildingSize: building,
        setbacks: mirrorSetbacksEW(base, building),
        roomsOverride: {
          parter: mirrorRoomsEW(parterRooms, building.widthWE),
          pietro: mirrorRoomsEW(pietroRooms, building.widthWE),
        },
      };
    case "mirror-ns":
      return {
        buildingSize: building,
        setbacks: base,
        roomsOverride: {
          parter: mirrorRoomsNS(parterRooms, building.lengthNS),
          pietro: mirrorRoomsNS(pietroRooms, building.lengthNS),
        },
      };
    case "adapt-hikora":
      return {
        buildingSize: {
          widthWE: buildingEnlarged.widthWE,
          lengthNS: buildingEnlarged.lengthNS,
        },
        setbacks: plotData.building.setbacks,
        roomsOverride: {
          parter: parterHikoraAdapt,
          pietro: pietroHikoraAdapt,
        },
      };
    case "family-program":
      return {
        buildingSize: {
          widthWE: buildingFamilyProgram.widthWE,
          lengthNS: buildingFamilyProgram.lengthNS,
        },
        setbacks: { ...familyProgramSetbacks },
        roomsOverride: {
          parter: parterFamilyProgram,
          pietro: pietroFamilyProgram,
        },
      };
    default:
      return {
        buildingSize: building,
        setbacks: base,
        roomsOverride: undefined,
      };
  }
}

export function createVariantFromIntent(
  name: string,
  intent: string,
  transform: TransformType,
  links: ProjectVariant["referenceLinks"] = [],
): ProjectVariant {
  const applied = applyTransform(transform);
  const now = new Date().toISOString();
  return sanitizeVariant({
    id: `var-${Date.now()}`,
    name,
    description: intent,
    transform,
    intent,
    referenceLinks: links,
    buildingSize: applied.buildingSize,
    setbacks: applied.setbacks,
    roomsOverride: applied.roomsOverride,
    createdAt: now,
    updatedAt: now,
  });
}

export function createHikoraAdaptVariant(): ProjectVariant {
  return createVariantFromIntent(
    "Adaptacja Hikora — salon od lasu",
    "Inspiracja ARCHON Dom pod hikorą 3: wiatrołap, spiżarnia, gabinet, 2 łazienki — salon HST na WSCHÓD (bez odbicia bryły)",
    "adapt-hikora",
    [{
      url: HIKORA_3_URL,
      title: "Dom pod hikorą 3 — ARCHON+",
      description: "Adaptacja układu funkcjonalnego, nie lustrzane odbicie na działce",
      fetchedAt: new Date().toISOString(),
    }],
  );
}

export function createFamilyProgramVariant(): ProjectVariant {
  return createVariantFromIntent(
    "Oaza Spokoju — układ finalny panelu",
    "Werdykt panelu: garaż 2-st. N, salon E+S, pralnia ZN, dzieci Z, master+łazienka+garderoba E, mini-siłownia N, 14×11 m",
    "family-program",
  );
}

export function getBaselineVariant(): ProjectVariant {
  const now = new Date().toISOString();
  const b = getDefaultBuilding();
  return {
    id: "baseline",
    name: "Oaza Spokoju — bryła 14×10,84 m",
    description: "Powiększona bryła wg karty technicznej PZT",
    transform: "none",
    intent: "baseline",
    referenceLinks: [],
    buildingSize: b,
    setbacks: plotData.building.setbacks,
    createdAt: now,
    updatedAt: now,
    isBaseline: true,
  };
}

export function detectTransformFromIntent(intent: string): TransformType {
  const q = intent.toLowerCase();
  if (
    q.includes("garaż od północ") ||
    q.includes("garaz od polnoc") ||
    q.includes("program rodzin") ||
    q.includes("family program") ||
    q.includes("dzieci zachód") ||
    q.includes("dzieci zachod")
  ) {
    return "family-program";
  }
  if (
    q.includes("adaptacja hikor") ||
    q.includes("salon od lasu") ||
    q.includes("bez odbicia") ||
    q.includes("bez lustrzan") ||
    (q.includes("hikor") && !q.includes("lustrzan") && !q.includes("odbici"))
  ) {
    return "adapt-hikora";
  }
  if (q.includes("lustrzan") || q.includes("mirror") || q.includes("odbici") || q.includes("flip")) {
    if (q.includes("północ") || q.includes("polnoc") || q.includes("ns") || q.includes("n-s")) {
      return "mirror-ns";
    }
    return "mirror-ew";
  }
  if (q.includes("obróć") || q.includes("obroc") || q.includes("rotate")) return "mirror-ew";
  return "none";
}

export function resolveBuildingSize(variant?: ProjectVariant | null): BuildingSize {
  if (variant?.buildingSize) return variant.buildingSize;
  return getDefaultBuilding();
}
