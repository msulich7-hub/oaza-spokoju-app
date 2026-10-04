"use client";

import dynamic from "next/dynamic";
import { kartaTechniczna } from "@/data/karta-techniczna";
import { BUILDING_NS, BUILDING_WE, GESUT, PLOT_NS, PLOT_WE, SETBACKS } from "@/lib/plot-3d-layout";

const Plot3DScene = dynamic(
  () => import("./Plot3DScene").then((mod) => mod.Plot3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[420px] w-full items-center justify-center text-sm text-text-muted">
        Ładowanie widoku 3D działki…
      </div>
    ),
  },
);

interface Plot3DViewProps {
  variantLabel?: string;
  buildingWidthWE?: number;
  buildingLengthNS?: number;
}

export function Plot3DView({
  variantLabel,
  buildingWidthWE = BUILDING_WE,
  buildingLengthNS = BUILDING_NS,
}: Plot3DViewProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <div className="relative min-h-[460px] w-full flex-1 overflow-hidden rounded-2xl border border-border bg-[#e7e2d6] shadow-inner">
        <Plot3DScene />
        <div className="pointer-events-none absolute left-3 top-3 max-w-xs rounded-xl border border-white/60 bg-bg/90 p-3 text-xs shadow backdrop-blur">
          <p className="font-medium text-accent">Działka {kartaTechniczna.plot.id} · widok 3D</p>
          <p className="mt-1 text-text-muted">
            {PLOT_WE} × {PLOT_NS} m · bryła {buildingWidthWE} × {buildingLengthNS} m
          </p>
          <p className="mt-1 text-text-muted">
            Odsunięcia: Z {SETBACKS.west} · P {SETBACKS.north} · Poł {SETBACKS.south} · E {SETBACKS.east} m
          </p>
          <p className="mt-1 text-text-muted">
            Dach {kartaTechniczna.building.roofAngle}° dwuspadowy, kalenica {kartaTechniczna.building.kalenicaAxis}
          </p>
          {variantLabel && <p className="mt-1 text-text-muted">Wariant: {variantLabel}</p>}
          <p className="mt-2 text-[10px] leading-snug text-text-muted">
            Przeciągnij, aby obrócić kamerę. Światło poranne od wschodu. Sieci: {GESUT.source}, {GESUT.capturedAt}.
          </p>
        </div>
      </div>
      <p className="text-[11px] leading-relaxed text-text-muted">
        {GESUT.accuracyNote} {GESUT.gas.note} {GESUT.telecom.note}
      </p>
    </div>
  );
}
