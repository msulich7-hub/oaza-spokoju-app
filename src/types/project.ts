export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PlotDimensions {
  lengthWE: number;  // meters, west-east axis
  widthNS: number;   // meters, north-south axis
  area: number;      // m²
}

export interface Elevation {
  reference: number;  // ±0.00 in m n.p.m.
  west: number;
  east: number;
  minNW: number;
  maxSE: number;
}

export interface Setbacks {
  west: number;   // from road
  north: number;  // from dz. 4/4
  south: number;  // from dz. 4/6
  east: number;   // garden
}

export interface Building {
  width: number;
  length: number;
  footprint: number;
  floors: number;
  roofAngle: number;
  roofType: string;
  setbacks: Setbacks;
}

export interface Room {
  id: string;
  name: string;
  namePL: string;
  floor: "parter" | "pietro";
  x: number;       // position in floor plan (meters from SW corner)
  y: number;
  width: number;   // meters
  height: number;  // meters
  orientation: "N" | "S" | "E" | "W" | "NE" | "NW" | "SE" | "SW" | "C";
  description?: string;
  color?: string;
}

export interface Neighbor {
  plot?: string;
  description: string;
}

export interface PlotData {
  id: string;
  location: {
    city: string;
    street: string;
    voivodeship: string;
    coordinates: Coordinates;
  };
  dimensions: PlotDimensions;
  zoning: {
    mpzp: string;
    landClass: string;
  };
  elevation: Elevation;
  building: Building;
  neighbors: {
    north: Neighbor;
    south: Neighbor;
    east: Neighbor;
    west: Neighbor;
  };
}

export interface FloorPlanState {
  floor: "parter" | "pietro";
  highlightedRoom: string | null;
  showDimensions: boolean;
  showGrid: boolean;
  scale: number; // 1:50 default
}

export interface VisualizationState {
  type: "floorplan" | "plotmap" | "topography" | "satellite" | "3dview";
  floor?: "parter" | "pietro";
  highlightedRoom?: string;
}
