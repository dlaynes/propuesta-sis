// Auto-generated from frontend/data/peru.svg
import { useState, type ReactNode } from "react";
import DEPARTMENT_PATHS from "./peruMapData";

export const DEFAULT_FILL = "#f1f3f5";
export const DEFAULT_STROKE = "#7f7b78";
export const DEFAULT_OPACITY = 0.95;

export const ACTIVE_FILL = "#00E5FF";
export const ACTIVE_STROKE = "#00E5FF";
export const HIGHLIGHT_FILL = "#F0A040";
export const HIGHLIGHT_STROKE = "#F0A040";

export type DEPARTMENT_CODE = keyof typeof DEPARTMENT_PATHS;

export interface PeruMapTitleProps {
  mainTitle?: string;
  subTitle?: string;
}

export function PeruMapTitle({
  mainTitle = "REPÚBLICA DEL PERÚ",
  subTitle = "Mapa Político y Departamental",
}: PeruMapTitleProps) {
  return (
    <>
      {mainTitle ? <text
        x="50%" y="8%" textAnchor="middle"
        fontSize={20} fontWeight="bold"
        fill="#f4f4f5" fontFamily="monospace"
        letterSpacing="0.08em"
        style={{ whiteSpace: "pre" }}
      >
        {mainTitle}
      </text> : null}
      {subTitle ? <text
        x="50%" y="11%" textAnchor="middle"
        fontSize={11} fontWeight="medium"
        fill="#f4f4f5" opacity={0.75}
        fontFamily="monospace"
        letterSpacing="0.03em"
        style={{ whiteSpace: "pre" }}
      >
        {subTitle}
      </text> : null}
    </>
  );
}

export interface PeruMapRegionProps {
  deptCode: DEPARTMENT_CODE;
  d: string;
  fill?: string;
  stroke?: string;
  isActive?: boolean;
  isHighlighted?: boolean;
  activeFill?: string;
  activeStroke?: string;
  highlightFill?: string;
  highlightStroke?: string;
  opacity?: number;
  onClick?: (deptCode: DEPARTMENT_CODE) => void;
  onMouseEnter?: (deptCode: DEPARTMENT_CODE) => void;
  onMouseLeave?: () => void;
}

export function PeruMapRegion({
  deptCode, d,
  fill = DEFAULT_FILL,
  stroke = DEFAULT_STROKE,
  isActive = false,
  isHighlighted = false,
  onClick, onMouseEnter, onMouseLeave,
  activeFill = ACTIVE_FILL,
  activeStroke = ACTIVE_STROKE,
  highlightFill = HIGHLIGHT_FILL,
  highlightStroke = HIGHLIGHT_STROKE,
  opacity = DEFAULT_OPACITY,
}: PeruMapRegionProps) {
  const [isHovered, setIsHovered] = useState(false);

  const activeFill1 = isActive ? activeFill : isHighlighted ? highlightFill : fill;
  const activeStroke1 = isActive ? activeStroke : isHighlighted ? highlightStroke : stroke;
  const activeOpacity = isHovered ? 1 : opacity;
  const strokeWidth = isHovered ? 2.5 : 1.7;

  return (
    <path
      id={`dept-path-${deptCode}`}
      d={d}
      fill={activeFill1}
      fillOpacity={activeOpacity}
      stroke={activeStroke1}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      className="transition-all duration-150 cursor-pointer"
      style={{ filter: isHovered ? "drop-shadow(0 0 3px rgba(255,255,255,0.15))" : "none" }}
      onClick={() => onClick?.(deptCode)}
      onMouseEnter={() => { setIsHovered(true); onMouseEnter?.(deptCode); }}
      onMouseLeave={() => { setIsHovered(false); onMouseLeave?.(); }}
    />
  );
}

export interface PeruMapProps {
  activeRegion?: string;
  highlightedRegions?: string[];
  regionData?: Record<string, { name: string; visitors: number }>;
  onRegionClick?: (deptCode: DEPARTMENT_CODE) => void;
  onRegionHover?: (deptCode: DEPARTMENT_CODE | null) => void;
  title?: ReactNode;
  width?: number;
  height?: number;
  departmentFills?: Record<DEPARTMENT_CODE, string>;
  departmentStrokes?: Record<DEPARTMENT_CODE, string>;
  departmentOpacities?: Record<DEPARTMENT_CODE, number>;
  activeFill?: string;
  activeStroke?: string;
  highlightFill?: string;
  highlightStroke?: string;
}

/*
 * El mapa del Perú en formato SVG
 * Para colorear interactivamente, existen 2 alternativas:
 * 1. Pasar objetos `departmentFills` y `departmentStrokes` con el código de departamento como clave y el color como valor
 * 2. Usar `activeRegion` para marcar un departamento activo (ej. el más visitado) y `highlightedRegions` para marcar otros departamentos (ej. los 5 más visitados), usando los colores definidos en `activeFill`, `activeStroke`, `highlightFill` y `highlightStroke`
 * 
 * Para poner colores base por defecto usar las propiedades `defaultFill` y `defaultStroke`
 * 
 */
export default function PeruMap({
  activeRegion,
  highlightedRegions = [],
  onRegionClick,
  onRegionHover,
  title = <PeruMapTitle />,
  width = 800,
  height = 900,
  departmentFills = {} as Record<DEPARTMENT_CODE, string>,
  departmentStrokes = {} as Record<DEPARTMENT_CODE, string>,
  departmentOpacities = {} as Record<DEPARTMENT_CODE, number>,
  activeFill = ACTIVE_FILL,
  activeStroke = ACTIVE_STROKE,
  highlightFill = HIGHLIGHT_FILL,
  highlightStroke = HIGHLIGHT_STROKE,
}: PeruMapProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 700 800"
      width={width}
      height={height}
      className="w-full h-full transform transition-all duration-100 cursor-default"
      style={{ background: "transparent", transform: "none" }}
      role="img"
      aria-label="Mapa de los 25 departamentos del Perú. Use el cursor o el teclado para seleccionar una región."
    >
      <g transform="scale(1) translate(0,0)" style={{ transformOrigin: "350px 400px 0px" }}>
        <g>
          {Object.entries(DEPARTMENT_PATHS).map(([code, d]) => (
            <PeruMapRegion
              key={code}
              deptCode={code as DEPARTMENT_CODE}
              d={d}
              fill={departmentFills[code as DEPARTMENT_CODE]}
              stroke={departmentStrokes[code as DEPARTMENT_CODE]}
              opacity={departmentOpacities[code as DEPARTMENT_CODE]}
              isActive={activeRegion === code}
              isHighlighted={highlightedRegions.includes(code)}
              onClick={onRegionClick}
              onMouseEnter={onRegionHover}
              onMouseLeave={() => onRegionHover?.(null)}
              activeFill={activeFill}
              activeStroke={activeStroke}
              highlightFill={highlightFill}
              highlightStroke={highlightStroke}
            />
          ))}
        </g>
      </g>
      {title}
    </svg>
  );
}
