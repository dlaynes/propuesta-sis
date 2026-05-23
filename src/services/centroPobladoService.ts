import type { CentroPoblado } from '../types/centro_poblado';

let centrosPromise: Promise<CentroPoblado[]> | null = null;

async function loadCentrosPoblados(): Promise<CentroPoblado[]> {
  if (!centrosPromise) {
    centrosPromise = fetch('/data/json/centros_poblados.json')
      .then((res) => res.json())
      .then((data) => data as CentroPoblado[]);
  }
  return centrosPromise;
}

/** Get all centros poblados sorted by name */
export async function getAllCentrosPoblados(): Promise<CentroPoblado[]> {
  const records = await loadCentrosPoblados();
  return [...records].sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Find a centro poblado by its num ID */
export async function findCentroPobladoByNum(num: string): Promise<CentroPoblado | undefined> {
  const records = await loadCentrosPoblados();
  return records.find((r) => r.num === num.trim());
}

/** Find a centro poblado by its ubigeo code */
export async function findCentroPobladoByUbigeo(ubigeo: string): Promise<CentroPoblado | undefined> {
  const records = await loadCentrosPoblados();
  return records.find((r) => r.ubigeo_centro_poblado_actual === ubigeo.trim());
}

/** Search centros poblados by name (case-insensitive, partial match) */
export async function searchCentrosPobladosByName(query: string): Promise<CentroPoblado[]> {
  const records = await loadCentrosPoblados();
  const q = query.trim().toLowerCase();
  if (!q) return [...records].sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
  return records
    .filter((r) => r.centro_poblado.toLowerCase().includes(q))
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Search centros poblados by pueblo indígena */
export async function getCentrosPobladosByPueblo(pueblo: string): Promise<CentroPoblado[]> {
  const records = await loadCentrosPoblados();
  const p = pueblo.trim().toLowerCase();
  return records
    .filter((r) => r.pueblo_indigena.toLowerCase() === p)
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Search centros poblados by tipo de localidad */
export async function getCentrosPobladosByTipo(tipo: string): Promise<CentroPoblado[]> {
  const records = await loadCentrosPoblados();
  const t = tipo.trim().toLowerCase();
  return records
    .filter((r) => r.tipo_localidad.toLowerCase() === t)
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Search centros poblados by localidad name */
export async function getCentrosPobladosByLocalidad(localidad: string): Promise<CentroPoblado[]> {
  const records = await loadCentrosPoblados();
  const l = localidad.trim().toLowerCase();
  return records
    .filter((r) => r.localidad.toLowerCase().includes(l))
    .sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
}

/** Search centros poblados across all text fields */
export async function searchCentrosPoblados(query: string): Promise<CentroPoblado[]> {
  const records = await loadCentrosPoblados();
  const q = query.trim().toLowerCase();
  if (!q) return [...records].sort((a, b) => a.centro_poblado.localeCompare(b.centro_poblado));
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
export async function getCentroPobladoPueblos(): Promise<string[]> {
  const records = await loadCentrosPoblados();
  const pueblos = new Set(records.map((r) => r.pueblo_indigena));
  return [...pueblos].sort((a, b) => a.localeCompare(b));
}

/** Get unique tipo de localidad values */
export async function getCentroPobladoTipos(): Promise<string[]> {
  const records = await loadCentrosPoblados();
  const tipos = new Set(records.map((r) => r.tipo_localidad));
  return [...tipos].sort((a, b) => a.localeCompare(b));
}

/** Get unique educación type values */
export async function getCentroPobladoEducacionTipos(): Promise<string[]> {
  const records = await loadCentrosPoblados();
  const tipos = new Set(records.map((r) => r.tipo_de_educacion_impartida_en_el_centro_poblado));
  return [...tipos].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

/** Get unique localidad names */
export async function getCentroPobladoLocalidades(): Promise<string[]> {
  const records = await loadCentrosPoblados();
  const locs = new Set(records.map((r) => r.localidad));
  return [...locs].sort((a, b) => a.localeCompare(b));
}

/** Get unique ubigeo distrito actual values */
export async function getCentroPobladoDistritos(): Promise<string[]> {
  const records = await loadCentrosPoblados();
  const dists = new Set(records.map((r) => r.ubigeo_distrito_actual));
  return [...dists].sort((a, b) => a.localeCompare(b));
}
