/** UBIGEO (Ubicación Geográfica) type definitions for Peru's administrative divisions */

/** Represents a Department (Region) in Peru */
export interface Department {
  id: string;
  name: string;
}

/** Represents a Province in Peru */
export interface Province {
  id: string;
  name: string;
  department_id: string;
}

/** Represents a District in Peru */
export interface District {
  id: string;
  name: string;
  province_id: string;
  department_id: string;
  lat: number;
  lng: number;
  alternate_name?: string; // Optional field for alternate names
}
