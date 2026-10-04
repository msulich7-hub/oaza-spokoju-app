"use client";

import { FloorPlanSVG } from "./FloorPlanSVG";
import { PlotMapView } from "./PlotMapView";
import { SatelliteMapView } from "./SatelliteMapView";
import { TopographyView } from "./TopographyView";
import { HikoraAdaptView } from "./HikoraAdaptView";
import { VisualizationCoach } from "./VisualizationCoach";
import { Plot3DView } from "./Plot3DView";
import type { Room, Setbacks, VisualizationState } from "@/types/project";

interface VisualizationPanelProps {
  visualization: VisualizationState;
  onRoomClick?: (roomId: string) => void;
  onShowFloorPlan?: (floor: "parter" | "pietro") => void;
  onShowPlotMap?: () => void;
  onShowTopography?: () => void;
  onShowSatellite?: () => void;
  onShow3D?: () => void;
  setbacks?: Setbacks;
  roomsForFloor?: Room[];
  hikoraParterRooms?: Room[];
  hikoraPietroRooms?: Room[];
  isHikoraAdapt?: boolean;
  variantLabel?: string;
  buildingWidthWE?: number;
  buildingLengthNS?: number;
}

const viewLabels: Record<VisualizationState["type"], string> = {
  floorplan: "Rzut piętra",
  plotmap: "Mapa działki",
  topography: "Topografia",
  satellite: "Zdjęcie satelitarne",
  "3dview": "Działka 3D",
};

export function VisualizationPanel({
  visualization,
  onRoomClick,
  onShowFloorPlan,
  onShowPlotMap,
  onShowTopography,
  onShowSatellite,
  onShow3D,
  setbacks,
  roomsForFloor,
  hikoraParterRooms,
  hikoraPietroRooms,
  isHikoraAdapt,
  variantLabel,
  buildingWidthWE,
  buildingLengthNS,
}: VisualizationPanelProps) {
  const floor = visualization.floor ?? "parter";
  const showHikoraDual =
    isHikoraAdapt &&
    visualization.type === "floorplan" &&
    hikoraParterRooms &&
    hikoraPietroRooms;

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-serif text-lg text-accent">
          {showHikoraDual
            ? "Adaptacja Hikora — rzuty parter + piętro"
            : viewLabels[visualization.type]}
          {!showHikoraDual &&
            visualization.type === "floorplan" &&
            ` — ${floor === "parter" ? "Parter" : "Piętro"}`}
        </h2>
        <div className="flex flex-wrap gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => onShowFloorPlan?.("parter")}
            className="rounded-md border border-border px-2 py-1 text-xs text-text"
          >
            Parter
          </button>
          <button
            type="button"
            onClick={() => onShowPlotMap?.()}
            className="rounded-md border border-border px-2 py-1 text-xs text-text"
          >
            Mapa
          </button>
          <button
            type="button"
            onClick={() => onShowSatellite?.()}
            className="rounded-md border border-border px-2 py-1 text-xs text-text"
          >
            Satelita
          </button>
          <button
            type="button"
            onClick={() => onShow3D?.()}
            className="rounded-md border border-border px-2 py-1 text-xs text-text"
          >
            3D
          </button>
        </div>
        {visualization.highlightedRoom && (
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
            Podświetlono: {visualization.highlightedRoom}
          </span>
        )}
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col ${
          visualization.type === "3dview"
            ? "overflow-hidden p-3"
            : "items-center justify-center overflow-auto p-4"
        }`}
      >
        {showHikoraDual && (
          <HikoraAdaptView
            parterRooms={hikoraParterRooms}
            pietroRooms={hikoraPietroRooms}
            highlightedRoom={visualization.highlightedRoom}
            highlightFloor={floor}
            onRoomClick={(roomId, fl) => {
              onShowFloorPlan?.(fl);
              onRoomClick?.(roomId);
            }}
          />
        )}
        {!showHikoraDual && visualization.type === "floorplan" && (
          <FloorPlanSVG
            floor={floor}
            highlightedRoom={visualization.highlightedRoom}
            onRoomClick={onRoomClick}
            roomsOverride={roomsForFloor}
            variantLabel={variantLabel}
            buildingWidthWE={buildingWidthWE}
            buildingLengthNS={buildingLengthNS}
            showHstMarker={floor === "parter"}
          />
        )}
        {visualization.type === "plotmap" && (
          <PlotMapView
            setbacks={setbacks}
            variantLabel={variantLabel}
            buildingWidthWE={buildingWidthWE}
            buildingLengthNS={buildingLengthNS}
          />
        )}
        {visualization.type === "satellite" && (
          <SatelliteMapView
            setbacks={setbacks}
            variantLabel={variantLabel}
            buildingWidthWE={buildingWidthWE}
            buildingLengthNS={buildingLengthNS}
          />
        )}
        {visualization.type === "topography" && <TopographyView />}
        {visualization.type === "3dview" && (
          <Plot3DView
            variantLabel={variantLabel}
            buildingWidthWE={buildingWidthWE}
            buildingLengthNS={buildingLengthNS}
          />
        )}
        <VisualizationCoach visualization={visualization} variantLabel={variantLabel} />
      </div>
    </div>
  );
}
