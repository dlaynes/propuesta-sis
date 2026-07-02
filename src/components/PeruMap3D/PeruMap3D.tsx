import { useMemo, useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { XR, createXRStore, IfInSessionMode } from '@react-three/xr';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import DEPARTMENT_PATHS from '../PeruMap/peruMapData';
import { useAnnouncer } from '../../hooks/useAnnouncer';
import type { DepartamentoStat } from '../../types/pueblos_indigenas';
import { computeDepartmentHeatColors } from '../../utils/departmentHeatColors';

export interface PeruMap3DProps {
  deptRows: DepartamentoStat[];
  activeRegion?: string;
  onRegionClick?: (deptCode: string) => void;
  maxExtrusionHeight?: number;
}

interface DepartmentMeshProps {
  code: string;
  shapes: THREE.Shape[];
  depth: number;
  color: string;
  isActive: boolean;
  onClick?: (code: string) => void;
  hoverEnabled: boolean;
}

/**
 * A single department rendered as an extruded 3D prism. Clicks bubble up
 * to the parent so the same click handler powers both 2D and 3D views.
 */
function DepartmentMesh({ code, shapes, depth, color, isActive, onClick, hoverEnabled }: DepartmentMeshProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // The "emissive" of the active prism is brighter; hovered adds a slight lift.
  const emissiveIntensity = isActive ? 0.6 : hovered && hoverEnabled ? 0.25 : 0;

  useFrame(() => {
    if (!meshRef.current) return;
    const target = isActive ? depth * 1.15 : depth;
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, target, 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      scale={[1, 1, depth]}
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(code);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = hoverEnabled ? 'pointer' : 'default';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* ExtrudeGeometry accepts a Shape | Shape[]; passing the whole
          array extrudes every subpath (e.g. Puno's island + mainland) into
          ONE geometry so nothing is silently dropped by mesh.geometry. */}
      <extrudeGeometry
        args={[shapes, { depth: 1, bevelEnabled: false, steps: 1 }]}
      />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        emissive={isActive ? '#22d3ee' : color}
        emissiveIntensity={emissiveIntensity}
        roughness={0.55}
        metalness={0.05}
      />
    </mesh>
  );
}

/**
 * Scales and centres the extruded departments so the full map is in view.
 * The source SVG uses viewBox "0 0 700 800"; we flip Y (Three.js is +Y up)
 * and translate so the centroid sits at the origin.
 */
function useScaledShapes() {
  return useMemo(() => {
    const loader = new SVGLoader();
    const out: Array<{ code: string; shapes: THREE.Shape[] }> = [];
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [code, d] of Object.entries(DEPARTMENT_PATHS)) {
      // SVGLoader.parse() expects a full SVG document (it uses DOMParser
      // internally), not a bare path 'd' string. Wrap each department path in
      // a minimal <svg><path/></svg> document so the parser finds the node.
      const svgDoc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 800"><path d="${d}" fill="#000"/></svg>`;
      const result = loader.parse(svgDoc);
      const shapes: THREE.Shape[] = [];
      for (const sp of result.paths) {
        const s = SVGLoader.createShapes(sp);
        shapes.push(...s);
      }
      out.push({ code, shapes });
      // Accumulate the bounding box (in raw SVG coordinates) so the whole
      // map can be centred without a runtime Box3 sweep.
      for (const shape of shapes) {
        for (const p of shape.getPoints()) {
          if (p.x < minX) minX = p.x;
          if (p.y < minY) minY = p.y;
          if (p.x > maxX) maxX = p.x;
          if (p.y > maxY) maxY = p.y;
        }
      }
    }
    const centre = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    return { departments: out, centre };
  }, []);
}

interface CenteringGroupProps {
  children: React.ReactNode;
  centre: { x: number; y: number };
}

function CenteringGroup({ children, centre }: CenteringGroupProps) {
  // Lay the map flat: rotate -90° about X so the shape's XY plane becomes the
  // ground (XZ) and the extrusion (local +Z) points up (+Y). Scale SVG units
  // to scene units (0.012) and flip Y (SVG +Y is down). Position offsets by
  // the precomputed SVG centre so the map is centred on the origin and its
  // base rests at y = 0 — above the ground plane.
  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <group
        scale={[0.012, -0.012, 1]}
        position={[-0.012 * centre.x, 0.012 * centre.y, 0]}
      >
        {children}
      </group>
    </group>
  );
}

interface SceneProps {
  deptRows: DepartamentoStat[];
  activeRegion: string | undefined;
  onRegionClick: (code: string) => void;
  colors: Record<string, string>;
  maxExtrusionHeight: number;
  hoverEnabled: boolean;
}

function Scene({ deptRows, activeRegion, onRegionClick, colors, maxExtrusionHeight, hoverEnabled }: SceneProps) {
  const { departments, centre } = useScaledShapes();
  const lookup = useMemo(() => {
    const map: Record<string, DepartamentoStat> = {};
    for (const row of deptRows) map[row.codigo] = row;
    return map;
  }, [deptRows]);
  const max = useMemo(
    () => Math.max(1, ...deptRows.map((r) => r.localidades)),
    [deptRows],
  );

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 4, -3]} intensity={0.3} />

      <CenteringGroup centre={centre}>
        {departments
          .map(({ code, shapes }) => {
          if (shapes.length === 0) return null;
          const stat = lookup[code];
          const ratio = stat ? stat.localidades / max : 0;
          // Always show some height so empty departments remain visible.
          const depth = Math.max(0.4, ratio * maxExtrusionHeight);
          const color = colors[code] || '#cbd5e1';
          return (
            <DepartmentMesh
              key={code}
              code={code}
              shapes={shapes}
              depth={depth}
              color={color}
              isActive={activeRegion === code}
              onClick={onRegionClick}
              hoverEnabled={hoverEnabled}
            />
          );
        })}
      </CenteringGroup>

      {/* A faint ground plane anchors the map in space. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial side={THREE.DoubleSide} color="#f0f2f5" roughness={0.95} />
      </mesh>
    </>
  );
}

interface PeruMap3DCanvasProps {
  deptRows: DepartamentoStat[];
  activeRegion?: string;
  onRegionClick?: (deptCode: string) => void;
}

/**
 * The immersive 3D / WebXR map. Mounted only when the user opts in via the
 * 2D/3D toggle; defers the heavy geometry parsing to a Suspense boundary.
 */
export function PeruMap3D({ deptRows, activeRegion, onRegionClick }: PeruMap3DCanvasProps) {
  const { announce } = useAnnouncer();
  const colors = useMemo(() => computeDepartmentHeatColors(deptRows), [deptRows]);

  // Build the WebXR store lazily. WebXR is only available on secure origins
  // and supported devices — falling back to plain Canvas is fine.
  const [store] = useState(() =>
    typeof window !== 'undefined' && 'navigator' in window && 'xr' in navigator
      ? createXRStore({ offerSession: true, emulate: false })
      : null,
  );

  const handleClick = (code: string) => {
    onRegionClick?.(code);
    const row = deptRows.find((r) => r.codigo === code);
    if (row) {
      announce(`${row.nombre}: ${row.localidades.toLocaleString()} localidades en la visualización 3D.`);
    } else {
      announce('Región seleccionada en 3D.');
    }
  };

  const ariaLabel = useMemo(() => {
    const top = [...deptRows].sort((a, b) => b.localidades - a.localidades)[0];
    const topName = top?.nombre ?? 'desconocido';
    return `Mapa 3D del Perú. Cada departamento se extruye según el número de localidades indígenas. ${deptRows.length} departamentos. La región con más localidades es ${topName}.`;
  }, [deptRows]);

  return (
    <div
      className="h-[500px] w-full rounded-lg overflow-hidden border border-sis-border"
      role="img"
      aria-label={ariaLabel}
    >
      <Canvas
        shadows={{ type: THREE.PCFShadowMap }}
        dpr={[1, 2]}
        camera={{ position: [0, 6, 7], fov: 45 }}
      >
        <Suspense fallback={null}>
          {store ? (
            <XR store={store}>
              <Scene
                deptRows={deptRows}
                activeRegion={activeRegion}
                onRegionClick={handleClick}
                colors={colors}
                maxExtrusionHeight={2}
                hoverEnabled={true}
              />
              <IfInSessionMode deny="immersive-ar">
                <OrbitControls makeDefault enablePan={false} />
              </IfInSessionMode>
            </XR>
          ) : (
            <Scene
              deptRows={deptRows}
              activeRegion={activeRegion}
              onRegionClick={handleClick}
              colors={colors}
              maxExtrusionHeight={2}
              hoverEnabled={true}
            />
          )}
        </Suspense>
        <OrbitControls makeDefault enablePan={false} minDistance={2.5} maxDistance={12} target={[0, 0, 0]} />
      </Canvas>
      {store && <WebXRControls store={store} />}
    </div>
  );
}

interface WebXRControlsProps {
  store: ReturnType<typeof createXRStore>;
}

/**
 * Floating buttons for entering VR/AR sessions. Mounted only when the store
 * was successfully created. The buttons are out-of-canvas so the canvas's
 * 3D mesh is reachable through raycaster and tab order is preserved.
 */
function WebXRControls({ store }: WebXRControlsProps) {
  const [vrSupported, setVrSupported] = useState<boolean | null>(null);
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const { announce } = useAnnouncer();

  useEffect(() => {
    let cancelled = false;
    const update = (vr: boolean, ar: boolean) => {
      if (cancelled) return;
      setVrSupported(vr);
      setArSupported(ar);
    };
    if (!('navigator' in window) || !('xr' in navigator)) {
      update(false, false);
      return () => { cancelled = true; };
    }
    const xr = (navigator as Navigator).xr as XRSystem;
    Promise.all([
      xr.isSessionSupported('immersive-vr').catch(() => false),
      xr.isSessionSupported('immersive-ar').catch(() => false),
    ]).then(([vr, ar]) => update(vr, ar));
    return () => {
      cancelled = true;
    };
  }, []);

  const enterVR = async () => {
    try {
      await store.enterVR();
      announce('Sesión de realidad virtual iniciada.');
    } catch (err) {
      announce('No se pudo iniciar la sesión de realidad virtual.');
      console.error('VR session failed', err);
    }
  };
  const enterAR = async () => {
    try {
      await store.enterAR();
      announce('Sesión de realidad aumentada iniciada.');
    } catch (err) {
      announce('No se pudo iniciar la sesión de realidad aumentada.');
      console.error('AR session failed', err);
    }
  };

  if (vrSupported === false && arSupported === false) {
    return (
      <p className="text-xs text-sis-text-light mt-2">
        Este navegador no soporta WebXR. La visualización 3D está disponible con mouse o táctil.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      {vrSupported && (
        <button
          type="button"
          onClick={enterVR}
          className="bg-sis-navy hover:bg-sis-navy-light text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
        >
          Entrar en VR
        </button>
      )}
      {arSupported && (
        <button
          type="button"
          onClick={enterAR}
          className="bg-sis-orange hover:bg-sis-orange-hover text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
        >
          Entrar en AR
        </button>
      )}
    </div>
  );
}
