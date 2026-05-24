"use client";

import { kartaTechniczna } from "@/data/karta-techniczna";
import type { VisualizationState } from "@/types/project";

interface VisualizationCoachProps {
  visualization: VisualizationState;
  variantLabel?: string;
}

const viewCopy: Record<VisualizationState["type"], { title: string; points: string[] }> = {
  floorplan: {
    title: "Czytaj rzut jak scenariusz dnia",
    points: ["Wejście → kuchnia → salon → taras", "HST i oś widokowa na wschód", "Schowki przy realnych trasach domowników"],
  },
  plotmap: {
    title: "Twarde dane działki",
    points: ["EGiB 240301_1.0002.4/5", "Z: 4/10, P: 4/4, Poł: 4/6", "Minimum 4 m od północy i południa"],
  },
  satellite: {
    title: "Satelita to kontekst, nie mapa projektowa",
    points: ["Kadr potwierdza działkę i otoczenie", "Nakładka bryły jest projektowa", "Granice doskalować po wyrysie/SIP"],
  },
  topography: {
    title: "Teren i woda",
    points: ["NMT: 366,8-369,8 m n.p.m.", "Teren rośnie NW→SE", "Projekt drenażu po mapie 1:500"],
  },
  "3dview": {
    title: "Docelowa wizualizacja 3D",
    points: ["Bryła + cień + materiał", "Widok od wjazdu i ogrodu", "Porównanie wariantów obok siebie"],
  },
};

export function VisualizationCoach({ visualization, variantLabel }: VisualizationCoachProps) {
  const copy = viewCopy[visualization.type];

  return (
    <div className="mt-3 grid w-full max-w-5xl grid-cols-1 gap-2 text-xs lg:grid-cols-3">
      <div className="rounded-lg border border-border bg-bg-panel p-3">
        <p className="font-medium text-accent">{copy.title}</p>
        <ul className="mt-1 space-y-0.5 text-text-muted">
          {copy.points.map((point) => (
            <li key={point}>• {point}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-border bg-bg-panel p-3">
        <p className="font-medium text-accent">Aktualny wariant</p>
        <p className="mt-1 text-text-muted">{variantLabel ?? "Baseline / Oaza Spokoju"}</p>
        <p className="mt-1 text-text-muted">
          Centroid: {kartaTechniczna.plot.coordinates.lat}, {kartaTechniczna.plot.coordinates.lng}
        </p>
      </div>
      <div className="rounded-lg border border-border bg-bg-panel p-3">
        <p className="font-medium text-accent">Następny dowód</p>
        <p className="mt-1 text-text-muted">
          Mapa do celów projektowych + 2-3 odwierty geotechniczne przed decyzją o posadowieniu.
        </p>
      </div>
    </div>
  );
}
