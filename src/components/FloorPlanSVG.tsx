"use client";

import { useId } from "react";
import { parterRooms, pietroRooms } from "@/data/rooms";
import type { Room } from "@/types/project";

const SCALE = 40;

interface FloorPlanSVGProps {
  floor: "parter" | "pietro";
  highlightedRoom?: string | null;
  showDimensions?: boolean;
  showGrid?: boolean;
  onRoomClick?: (roomId: string) => void;
  roomsOverride?: Room[];
  variantLabel?: string;
  buildingWidthWE?: number;
  buildingLengthNS?: number;
  showHstMarker?: boolean;
}

export function FloorPlanSVG({
  floor,
  highlightedRoom = null,
  showDimensions = true,
  showGrid = true,
  onRoomClick,
  roomsOverride,
  variantLabel,
  buildingWidthWE = 14.0,
  buildingLengthNS = 10.84,
  showHstMarker = false,
}: FloorPlanSVGProps) {
  const gridId = useId().replace(/:/g, "");
  const defaultRooms = floor === "parter" ? parterRooms : pietroRooms;
  const rooms = roomsOverride ?? defaultRooms;
  const width = buildingWidthWE * SCALE;
  const height = buildingLengthNS * SCALE;
  const padding = 60;
  const totalArea = Math.round(
    rooms.reduce((sum, room) => sum + room.width * room.height, 0) * 10,
  ) / 10;

  // Data coords: origin SW, Y grows north. SVG: origin top-left.
  const roomToSvg = (room: Room) => ({
    x: room.x * SCALE,
    y: height - (room.y + room.height) * SCALE,
    w: room.width * SCALE,
    h: room.height * SCALE,
  });

  return (
    <svg
      viewBox={`${-padding} ${-padding} ${width + padding * 2} ${height + padding * 2}`}
      className="h-full w-full max-h-[600px]"
      role="img"
      aria-label={`Rzut ${floor === "parter" ? "parteru" : "piętra"}`}
    >
      <defs>
        <pattern id={gridId} width={SCALE} height={SCALE} patternUnits="userSpaceOnUse">
          <path
            d={`M ${SCALE} 0 L 0 0 0 ${SCALE}`}
            fill="none"
            stroke="#e0d8cf"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {showGrid && (
        <rect x={0} y={0} width={width} height={height} fill={`url(#${gridId})`} />
      )}

      {/* Building outline */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="#faf7f3"
        stroke="#2d5016"
        strokeWidth={2}
      />

      {/* Immediate exterior context */}
      {floor === "parter" && (
        <>
          <rect x={-42} y={0} width={28} height={height} fill="#d8d0c8" opacity={0.65} />
          <text x={-28} y={height / 2} textAnchor="middle" className="fill-text-muted text-[8px]" transform={`rotate(-90, -28, ${height / 2})`}>
            dojazd / zachód
          </text>
          <rect x={width + 14} y={0} width={28} height={height} fill="#c5d5c0" opacity={0.75} />
          <text x={width + 28} y={height / 2} textAnchor="middle" className="fill-accent text-[8px]" transform={`rotate(90, ${width + 28}, ${height / 2})`}>
            ogród / wschód
          </text>
        </>
      )}

      {/* Orientation labels */}
      <text x={width / 2} y={-20} textAnchor="middle" className="fill-accent text-xs font-medium">
        PÓŁNOC ↑
      </text>
      <text x={width / 2} y={height + 35} textAnchor="middle" className="fill-text-muted text-xs">
        POŁUDNIE
      </text>
      <text x={-25} y={height / 2} textAnchor="middle" className="fill-text-muted text-xs" transform={`rotate(-90, -25, ${height / 2})`}>
        ZACHÓD
      </text>
      <text x={width + 25} y={height / 2} textAnchor="middle" className="fill-text-muted text-xs" transform={`rotate(90, ${width + 25}, ${height / 2})`}>
        WSCHÓD
      </text>

      {rooms.map((room) => {
        const { x, y, w, h } = roomToSvg(room);
        const isHighlighted = highlightedRoom === room.id;
        const isSalonHst = showHstMarker && room.id === "salon";

        return (
          <g key={room.id}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={room.color ?? "#e8dfd4"}
              stroke={isSalonHst ? "#2d5016" : isHighlighted ? "#2d5016" : "#c8beb2"}
              strokeWidth={isSalonHst || isHighlighted ? 3 : 1}
              className={onRoomClick ? "cursor-pointer transition-all hover:opacity-80" : ""}
              onClick={() => onRoomClick?.(room.id)}
            />
            {isSalonHst && (
              <>
                <rect
                  x={x + w - 8}
                  y={y + 4}
                  width={6}
                  height={h - 8}
                  fill="#87CEEB"
                  fillOpacity={0.55}
                  stroke="#2d5016"
                  strokeWidth={1}
                />
                <text
                  x={x + w + 12}
                  y={y + h / 2}
                  className="fill-accent text-[9px] font-bold"
                >
                  HST → las
                </text>
              </>
            )}
            <text
              x={x + w / 2}
              y={y + h / 2 - 6}
              textAnchor="middle"
              className="fill-text pointer-events-none text-[10px] font-medium"
            >
              {room.namePL}
            </text>
            {showDimensions && (
              <text
                x={x + w / 2}
                y={y + h / 2 + 8}
                textAnchor="middle"
                className="fill-text-muted pointer-events-none text-[8px]"
              >
                {Math.round(room.width * room.height * 10) / 10} m² · {room.width.toFixed(1)} × {room.height.toFixed(1)}
              </text>
            )}
          </g>
        );
      })}

      <text
        x={width / 2}
        y={height + 55}
        textAnchor="middle"
        className="fill-text-muted text-[10px]"
      >
        Skala 1:50 · Budynek {buildingWidthWE} × {buildingLengthNS} m
        {` · Pomieszczenia: ~${totalArea} m²`}
        {variantLabel ? ` · ${variantLabel}` : ""}
      </text>
    </svg>
  );
}
