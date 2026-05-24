"use client";

import { useState } from "react";
import { immutablePlotData } from "@/lib/plot-constraints";
import { IMMUTABLE_FIELDS, MUTABLE_FIELDS } from "@/lib/plot-constraints";
import { kartaTechniczna } from "@/data/karta-techniczna";
import type { BuildingSize } from "@/types/variant";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  locked?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  locked = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-accent/5"
      >
        <span className="flex items-center gap-1.5 text-sm font-medium text-accent">
          {locked && <span title="Dane twarde — niezmienne">🔒</span>}
          {title}
        </span>
        <span className="text-text-muted">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="space-y-2 px-4 pb-4 text-sm">{children}</div>}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-text-muted">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

interface InfoPanelProps {
  buildingSize?: BuildingSize;
  setbacks?: {
    west: number;
    north: number;
    south: number;
    east: number;
  };
  variantName?: string;
}

export function InfoPanel({ buildingSize, setbacks, variantName }: InfoPanelProps) {
  const plot = immutablePlotData;
  const { dimensions, elevation, neighbors, location, zoning } = plot;
  const b = buildingSize ?? {
    widthWE: plot.building.width,
    lengthNS: plot.building.length,
  };
  const s = setbacks ?? plot.building.setbacks;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto border-l border-border bg-bg-panel">
      <div className="border-b border-border px-4 py-3">
        <h2 className="font-serif text-lg text-accent">Dane projektu</h2>
        <p className="text-xs text-text-muted">
          {location.city}, {location.street} · dz. {plot.id}
        </p>
        {variantName && (
          <p className="mt-1 text-[10px] text-accent">Wariant: {variantName}</p>
        )}
      </div>

      <div className="border-b border-border bg-accent/5 px-4 py-2 text-[10px] text-text-muted">
        <p className="font-medium text-accent">🔒 Twarde (niezmienne)</p>
        <p className="mt-0.5">Działka, strony świata, nachylenie, sąsiedztwo</p>
        <p className="mt-1 font-medium text-text">✎ Zmienne</p>
        <p>Bryła, usytuowanie, układ pomieszczeń</p>
      </div>

      <CollapsibleSection title="Działka" locked>
        <DataRow label="EGiB" value={kartaTechniczna.plot.egibId} />
        <DataRow label="Wymiary" value={`${dimensions.lengthWE} × ${dimensions.widthNS} m`} />
        <DataRow label="Powierzchnia" value={`~${dimensions.area} m²`} />
        <DataRow label="MPZP" value={zoning.mpzp} />
        <DataRow label="Klasa gruntu" value={zoning.landClass} />
        <DataRow label="Zachód" value="Droga ul. Północna" />
        <DataRow label="Wschód" value="Dz. 25/27, 25/20, 25/18" />
      </CollapsibleSection>

      <CollapsibleSection title="Budynek (wariant)">
        <DataRow label="Wymiary" value={`${b.widthWE} × ${b.lengthNS} m`} />
        <DataRow label="Pow. zabudowy" value={`${Math.round(b.widthWE * b.lengthNS * 100) / 100} m²`} />
        <DataRow label="Piętra" value={plot.building.floors} />
        <DataRow label="Dach" value={`${plot.building.roofType}, ${plot.building.roofAngle}°`} />
        <DataRow label="±0,00" value={`${elevation.reference} m n.p.m.`} />
      </CollapsibleSection>

      <CollapsibleSection title="Odległości od granic">
        <DataRow label="Zachód (droga)" value={`${s.west} m`} />
        <DataRow label="Północ (dz. 4/4, 48R)" value={`${s.north} m (min. 4 m)`} />
        <DataRow label="Południe (dz. 4/6)" value={`${s.south} m (min. 4 m)`} />
        <DataRow label="Wschód (las)" value={`${s.east} m`} />
      </CollapsibleSection>

      <CollapsibleSection title="Topografia" defaultOpen={false} locked>
        <DataRow label="Spadek W→E" value="~6,9%" />
        <DataRow label="Spadek N→S" value="~8,5%" />
        <DataRow label="Wjazd (Z)" value={`${elevation.west} m`} />
        <DataRow label="Min NW" value={`${elevation.minNW} m`} />
        <DataRow label="Ogród (E)" value={`${elevation.east} m`} />
        <DataRow label="Max SE" value={`${elevation.maxSE} m`} />
      </CollapsibleSection>

      <CollapsibleSection title="Przyłącza" defaultOpen={false} locked>
        <DataRow label="Woda + kanalizacja" value="Z północy" />
        <DataRow label="Prąd + gaz" value="Z zachodu" />
        <DataRow label="Telekomunikacja" value="Z NE" />
      </CollapsibleSection>

      <CollapsibleSection title="Sąsiedztwo" defaultOpen={false} locked>
        <DataRow label="Północ" value={neighbors.north.description} />
        <DataRow label="Południe" value={neighbors.south.description} />
        <DataRow label="Wschód" value={neighbors.east.description} />
        <DataRow label="Zachód" value={neighbors.west.description} />
      </CollapsibleSection>

      <details className="border-b border-border px-4 py-3 text-[10px] text-text-muted">
        <summary className="cursor-pointer font-medium text-accent">Pełna lista reguł</summary>
        <p className="mt-2 font-medium text-text">Niezmienne:</p>
        <ul className="mt-1 space-y-0.5">
          {IMMUTABLE_FIELDS.map((f) => (
            <li key={f}>🔒 {f}</li>
          ))}
        </ul>
        <p className="mt-2 font-medium text-text">Zmienne:</p>
        <ul className="mt-1 space-y-0.5">
          {MUTABLE_FIELDS.map((f) => (
            <li key={f}>✎ {f}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
