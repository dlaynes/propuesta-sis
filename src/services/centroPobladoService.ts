import centrosData from '../data/json/centros_poblados.json';
import type { CentroPoblado } from '../types/centro_poblado';

const records: CentroPoblado[] = centrosData as CentroPoblado[];

/** Get all centros poblados sorted by name */
export function getAllCentrosPoblados(): CentroPoblado[] {
  return [...records].sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Find a centro poblado by its num ID */
export function findCentroPobladoByNum(num: string): CentroPoblado | undefined {
  return records.find((r) => r.num === num.trim());
}

/** Find a centro poblado by its ubigeo code */
export function findCentroPobladoByUbigeo(ubigeo: string): CentroPoblado | undefined {
  return records.find((r) => r.ubigeo_centro_poblado_actual === ubigeo.trim());
}

/** Search centros poblados by name (case-insensitive, partial match) */
export function searchCentrosPobladosByName(query: string): CentroPoblado[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllCentrosPoblados();
  return records
    .filter((r) => r.centro_poblado.toLowerCase().includes(q))
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Search centros poblados by pueblo indígena */
export function getCentrosPobladosByPueblo(pueblo: string): CentroPoblado[] {
  const p = pueblo.trim().toLowerCase();
  return records
    .filter((r) => r.pueblo_indigena.toLowerCase() === p)
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Search centros poblados by tipo de localidad */
export function getCentrosPobladosByTipo(tipo: string): CentroPoblado[] {
  const t = tipo.trim().toLowerCase();
  return records
    .filter((r) => r.tipo_localidad.toLowerCase() === t)
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Search centros poblados by localidad name */
export function getCentrosPobladosByLocalidad(localidad: string): CentroPoblado[] {
  const l = localidad.trim().toLowerCase();
  return records
    .filter((r) => r.localidad.toLowerCase().includes(l))
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Search centros poblados across all text fields */
export function searchCentrosPoblados(query: string): CentroPoblado[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllCentrosPoblados();
  return records
    .filter(
      (r) =>
        r.centro_poblado.toLowerCase().includes(q) ||
        r.localidad.toLowerCase().includes(q) ||
        r.pueblo_indigena.toLowerCase().includes(q) ||
        r.ubigeo_centro_poblado_actual.includes(q) ||
        r.tipo_localidad.toLowerCase().includes(q) ||
        r.tipo_de_educacion_impartida_en_el_centro_poblado.toLowerCase().includes(q)
    )
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Get unique pueblo indígena names */
export function getCentroPobladoPueblos(): string[] {
  const pueblos = new Set(records.map((r) => r.pueblo_indigena));
  return [...pueblos].sort((a, b) => a.localeCompare(b));
}

/** Get unique tipo de localidad values */
export function getCentroPobladoTipos(): string[] {
  const tipos = new Set(records.map((r) => r.tipo_localidad));
  return [...tipos].sort((a, b) => a.localeCompare(b));
}

/** Get unique educación type values */
export function getCentroPobladoEducacionTipos(): string[] {
  const tipos = new Set(records.map((r) => r.tipo_de_educacion_impartida_en_el_centro_poblado));
  return [...tipos].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

/** Get unique localidad names */
export function getCentroPobladoLocalidades(): string[] {
  const locs = new Set(records.map((r) => r.localidad));
  return [...locs].sort((a, b) => a.localeCompare(b));
}

/** Get unique ubigeo distrito actual values */
export function getCentroPobladoDistritos(): string[] {
  const dists = new Set(records.map((r) => r.ubigeo_distrito_actual));
  return [...dists].sort((a, b) => a.localeCompare(b));
}
