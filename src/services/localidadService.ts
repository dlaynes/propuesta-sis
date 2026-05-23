import type { Localidad } from '../types/localidad';

let localidadesPromise: Promise<Localidad[]> | null = null;

async function loadLocalidades(): Promise<Localidad[]> {
  if (!localidadesPromise) {
    localidadesPromise = fetch('/data/json/localidades.json')
      .then((res) => res.json())
      .then((data) => data as Localidad[]);
  }
  return localidadesPromise;
}

/** Get all localidades sorted by name */
export async function getAllLocalidades(): Promise<Localidad[]> {
  const records = await loadLocalidades();
  return [...records].sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Find a localidad by its num ID */
export async function findLocalidadByNum(num: string): Promise<Localidad | undefined> {
  const records = await loadLocalidades();
  return records.find((r) => r.num === num.trim());
}

/** Find a localidad by its ubigeo code */
export async function findLocalidadByUbigeo(ubigeo: string): Promise<Localidad | undefined> {
  const records = await loadLocalidades();
  return records.find((r) => r.ubigeo_codigo === ubigeo.trim());
}

/** Search localidades by name (case-insensitive, partial match) */
export async function searchLocalidadesByName(query: string): Promise<Localidad[]> {
  const records = await loadLocalidades();
  const q = query.trim().toLowerCase();
  if (!q) return [...records].sort((a, b) => a.localidad.localeCompare(b.localidad));
  return records
    .filter((r) => r.localidad.toLowerCase().includes(q))
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Search localidades by pueblo indígena */
export async function getLocalidadesByPueblo(pueblo: string): Promise<Localidad[]> {
  const records = await loadLocalidades();
  const p = pueblo.trim().toLowerCase();
  return records
    .filter((r) => r.pueblo_indigena.toLowerCase() === p)
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Search localidades by tipo */
export async function getLocalidadesByTipo(tipo: string): Promise<Localidad[]> {
  const records = await loadLocalidades();
  const t = tipo.trim().toLowerCase();
  return records
    .filter((r) => r.tipo_localidad.toLowerCase() === t)
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Search localidades by partial ubigeo (e.g. first 2 digits = dept, 4 = province, 6 = district) */
export async function getLocalidadesByUbigeoPrefix(prefix: string): Promise<Localidad[]> {
  const records = await loadLocalidades();
  const p = prefix.trim();
  return records
    .filter((r) => r.ubigeo_codigo.startsWith(p))
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Search localidades across all text fields */
export async function searchLocalidades(query: string): Promise<Localidad[]> {
  const records = await loadLocalidades();
  const q = query.trim().toLowerCase();
  if (!q) return [...records].sort((a, b) => a.localidad.localeCompare(b.localidad));
  return records
    .filter(
      (r) =>
        r.localidad.toLowerCase().includes(q) ||
        r.pueblo_indigena.toLowerCase().includes(q) ||
        r.ubigeo_codigo.includes(q) ||
        r.tipo_localidad.toLowerCase().includes(q) ||
        r.tipo_de_educacion_impartida_en_la_localidad.toLowerCase().includes(q)
    )
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Get unique pueblo indígena names */
export async function getPueblosIndigenas(): Promise<string[]> {
  const records = await loadLocalidades();
  const pueblos = new Set(records.map((r) => r.pueblo_indigena));
  return [...pueblos].sort((a, b) => a.localeCompare(b));
}

/** Get unique tipo de localidad values */
export async function getTiposLocalidad(): Promise<string[]> {
  const records = await loadLocalidades();
  const tipos = new Set(records.map((r) => r.tipo_localidad));
  return [...tipos].sort((a, b) => a.localeCompare(b));
}
