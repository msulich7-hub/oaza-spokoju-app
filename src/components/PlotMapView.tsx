"use client";

import { immutablePlotData } from "@/lib/plot-constraints";
import { plotData } from "@/data/project-context";
import type { Setbacks } from "@/types/project";

const PLOT_W = immutablePlotData.dimensions.lengthWE;
const PLOT_H = immutablePlotData.dimensions.widthNS;
const SCALE = 14;

interface PlotMapViewProps {
  setbacks?: Setbacks;
  variantLabel?: string;
  buildingWidthWE?: number;
  buildingLengthNS?: number;
}

export function PlotMapView({
  setbacks,
  variantLabel,
  buildingWidthWE = plotData.building.width,
  buildingLengthNS = plotData.building.length,
}: PlotMapViewProps) {
  const s = setbacks ?? plotData.building.setbacks;
  const svgW = PLOT_W * SCALE;
  const svgH = PLOT_H * SCALE;
  const padding = 50;

  const buildingW = buildingWidthWE * SCALE;
  const buildingH = buildingLengthNS * SCALE;
  const buildingX = s.west * SCALE;
  const buildingY = s.north * SCALE;

  return (
    <svg
      viewBox={`${-padding} ${-padding} ${svgW + padding * 2} ${svgH + padding * 2}`}
      className="h-full w-full max-h-[600px]"
      role="img"
      aria-label="Mapa działki z usytuowaniem budynku"
    >
      {/* Plot boundary */}
      <rect
        x={0}
        y={0}
        width={svgW}
        height={svgH}
        fill="#e8f0e0"
        stroke="#2d5016"
        strokeWidth={2}
        strokeDasharray="none"
      />

      {/* Road (west) */}
      <rect
        x={-30}
        y={0}
        width={30}
        height={svgH}
        fill="#d8d0c8"
        stroke="#6b6560"
        strokeWidth={1}
      />
      <text x={-15} y={svgH / 2} textAnchor="middle" className="fill-text-muted text-[8px]" transform={`rotate(-90, -15, ${svgH / 2})`}>
        ul. Północna
      </text>

      {/* Forest (east) */}
      <rect
        x={svgW}
        y={0}
        width={40}
        height={svgH}
        fill="#c5d5c0"
        stroke="#2d5016"
        strokeWidth={1}
      />
      <text x={svgW + 20} y={svgH / 2} textAnchor="middle" className="fill-accent text-[8px]" transform={`rotate(90, ${svgW + 20}, ${svgH / 2})`}>
        Dz. 25/xx
      </text>

      {/* Neighbor north */}
      <text x={svgW / 2} y={-15} textAnchor="middle" className="fill-text-muted text-[9px]">
        ↑ dz. 4/4 (sąsiad)
      </text>

      {/* Neighbor south */}
      <text x={svgW / 2} y={svgH + 25} textAnchor="middle" className="fill-text-muted text-[9px]">
        dz. 4/6 ↓
      </text>

      {/* Building */}
      <rect
        x={buildingX}
        y={buildingY}
        width={buildingW}
        height={buildingH}
        fill="#d4c5b0"
        stroke="#2d5016"
        strokeWidth={2}
      />
      <text
        x={buildingX + buildingW / 2}
        y={buildingY + buildingH / 2}
        textAnchor="middle"
        className="fill-text text-[10px] font-medium"
      >
        Budynek
        {"\n"}
        {buildingWidthWE} × {buildingLengthNS} m
      </text>

      {/* Setback dimensions */}
      <line x1={0} y1={buildingY + buildingH / 2} x2={buildingX} y2={buildingY + buildingH / 2} stroke="#6b6560" strokeWidth={1} strokeDasharray="4" />
      <text x={buildingX / 2} y={buildingY + buildingH / 2 - 5} textAnchor="middle" className="fill-text-muted text-[8px]">
        {s.west} m
      </text>

      <line x1={buildingX + buildingW / 2} y1={0} x2={buildingX + buildingW / 2} y2={buildingY} stroke="#6b6560" strokeWidth={1} strokeDasharray="4" />
      <text x={buildingX + buildingW / 2 + 15} y={buildingY / 2} textAnchor="middle" className="fill-text-muted text-[8px]">
        {s.north} m
      </text>

      <line x1={buildingX + buildingW / 2} y1={buildingY + buildingH} x2={buildingX + buildingW / 2} y2={svgH} stroke="#6b6560" strokeWidth={1} strokeDasharray="4" />
      <text x={buildingX + buildingW / 2 + 15} y={buildingY + buildingH + (svgH - buildingY - buildingH) / 2} textAnchor="middle" className="fill-text-muted text-[8px]">
        {s.south} m
      </text>

      <line x1={buildingX + buildingW} y1={buildingY + buildingH / 2} x2={svgW} y2={buildingY + buildingH / 2} stroke="#6b6560" strokeWidth={1} strokeDasharray="4" />
      <text x={buildingX + buildingW + (svgW - buildingX - buildingW) / 2} y={buildingY + buildingH / 2 - 5} textAnchor="middle" className="fill-text-muted text-[8px]">
        {s.east} m
      </text>

      {/* Plot dimensions */}
      <text x={svgW / 2} y={svgH + 45} textAnchor="middle" className="fill-text-muted text-[10px]">
        Działka 4/5 · {PLOT_W} × {PLOT_H} m · ~{immutablePlotData.dimensions.area} m²
        {variantLabel ? ` · ${variantLabel}` : ""}
      </text>
    </svg>
  );
}
