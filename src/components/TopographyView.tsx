"use client";

import { immutablePlotData } from "@/lib/plot-constraints";
import { plotData } from "@/data/project-context";
import { kartaTechniczna } from "@/data/karta-techniczna";

export function TopographyView() {
  const points = [
    { label: "Wjazd (Z)", elevation: immutablePlotData.elevation.west, x: 10 },
    { label: "NW (min)", elevation: immutablePlotData.elevation.minNW, x: 25 },
    { label: "±0,00 budynek", elevation: immutablePlotData.elevation.reference, x: 50 },
    { label: "Ogród (E)", elevation: immutablePlotData.elevation.east, x: 75 },
    { label: "SE (max)", elevation: immutablePlotData.elevation.maxSE, x: 90 },
  ];

  const minElev = 365.5;
  const maxElev = 370;
  const range = maxElev - minElev;
  const chartH = 200;
  const chartW = 500;
  const padding = { top: 40, bottom: 60, left: 50, right: 30 };

  const toY = (elev: number) =>
    padding.top + chartH - ((elev - minElev) / range) * chartH;

  const pathPoints = points
    .map((p) => {
      const x = padding.left + (p.x / 100) * chartW;
      const y = toY(p.elevation);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <h3 className="mb-4 font-serif text-lg text-accent">
        Przekrój topograficzny działki (W → E)
      </h3>
      <svg
        viewBox={`0 0 ${chartW + padding.left + padding.right} ${chartH + padding.top + padding.bottom}`}
        className="h-full w-full max-h-[400px] max-w-[600px]"
        role="img"
        aria-label="Przekrój topograficzny terenu"
      >
        {/* Ground fill */}
        <polygon
          points={`${padding.left},${padding.top + chartH} ${pathPoints.split(" ").map((p) => p).join(" ")} ${padding.left + chartW},${padding.top + chartH}`}
          fill="#c5d5c0"
          opacity={0.4}
        />

        {/* Terrain line */}
        <polyline
          points={pathPoints}
          fill="none"
          stroke="#2d5016"
          strokeWidth={3}
        />

        {/* Building marker at center */}
        <rect
          x={padding.left + chartW * 0.42}
          y={toY(plotData.elevation.reference) - 25}
          width={chartW * 0.16}
          height={25}
          fill="#d4c5b0"
          stroke="#2d5016"
          strokeWidth={1.5}
        />
        <text
          x={padding.left + chartW * 0.5}
          y={toY(plotData.elevation.reference) - 30}
          textAnchor="middle"
          className="fill-accent text-[10px] font-medium"
        >
          Budynek ±0,00
        </text>

        {/* Points */}
        {points.map((p) => {
          const x = padding.left + (p.x / 100) * chartW;
          const y = toY(p.elevation);
          return (
            <g key={p.label}>
              <circle cx={x} cy={y} r={4} fill="#2d5016" />
              <text x={x} y={y - 10} textAnchor="middle" className="fill-text text-[9px]">
                {p.elevation.toFixed(2)} m
              </text>
              <text
                x={x}
                y={padding.top + chartH + 20}
                textAnchor="middle"
                className="fill-text-muted text-[8px]"
              >
                {p.label}
              </text>
            </g>
          );
        })}

        {/* Y axis labels */}
        {[366, 367, 368, 369, 370].map((elev) => (
          <text
            key={elev}
            x={padding.left - 8}
            y={toY(elev) + 4}
            textAnchor="end"
            className="fill-text-muted text-[8px]"
          >
            {elev} m
          </text>
        ))}

        <text
          x={padding.left + chartW / 2}
          y={padding.top + chartH + 45}
          textAnchor="middle"
          className="fill-text-muted text-[10px]"
        >
          NMT GUGiK: różnica wysokości ~{(plotData.elevation.maxSE - plotData.elevation.minNW).toFixed(1)} m
        </text>
      </svg>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-2 text-xs md:grid-cols-3">
        <div className="rounded-lg border border-border bg-bg-panel p-3">
          <p className="font-medium text-accent">Źródło</p>
          <p className="mt-1 text-text-muted">{kartaTechniczna.terrainModel.source}</p>
        </div>
        <div className="rounded-lg border border-border bg-bg-panel p-3">
          <p className="font-medium text-accent">Spadki</p>
          <p className="mt-1 text-text-muted">
            W–E ~{kartaTechniczna.elevation.slopeWE_percent}% · N–S ~{kartaTechniczna.elevation.slopeNS_percent}%
          </p>
        </div>
        <div className="rounded-lg border border-border bg-bg-panel p-3">
          <p className="font-medium text-accent">Ryzyko</p>
          <p className="mt-1 text-text-muted">NMT ≠ mapa do celów projektowych. Rzędne potwierdzi geodeta.</p>
        </div>
      </div>
    </div>
  );
}
