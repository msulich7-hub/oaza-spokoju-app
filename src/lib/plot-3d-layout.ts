/**
 * Układ widoku 3D działki 4/5 — liczby z karty technicznej.
 * Wysokość kondygnacji i drobne odsunięcia wizualne poza przedziałem GESUT
 * nie są pomiarem geodezyjnym.
 */
import { buildingEnlarged, kartaTechniczna } from "@/data/karta-techniczna";

export const PLOT_WE = kartaTechniczna.plot.lengthWE;
export const PLOT_NS = kartaTechniczna.plot.widthNS;
export const BUILDING_WE = buildingEnlarged.widthWE;
export const BUILDING_NS = buildingEnlarged.lengthNS;
export const SETBACKS = kartaTechniczna.setbacksEnlarged;
export const CORNER_H = kartaTechniczna.terrainModel.cornerHeights;
export const REF_H = kartaTechniczna.elevation.reference;
export const ROOF_ANGLE_DEG = kartaTechniczna.building.roofAngle;
export const FLOORS = kartaTechniczna.building.floors;
export const GESUT = kartaTechniczna.utilitiesGesut;
export const GARDEN = kartaTechniczna.gardenLayout;

/** Najniższy narożnik NMT (NW) — zero wysokości w scenie */
export const MIN_CORNER_H = Math.min(CORNER_H.nw, CORNER_H.ne, CORNER_H.sw, CORNER_H.se);

/** Umowna wysokość kondygnacji w podglądzie — brak w karcie */
export const PREVIEW_STOREY_M = 3;

/**
 * Wizualny środek przedziału GESUT 4–5 m.
 * W etykietach zostaje „ok. 4–5 m”, bez zgadywania centymetrów.
 */
export const GESUT_OFFSET_PREVIEW_M =
  (GESUT.sewer.northOfNorthBoundaryM.min + GESUT.sewer.northOfNorthBoundaryM.max) / 2;

export const BUILDING_X = SETBACKS.west;
export const BUILDING_Z = SETBACKS.north;
export const BUILDING_EAST_X = BUILDING_X + BUILDING_WE;
export const BUILDING_SOUTH_Z = BUILDING_Z + BUILDING_NS;
export const TERRACE_EAST_X = BUILDING_EAST_X + GARDEN.terraceEastFromWallApproxM;

/** Taras południowy zostaje w obrębie odsunięcia 6,21 m z karty */
export const TERRACE_SOUTH_DEPTH_M = Math.min(3, SETBACKS.south - 0.8);

export function heightAt(x: number, z: number): number {
  const u = clamp01(x / PLOT_WE);
  const v = clamp01(z / PLOT_NS);
  const h =
    CORNER_H.nw * (1 - u) * (1 - v) +
    CORNER_H.ne * u * (1 - v) +
    CORNER_H.sw * (1 - u) * v +
    CORNER_H.se * u * v;
  return h - MIN_CORNER_H;
}

export function buildingFloorY(): number {
  return REF_H - MIN_CORNER_H;
}

export function roofRiseM(): number {
  return (BUILDING_NS / 2) * Math.tan((ROOF_ANGLE_DEG * Math.PI) / 180);
}

export function fruitTreePositions(): Array<{
  x: number;
  z: number;
  kind: "jablon" | "grusza";
}> {
  const xs = {
    jablon: GARDEN.fruitTrees.appleFromWestM,
    grusza: GARDEN.fruitTrees.pearFromWestM,
  } as const;
  return (["jablon", "grusza"] as const).flatMap((kind) =>
    GARDEN.fruitTrees.rowsFromNorthM.map((fromNorth) => ({
      x: xs[kind],
      z: fromNorth,
      kind,
    })),
  );
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function isWetNorthwest(x: number, z: number): boolean {
  return x < 8 && z < 7;
}

export function isNorthUtilityStrip(z: number): boolean {
  return z < SETBACKS.north;
}

export function isEastSewerCorridor(x: number): boolean {
  return x > PLOT_WE - GESUT.sewer.westOfEastBoundaryM.max;
}
