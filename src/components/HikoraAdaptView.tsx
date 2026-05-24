"use client";

import { FloorPlanSVG } from "./FloorPlanSVG";
import { hikoraAdaptMeta } from "@/data/rooms-hikora-adapt";
import { buildingEnlarged } from "@/data/karta-techniczna";
import type { Room } from "@/types/project";

interface HikoraAdaptViewProps {
  parterRooms: Room[];
  pietroRooms: Room[];
  onRoomClick?: (roomId: string, floor: "parter" | "pietro") => void;
  highlightedRoom?: string | null;
  highlightFloor?: "parter" | "pietro";
}

export function HikoraAdaptView({
  parterRooms,
  pietroRooms,
  onRoomClick,
  highlightedRoom,
  highlightFloor = "parter",
}: HikoraAdaptViewProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <div className="shrink-0 rounded-lg border border-accent/30 bg-accent/5 p-3">
        <h3 className="font-serif text-base text-accent">{hikoraAdaptMeta.name}</h3>
        <p className="mt-1 text-xs text-text-muted">
          Bryła {hikoraAdaptMeta.footprint} · inspiracja ARCHON+ Dom pod hikorą 3
        </p>
        <ul className="mt-2 flex flex-wrap gap-1">
          {hikoraAdaptMeta.highlights.map((h) => (
            <li
              key={h}
              className="rounded-full bg-bg px-2 py-0.5 text-[10px] text-text-muted"
            >
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col rounded-lg border border-border bg-bg-panel p-2">
          <p className="mb-2 shrink-0 text-center text-xs font-medium text-accent">
            Parter — strefa dzienna
          </p>
          <div className="min-h-0 flex-1">
            <FloorPlanSVG
              floor="parter"
              roomsOverride={parterRooms}
              buildingWidthWE={buildingEnlarged.widthWE}
              buildingLengthNS={buildingEnlarged.lengthNS}
              highlightedRoom={highlightFloor === "parter" ? highlightedRoom : null}
              showHstMarker
              onRoomClick={(id) => onRoomClick?.(id, "parter")}
            />
          </div>
        </div>

        <div className="flex min-h-0 flex-col rounded-lg border border-border bg-bg-panel p-2">
          <p className="mb-2 shrink-0 text-center text-xs font-medium text-accent">
            Piętro — strefa nocna
          </p>
          <div className="min-h-0 flex-1">
            <FloorPlanSVG
              floor="pietro"
              roomsOverride={pietroRooms}
              buildingWidthWE={buildingEnlarged.widthWE}
              buildingLengthNS={buildingEnlarged.lengthNS}
              highlightedRoom={highlightFloor === "pietro" ? highlightedRoom : null}
              onRoomClick={(id) => onRoomClick?.(id, "pietro")}
            />
          </div>
        </div>
      </div>

      <p className="shrink-0 text-center text-[10px] text-text-muted">
        🔒 Działka i strony świata stałe · Z=dojazd od ul. Północnej · Wschód=ogród · Salon patrzy na otwarcie działki
      </p>
    </div>
  );
}
