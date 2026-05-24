"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { immutablePlotData } from "@/lib/plot-constraints";
import { kartaTechniczna } from "@/data/karta-techniczna";
import { plotData } from "@/data/project-context";
import type { Setbacks } from "@/types/project";

/**
 * Potwierdzony kadr działki 4/5 (Google Maps, 2026-05-24).
 * Wartości w % — dopasowane do public/images/satellite-dzialka-4-5-confirmed.png.
 * Północ = góra, Zachód = lewo (ul. Północna).
 */
const OVERLAY = {
  plot: { left: 6, top: 4, width: 88, height: 92 },
} as const;

interface SatelliteMapViewProps {
  setbacks?: Setbacks;
  variantLabel?: string;
  buildingWidthWE?: number;
  buildingLengthNS?: number;
}

function pctRect(
  plotLeft: number,
  plotTop: number,
  plotW: number,
  plotH: number,
  offsetWE: number,
  offsetNS: number,
  sizeWE: number,
  sizeNS: number,
  plotLengthWE: number,
  plotWidthNS: number,
) {
  const left = plotLeft + (offsetWE / plotLengthWE) * plotW;
  const top = plotTop + (offsetNS / plotWidthNS) * plotH;
  const width = (sizeWE / plotLengthWE) * plotW;
  const height = (sizeNS / plotWidthNS) * plotH;
  return { left, top, width, height };
}

export function SatelliteMapView({
  setbacks,
  variantLabel,
  buildingWidthWE = plotData.building.width,
  buildingLengthNS = plotData.building.length,
}: SatelliteMapViewProps) {
  const s = setbacks ?? plotData.building.setbacks;
  const plotWE = immutablePlotData.dimensions.lengthWE;
  const plotNS = immutablePlotData.dimensions.widthNS;

  const { plot } = OVERLAY;
  const building = pctRect(
    plot.left,
    plot.top,
    plot.width,
    plot.height,
    s.west,
    s.north,
    buildingWidthWE,
    buildingLengthNS,
    plotWE,
    plotNS,
  );

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <div className="relative aspect-[235/139] w-full overflow-hidden rounded-lg border border-border shadow-md">
        <Image
          src={kartaTechniczna.satelliteImagery.imagePath}
          alt="Potwierdzony kadr satelitarny działki 4/5 w Cieszynie przy ul. Północnej"
          fill
          className="object-cover"
          sizes="(max-width: 896px) 100vw, 896px"
          priority
        />

        {/* Granica działki 4/5 */}
        <div
          className="pointer-events-none absolute border-2 border-dashed border-accent"
          style={{
            left: `${plot.left}%`,
            top: `${plot.top}%`,
            width: `${plot.width}%`,
            height: `${plot.height}%`,
          }}
          aria-hidden
        >
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-bg/90 px-2 py-0.5 text-[10px] font-medium text-accent">
            Działka 4/5 · {plotWE} × {plotNS} m
          </span>
        </div>

        {/* Bryła projektowana */}
        <div
          className="pointer-events-none absolute border-2 border-amber-700 bg-amber-400/35"
          style={{
            left: `${building.left}%`,
            top: `${building.top}%`,
            width: `${building.width}%`,
            height: `${building.height}%`,
          }}
          aria-hidden
        >
          <span className="absolute inset-0 flex items-center justify-center text-center text-[9px] font-medium leading-tight text-amber-950">
            Budynek
            <br />
            {buildingWidthWE} × {buildingLengthNS} m
          </span>
        </div>

        {/* Etykiety orientacyjne — granice do skalibrowania po wyrysie/SIP. */}
        <LabelBadge className="left-[2%] top-[42%]" rotate={-90}>
          Z · ul. Północna
        </LabelBadge>
        <LabelBadge className="left-[38%] top-[1%]">N · dz. 4/4 · min. 4 m</LabelBadge>
        <LabelBadge className="left-[38%] bottom-[1%]">S · dz. 4/6 · min. 4 m</LabelBadge>
        <LabelBadge className="right-[1%] top-[38%]" rotate={90}>
          Wschód · dz. 25/xx
        </LabelBadge>
      </div>

      <div className="mt-3 space-y-2 text-xs text-text-muted">
        <p>
          <strong className="text-text">Zdjęcie satelitarne</strong> — potwierdzony kadr działki{" "}
          {kartaTechniczna.plot.egibId}, Google Maps,{" "}
          {kartaTechniczna.satelliteImagery?.capturedAt ?? "2026-05-24"}. Granica i bryła są
          nakładką projektową na podstawie wymiarów działki; po eksporcie wyrysu/SIP można ją doskalować.
          {variantLabel ? ` Wariant: ${variantLabel}.` : ""}
        </p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <span>Setback Z: {s.west} m</span>
          <span>N: {s.north} m</span>
          <span>S: {s.south} m</span>
          <span>Wschód: {s.east} m</span>
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a
            href={kartaTechniczna.satelliteImagery?.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-accent underline-offset-2 hover:underline"
          >
            Otwórz w Google Maps →
          </a>
          <a
            href={kartaTechniczna.satelliteImagery.geoportalSources[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-accent underline-offset-2 hover:underline"
          >
            Potwierdź EGiB 240301_1.0002.4/5 →
          </a>
        </div>
      </div>
    </div>
  );
}

function LabelBadge({
  children,
  className = "",
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      className={`pointer-events-none absolute rounded bg-bg/85 px-2 py-0.5 text-[10px] font-medium text-text shadow-sm ${className}`}
      style={rotate !== 0 ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {children}
    </span>
  );
}
