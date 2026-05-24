"use client";

import { useState, useCallback } from "react";
import type { FloorPlanState, VisualizationState } from "@/types/project";

const defaultFloorPlan: FloorPlanState = {
  floor: "parter",
  highlightedRoom: null,
  showDimensions: true,
  showGrid: true,
  scale: 50,
};

const defaultVisualization: VisualizationState = {
  type: "floorplan",
  floor: "parter",
};

export function useFloorPlan() {
  const [floorPlan, setFloorPlan] = useState<FloorPlanState>(defaultFloorPlan);
  const [visualization, setVisualization] =
    useState<VisualizationState>(defaultVisualization);

  const showFloorPlan = useCallback((floor: "parter" | "pietro") => {
    setFloorPlan((prev) => ({ ...prev, floor, highlightedRoom: null }));
    setVisualization({ type: "floorplan", floor });
  }, []);

  const showPlotMap = useCallback(() => {
    setVisualization({ type: "plotmap" });
  }, []);

  const showTopography = useCallback(() => {
    setVisualization({ type: "topography" });
  }, []);

  const showSatellite = useCallback(() => {
    setVisualization({ type: "satellite" });
  }, []);

  const show3D = useCallback(() => {
    setVisualization({ type: "3dview" });
  }, []);

  const highlightRoom = useCallback((roomId: string, floor?: "parter" | "pietro") => {
    const targetFloor = floor ?? floorPlan.floor;
    setFloorPlan((prev) => ({
      ...prev,
      floor: targetFloor,
      highlightedRoom: roomId,
    }));
    setVisualization({ type: "floorplan", floor: targetFloor, highlightedRoom: roomId });
  }, [floorPlan.floor]);

  return {
    floorPlan,
    visualization,
    showFloorPlan,
    showPlotMap,
    showTopography,
    showSatellite,
    show3D,
    highlightRoom,
    setFloorPlan,
    setVisualization,
  };
}
