"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Billboard, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import {
  BUILDING_EAST_X,
  BUILDING_NS,
  BUILDING_SOUTH_Z,
  BUILDING_WE,
  BUILDING_X,
  BUILDING_Z,
  FLOORS,
  GARDEN,
  GESUT,
  GESUT_OFFSET_PREVIEW_M,
  PLOT_NS,
  PLOT_WE,
  PREVIEW_STOREY_M,
  SETBACKS,
  TERRACE_EAST_X,
  TERRACE_SOUTH_DEPTH_M,
  buildingFloorY,
  fruitTreePositions,
  heightAt,
  isEastSewerCorridor,
  isNorthUtilityStrip,
  isWetNorthwest,
  roofRiseM,
} from "@/lib/plot-3d-layout";

const GROUND_COLOR = {
  lawn: new THREE.Color("#4f7a32"),
  grass: new THREE.Color("#6a7d38"),
  meadow: new THREE.Color("#3d5c28"),
  wet: new THREE.Color("#2f4030"),
  drive: new THREE.Color("#9a8d78"),
  sewer: new THREE.Color("#6a5340"),
};

function terrainVertexColor(x: number, z: number): THREE.Color {
  if (isWetNorthwest(x, z)) return GROUND_COLOR.wet;
  if (x < SETBACKS.west && z > 3) return GROUND_COLOR.drive;
  if (isEastSewerCorridor(x)) return GROUND_COLOR.sewer;
  if (x >= TERRACE_EAST_X && x < TERRACE_EAST_X + 5) return GROUND_COLOR.lawn;
  if (x >= TERRACE_EAST_X + 5 && x < PLOT_WE - 5) return GROUND_COLOR.grass;
  if (x >= PLOT_WE - 8) return GROUND_COLOR.meadow;
  return GROUND_COLOR.lawn;
}

function TerrainMesh() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(PLOT_WE, PLOT_NS, 48, 24);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < pos.count; i += 1) {
      const x = pos.getX(i) + PLOT_WE / 2;
      const z = pos.getZ(i) + PLOT_NS / 2;
      pos.setY(i, heightAt(x, z));
      color.copy(terrainVertexColor(x, z));
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} position={[PLOT_WE / 2, 0, PLOT_NS / 2]} receiveShadow>
      <meshLambertMaterial vertexColors />
    </mesh>
  );
}

function createGableRoofGeometry(): THREE.BufferGeometry {
  const w = BUILDING_WE + 0.4;
  const d = BUILDING_NS + 0.4;
  const h = roofRiseM();
  const half = d / 2;
  const geo = new THREE.BufferGeometry();
  const verts = new Float32Array([
    0, 0, 0, w, 0, 0, w, h, half,
    0, 0, 0, w, h, half, 0, h, half,
    0, 0, d, w, h, half, w, 0, d,
    0, 0, d, 0, h, half, w, h, half,
    0, 0, 0, 0, h, half, 0, 0, d,
    w, 0, 0, w, 0, d, w, h, half,
  ]);
  geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

function House() {
  const floorY = buildingFloorY();
  const wallH = FLOORS * PREVIEW_STOREY_M;
  const roofGeo = useMemo(() => createGableRoofGeometry(), []);

  return (
    <group position={[BUILDING_X, 0, BUILDING_Z]}>
      <mesh position={[BUILDING_WE / 2, floorY + wallH / 2, BUILDING_NS / 2]} castShadow receiveShadow>
        <boxGeometry args={[BUILDING_WE, wallH, BUILDING_NS]} />
        <meshStandardMaterial color="#d4c5b0" roughness={0.78} />
      </mesh>
      <mesh position={[BUILDING_WE - 0.06, floorY + 1.6, BUILDING_NS / 2]} castShadow>
        <boxGeometry args={[0.08, 2.6, 6.4]} />
        <meshStandardMaterial color="#8fb6c8" metalness={0.35} roughness={0.15} transparent opacity={0.72} />
      </mesh>
      <mesh position={[BUILDING_WE / 2, floorY + 1.4, BUILDING_NS - 0.05]}>
        <boxGeometry args={[5.2, 1.8, 0.08]} />
        <meshStandardMaterial color="#9bb8a0" metalness={0.2} roughness={0.2} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.08, floorY + 1.1, BUILDING_NS / 2]}>
        <boxGeometry args={[0.1, 2.2, 4.2]} />
        <meshStandardMaterial color="#6b6560" roughness={0.6} />
      </mesh>
      <mesh
        geometry={roofGeo}
        position={[-0.2, floorY + wallH, -0.2]}
        castShadow
      >
        <meshStandardMaterial color="#2d3136" roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Terrace() {
  const y = buildingFloorY() - 0.12;
  const eastW = GARDEN.terraceEastFromWallApproxM;
  const eastD = BUILDING_NS;
  const southW = BUILDING_WE + eastW;
  const southD = TERRACE_SOUTH_DEPTH_M;

  return (
    <group>
      <mesh
        position={[BUILDING_EAST_X + eastW / 2, y, BUILDING_Z + eastD / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[eastW, 0.18, eastD]} />
        <meshStandardMaterial color="#c69b6b" roughness={0.7} />
      </mesh>
      <mesh
        position={[BUILDING_X + southW / 2, y, BUILDING_SOUTH_Z + southD / 2]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[southW, 0.18, southD]} />
        <meshStandardMaterial color="#c69b6b" roughness={0.7} />
      </mesh>
    </group>
  );
}

function FruitTree({
  x,
  z,
  kind,
}: {
  x: number;
  z: number;
  kind: "jablon" | "grusza";
}) {
  const y = heightAt(x, z);
  const apple = kind === "jablon";
  const canopyR = apple ? 1.15 : 0.95;
  const canopyH = apple ? 1.7 : 2.15;
  const label = apple ? "Jabłoń" : "Grusza";

  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 1.4, 8]} />
        <meshStandardMaterial color="#6b4f32" roughness={0.9} />
      </mesh>
      <mesh position={[0, apple ? 1.85 : 2.1, 0]} castShadow>
        <sphereGeometry args={[canopyR, 12, 10]} />
        <meshStandardMaterial color={apple ? "#4f7a2e" : "#5d8a38"} roughness={0.85} />
      </mesh>
      {!apple && (
        <mesh position={[0, 2.1 + canopyH * 0.15, 0]} castShadow>
          <sphereGeometry args={[canopyR * 0.72, 10, 8]} />
          <meshStandardMaterial color="#67943d" roughness={0.85} />
        </mesh>
      )}
      <Billboard position={[0, apple ? 3.2 : 3.5, 0]}>
        <Text fontSize={0.38} color="#2d5016" anchorX="center" anchorY="middle" outlineWidth={0.012} outlineColor="#f5f0eb">
          {label}
        </Text>
      </Billboard>
    </group>
  );
}

function GrassClumps() {
  const clumps = useMemo(() => {
    const items: Array<{ x: number; z: number; h: number }> = [];
    for (let i = 0; i < 110; i += 1) {
      const x = TERRACE_EAST_X + 5.2 + ((i * 17) % 37) * 0.12;
      const z = 5.2 + ((i * 13) % 41) * 0.28;
      if (x >= PLOT_WE - GESUT.sewer.westOfEastBoundaryM.max) continue;
      if (isNorthUtilityStrip(z) || isWetNorthwest(x, z)) continue;
      if (z > PLOT_NS - 1.2) continue;
      items.push({ x, z, h: 0.45 + (i % 5) * 0.08 });
    }
    return items;
  }, []);

  return (
    <group>
      {clumps.map((clump) => (
        <mesh key={`${clump.x}-${clump.z}`} position={[clump.x, heightAt(clump.x, clump.z) + clump.h / 2, clump.z]} castShadow>
          <coneGeometry args={[0.12, clump.h, 5]} />
          <meshStandardMaterial color="#6f8f3c" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function NeighborBelt() {
  const trees = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      x: PLOT_WE + 2.8 + (i % 2) * 1.8,
      z: 0.8 + i * 1.7,
    }));
  }, []);

  return (
    <group>
      {trees.map((tree) => (
        <group key={`${tree.x}-${tree.z}`} position={[tree.x, 0.2, tree.z]}>
          <mesh position={[0, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 2.2, 7]} />
            <meshStandardMaterial color="#4a3a2a" />
          </mesh>
          <mesh position={[0, 3.1, 0]} castShadow>
            <sphereGeometry args={[1.35, 10, 8]} />
            <meshStandardMaterial color="#3d5a2c" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function UtilityLine({
  points,
  color,
  yLift = 0.12,
}: {
  points: Array<[number, number]>;
  color: string;
  yLift?: number;
}) {
  const geometry = useMemo(() => {
    const curvePoints = points.map(([x, z]) => {
      const onPlot = x >= 0 && x <= PLOT_WE && z >= 0 && z <= PLOT_NS;
      const y = (onPlot ? heightAt(x, z) : heightAt(THREE.MathUtils.clamp(x, 0, PLOT_WE), THREE.MathUtils.clamp(z, 0, PLOT_NS))) + yLift;
      return new THREE.Vector3(x, y, z);
    });
    const curve = new THREE.CatmullRomCurve3(curvePoints, false, "chordal");
      return new THREE.TubeGeometry(curve, 40, 0.14, 8, false);
  }, [points, yLift]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.15} />
    </mesh>
  );
}

function GesutNetworks() {
  const offset = GESUT_OFFSET_PREVIEW_M;
  const sewerNorthZ = -offset;
  const sewerEastX = PLOT_WE - offset;

  return (
    <group>
      {GESUT.water.present && (
        <UtilityLine
          color="#3d7ea6"
          yLift={0.16}
          points={[
            [0.4, 0.35],
            [PLOT_WE - 0.4, 0.35],
          ]}
        />
      )}
      {GESUT.sewer.present && (
        <UtilityLine
          color="#7a3d32"
          yLift={0.2}
          points={[
            [0.6, sewerNorthZ],
            [sewerEastX, sewerNorthZ],
            [sewerEastX, PLOT_NS - 0.8],
          ]}
        />
      )}
      {GESUT.power.present && GESUT.power.westEdge && (
        <UtilityLine
          color="#d4a017"
          yLift={0.18}
          points={[
            [-0.7, 0.4],
            [-0.7, PLOT_NS - 0.4],
          ]}
        />
      )}
      {GESUT.power.present && GESUT.power.eastOfPlot && (
        <UtilityLine
          color="#d4a017"
          yLift={0.18}
          points={[
            [PLOT_WE + 1.4, 0.4],
            [PLOT_WE + 1.4, PLOT_NS - 0.4],
          ]}
        />
      )}
    </group>
  );
}

function PlotBoundary() {
  const geometry = useMemo(() => {
    const y = 0.08;
    const pts: Array<[number, number]> = [
      [0, 0],
      [PLOT_WE, 0],
      [PLOT_WE, PLOT_NS],
      [0, PLOT_NS],
      [0, 0],
    ];
    const curve = new THREE.CatmullRomCurve3(
      pts.map(([x, z]) => new THREE.Vector3(x, heightAt(x, z) + y, z)),
      false,
      "centripetal",
    );
    return new THREE.TubeGeometry(curve, 64, 0.05, 6, false);
  }, []);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#2d5016" />
    </mesh>
  );
}

function CardinalLabels() {
  return (
    <group>
      <Billboard position={[PLOT_WE / 2, heightAt(PLOT_WE / 2, -0.2) + 1.4, -1.6]}>
        <Text fontSize={0.7} color="#2d5016" anchorX="center" outlineWidth={0.02} outlineColor="#f5f0eb">
          Północ · dz. 4/4
        </Text>
      </Billboard>
      <Billboard position={[PLOT_WE / 2, heightAt(PLOT_WE / 2, PLOT_NS) + 1.4, PLOT_NS + 1.8]}>
        <Text fontSize={0.7} color="#2d5016" anchorX="center" outlineWidth={0.02} outlineColor="#f5f0eb">
          Południe · dz. 4/6
        </Text>
      </Billboard>
      <Billboard position={[-2.4, heightAt(0, PLOT_NS / 2) + 1.6, PLOT_NS / 2]}>
        <Text fontSize={0.62} color="#2d5016" anchorX="center" outlineWidth={0.02} outlineColor="#f5f0eb">
          Zachód · ul. Północna
        </Text>
      </Billboard>
      <Billboard position={[PLOT_WE + 4.6, 2.4, PLOT_NS / 2]}>
        <Text fontSize={0.62} color="#2d5016" anchorX="center" outlineWidth={0.02} outlineColor="#f5f0eb">
          Wschód · dz. 25/xx
        </Text>
      </Billboard>
      <Billboard position={[PLOT_WE / 2, 0.9, 0.9]}>
        <Text fontSize={0.32} color="#3d7ea6" anchorX="center" outlineWidth={0.01} outlineColor="#f5f0eb">
          woda · krawędź N
        </Text>
      </Billboard>
      <Billboard position={[PLOT_WE / 2, heightAt(20, -GESUT_OFFSET_PREVIEW_M) + 0.8, -GESUT_OFFSET_PREVIEW_M]}>
        <Text fontSize={0.32} color="#7a3d32" anchorX="center" outlineWidth={0.01} outlineColor="#f5f0eb">
          kanalizacja · ok. 4–5 m na N (dz. 4/4)
        </Text>
      </Billboard>
      <Billboard position={[PLOT_WE - GESUT_OFFSET_PREVIEW_M, heightAt(PLOT_WE - GESUT_OFFSET_PREVIEW_M, 10) + 0.9, 10]}>
        <Text fontSize={0.3} color="#7a3d32" anchorX="center" outlineWidth={0.01} outlineColor="#f5f0eb">
          kanalizacja · ok. 4–5 m od E
        </Text>
      </Billboard>
      <Billboard position={[-0.7, 1.1, 4]}>
        <Text fontSize={0.3} color="#a67c00" anchorX="center" outlineWidth={0.01} outlineColor="#f5f0eb">
          prąd · zachód
        </Text>
      </Billboard>
      <Billboard position={[PLOT_WE + 1.4, 1.3, 4]}>
        <Text fontSize={0.3} color="#a67c00" anchorX="center" outlineWidth={0.01} outlineColor="#f5f0eb">
          prąd · wschód od działki
        </Text>
      </Billboard>
      <Billboard position={[2.4, heightAt(2.4, 2.4) + 0.7, 2.4]}>
        <Text fontSize={0.3} color="#3d3a36" anchorX="center" outlineWidth={0.01} outlineColor="#f5f0eb">
          mokry narożnik NW
        </Text>
      </Billboard>
      <Billboard position={[TERRACE_EAST_X - 1.2, buildingFloorY() + 0.7, BUILDING_Z + BUILDING_NS / 2]}>
        <Text fontSize={0.34} color="#4a2f18" anchorX="center" outlineWidth={0.01} outlineColor="#f5f0eb">
          taras E/S · ok. {GARDEN.terraceEastFromWallApproxM} m
        </Text>
      </Billboard>
      <Billboard position={[TERRACE_EAST_X + 3.2, heightAt(TERRACE_EAST_X + 3.2, 10) + 0.55, 16.4]}>
        <Text fontSize={0.3} color="#2d5016" anchorX="center" outlineWidth={0.01} outlineColor="#f5f0eb">
          kaskada: trawnik → trawy → wyżej
        </Text>
      </Billboard>
    </group>
  );
}

function SurroundGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[PLOT_WE / 2, -0.18, PLOT_NS / 2]} receiveShadow>
      <planeGeometry args={[90, 60]} />
      <meshLambertMaterial color="#b7b09a" />
    </mesh>
  );
}

function CascadeBands() {
  const bands = [
    { x0: TERRACE_EAST_X, x1: TERRACE_EAST_X + 4.6, color: "#5c8a3a", lift: 0.05 },
    { x0: TERRACE_EAST_X + 4.6, x1: PLOT_WE - GESUT.sewer.westOfEastBoundaryM.max, color: "#7a8640", lift: 0.1 },
    { x0: PLOT_WE - GESUT.sewer.westOfEastBoundaryM.max, x1: PLOT_WE - 0.35, color: "#3f6a2c", lift: 0.16 },
  ];
  const z0 = SETBACKS.north + 0.4;
  const z1 = PLOT_NS - 0.8;

  return (
    <group>
      {bands.map((band) => {
        const w = band.x1 - band.x0;
        const d = z1 - z0;
        const cx = band.x0 + w / 2;
        const cz = z0 + d / 2;
        return (
          <mesh key={band.x0} position={[cx, heightAt(cx, cz) + band.lift, cz]} receiveShadow>
            <boxGeometry args={[w, 0.08, d]} />
            <meshLambertMaterial color={band.color} />
          </mesh>
        );
      })}
    </group>
  );
}

function WestRoad() {
  const geo = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(4.2, PLOT_NS, 1, 8);
    geometry.rotateX(-Math.PI / 2);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 1) {
      const z = pos.getZ(i) + PLOT_NS / 2;
      pos.setY(i, heightAt(0, z) - 0.04);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  return (
    <mesh geometry={geo} position={[-2.1, 0, PLOT_NS / 2]} receiveShadow>
      <meshStandardMaterial color="#c3bbb2" roughness={0.95} />
    </mesh>
  );
}

function SceneContent() {
  const trees = fruitTreePositions();

  return (
    <>
      <color attach="background" args={["#e7e2d6"]} />
      <fog attach="fog" args={["#e7e2d6", 55, 95]} />
      <hemisphereLight args={["#ffe7b0", "#3f4a32", 0.55]} />
      <directionalLight
        position={[42, 14, 8]}
        intensity={1.05}
        color="#ffd89a"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={90}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
      />
      <ambientLight intensity={0.28} />
      <SurroundGround />
      <WestRoad />
      <TerrainMesh />
      <CascadeBands />
      <PlotBoundary />
      <House />
      <Terrace />
      <GrassClumps />
      {trees.map((tree) => (
        <FruitTree key={`${tree.kind}-${tree.x}-${tree.z}`} {...tree} />
      ))}
      <NeighborBelt />
      <GesutNetworks />
      <CardinalLabels />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={16}
        maxDistance={90}
        minPolarAngle={0.22}
        maxPolarAngle={Math.PI / 2 - 0.12}
        target={[PLOT_WE * 0.52, 1.6, PLOT_NS * 0.55]}
      />
    </>
  );
}

export function Plot3DScene() {
  return (
    <Canvas
      camera={{ position: [52, 22, 40], fov: 42, near: 0.1, far: 180 }}
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      className="h-full w-full"
      aria-label="Interaktywny widok 3D działki 4/5"
    >
      <SceneContent />
    </Canvas>
  );
}
