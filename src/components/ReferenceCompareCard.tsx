"use client";

import type { ReferenceProject } from "@/data/reference-projects";
import { plotData } from "@/data/project-context";

interface ReferenceCompareCardProps {
  reference: ReferenceProject;
  transformLabel?: string;
}

export function ReferenceCompareCard({ reference, transformLabel }: ReferenceCompareCardProps) {
  const oazaFootprint = plotData.building.footprint;
  const oazaPlot = plotData.dimensions;

  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-2">
      <p className="text-xs font-semibold text-accent">
        {reference.provider}: {reference.name}
        {reference.mirrorAvailable && " · lustrzane odbicie dostępne w katalogu"}
      </p>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <p className="font-medium text-text">Referencja</p>
          <ul className="mt-1 space-y-0.5 text-text-muted">
            <li>{reference.areaNetM2} m² netto</li>
            <li>Garaż {reference.garageM2} m²</li>
            <li>{reference.rooms} pokoi · {reference.bathrooms} łazienki</li>
            <li>Min. działka {reference.minPlotM.width}×{reference.minPlotM.length} m</li>
            {reference.epKwhM2 && <li>EP ~{reference.epKwhM2} kWh/m²/rok</li>}
          </ul>
        </div>
        <div>
          <p className="font-medium text-text">Oaza Spokoju</p>
          <ul className="mt-1 space-y-0.5 text-text-muted">
            <li>Budynek {plotData.building.width}×{plotData.building.length} m</li>
            <li>Zabudowa ~{oazaFootprint} m²</li>
            <li>Działka {oazaPlot.lengthWE}×{oazaPlot.widthNS} m</li>
            <li>Garaż 2-stanowiskowy</li>
            <li>Pompa ciepła + rekuperacja (plan)</li>
          </ul>
        </div>
      </div>
      {transformLabel && (
        <p className="text-[10px] font-medium text-accent">
          Zastosowana transformacja: {transformLabel}
        </p>
      )}
      <ul className="space-y-1 border-t border-border pt-2">
        {reference.vsOaza.map((line) => (
          <li key={line} className="text-[10px] text-text-muted before:content-['→_']">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
