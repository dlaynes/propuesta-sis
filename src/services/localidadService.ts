import localidadesData from '../data/json/localidades.json';
import type { Localidad } from '../types/localidad';

const records: Localidad[] = localidadesData as Localidad[];

/** Get all localidades sorted by name */
export function getAllLocalidades(): Localidad[] {
  return [...records].sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Find a localidad by its num ID */
export function findLocalidadByNum(num: string): Localidad | undefined {
  return records.find((r) => r.num === num.trim());
}

/** Find a localidad by its ubigeo code */
export function findLocalidadByUbigeo(ubigeo: string): Localidad | undefined {
  return records.find((r) => r.ubigeo_codigo === ubigeo.trim());
}

/** Search localidades by name (case-insensitive, partial match) */
export function searchLocalidadesByName(query: string): Localidad[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllLocalidades();
  return records
    .filter((r) => r.localidad.toLowerCase().includes(q))
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Search localidades by pueblo indígena */
export function getLocalidadesByPueblo(pueblo: string): Localidad[] {
  const p = pueblo.trim().toLowerCase();
  return records
    .filter((r) => r.pueblo_indigena.toLowerCase() === p)
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Search localidades by tipo */
export function getLocalidadesByTipo(tipo: string): Localidad[] {
  const t = tipo.trim().toLowerCase();
  return records
    .filter((r) => r.tipo_localidad.toLowerCase() === t)
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Search localidades by partial ubigeo (e.g. first 2 digits = dept, 4 = province, 6 = district) */
export function getLocalidadesByUbigeoPrefix(prefix: string): Localidad[] {
  const p = prefix.trim();
  return records
    .filter((r) => r.ubigeo_codigo.startsWith(p))
    .sort((a, b) => a.localidad.localeCompare(b.localidad));
}

/** Search localidades across all text fields */
export function searchLocalidades(query: string): Localidad[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllLocalidades();
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
export function getPueblosIndigenas(): string[] {
  const pueblos = new Set(records.map((r) => r.pueblo_indigena));
  return [...pueblos].sort((a, b) => a.localeCompare(b));
}

/** Get unique tipo de localidad values */
export function getTiposLocalidad(): string[] {
  const tipos = new Set(records.map((r) => r.tipo_localidad));
  return [...tipos].sort((a, b) => a.localeCompare(b));
}
