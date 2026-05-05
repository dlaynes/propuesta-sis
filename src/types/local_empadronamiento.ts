
export interface LocalEmpadronamiento {
  codigo: string;
  nombre: string;
  dias: string;
  correo: string;
  referencia: string;
  telefono: string;
  direccion: string;
  ubigeo?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  lat?: number;
  lng?: number;
}