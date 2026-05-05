import uleData from '../data/json/directorio_nacional_ule_2024.json';
import type { LocalEmpadronamiento } from '../types/local_empadronamiento';

export interface UleRecord {
  ubigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion_ule: string;
  referencia: string;
  dias_atencion: string;
  lat?: number;
  lng?: number;
}

const records: UleRecord[] = uleData as UleRecord[];

/** Get all ULE records sorted by district name */
export function getAllUleRecords(): UleRecord[] {
  return [...records].sort((a, b) => a.distrito.localeCompare(b.distrito));
}

/** Find a ULE record by exact ubigeo code */
export function findUleByUbigeo(ubigeo: string): UleRecord | undefined {
  return records.find((r) => r.ubigeo === ubigeo.trim());
}

/** Search ULE records by district name (case-insensitive, partial match) */
export function searchUleByDistrict(query: string): UleRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllUleRecords();
  return records
    .filter((r) => r.distrito.toLowerCase().includes(q))
    .sort((a, b) => a.distrito.localeCompare(b.distrito));
}

/** Search ULE records across all text fields */
export function searchUle(query: string): UleRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllUleRecords();
  return records
    .filter(
      (r) =>
        r.ubigeo.includes(q) ||
        r.departamento.toLowerCase().includes(q) ||
        r.provincia.toLowerCase().includes(q) ||
        r.distrito.toLowerCase().includes(q) ||
        r.direccion_ule.toLowerCase().includes(q) ||
        r.referencia.toLowerCase().includes(q) ||
        r.dias_atencion.toLowerCase().includes(q)
    )
    .sort((a, b) => a.distrito.localeCompare(b.distrito));
}

/** Get ULE records filtered by department name */
export function getUleByDepartment(department: string): UleRecord[] {
  const dept = department.trim().toUpperCase();
  return records
    .filter((r) => r.departamento === dept)
    .sort((a, b) => a.distrito.localeCompare(b.distrito));
}

/** Get ULE records filtered by province name */
export function getUleByProvince(province: string): UleRecord[] {
  const prov = province.trim().toUpperCase();
  return records
    .filter((r) => r.provincia === prov)
    .sort((a, b) => a.distrito.localeCompare(b.distrito));
}

/** Get unique department names present in the ULE dataset */
export function getUleDepartments(): string[] {
  const depts = new Set(records.map((r) => r.departamento));
  return [...depts].sort((a, b) => a.localeCompare(b));
}

/** Get unique province names for a given department */
export function getUleProvincesByDepartment(department: string): string[] {
  const dept = department.trim().toUpperCase();
  const provs = new Set(
    records.filter((r) => r.departamento === dept).map((r) => r.provincia)
  );
  return [...provs].sort((a, b) => a.localeCompare(b));
}

/** Get unique district names for a given province */
export function getUleDistrictsByProvince(province: string): string[] {
  const prov = province.trim().toUpperCase();
  const dists = new Set(
    records.filter((r) => r.provincia === prov).map((r) => r.distrito)
  );
  return [...dists].sort((a, b) => a.localeCompare(b));
}

/** Convert a ULE record to the Local format used by LocalesEmpadronamiento */
export function uleToLocal(record: UleRecord, options?: { codigo?: string; correo?: string; telefono?: string }) : LocalEmpadronamiento {
  return {
    codigo: options?.codigo ?? `ULE-${record.ubigeo}`,
    nombre: `${record.distrito} — ${record.provincia}, ${record.departamento}`,
    dias: record.dias_atencion,
    correo: options?.correo ?? 'No disponible',
    referencia: record.referencia,
    telefono: options?.telefono ?? 'No disponible',
    direccion: record.direccion_ule,
    lat: record.lat,
    lng: record.lng
  };
}
