import type { CentroPoblado } from '../../types/centro_poblado';
import type { Localidad } from '../../types/localidad';

export function parseCentroPobladoInstituciones(row: CentroPoblado) {
  const num = parseInt(row.num_de_instituciones_educativas_en_el_centro_poblado, 10) || 0;
  const tipos = row.tipo_de_instituciones_educativas_en_el_centro_poblado?.split('\n').filter(Boolean) || [];
  const niveles = row.nivel_de_las_instituciones_educativas_en_el_centro_poblado?.split('\n').filter(Boolean) || [];
  const educacion = row.tipo_de_educacion_impartida_en_el_centro_poblado?.split('\n').filter(Boolean) || [];
  return { num, tipos, niveles, educacion };
}

export function parseLocalidadInstituciones(row: Localidad) {
  const num = parseInt(row.num_de_instituciones_educativas_en_la_localidad, 10) || 0;
  const tipos = row.tipo_de_instituciones_educativas_en_la_localidad?.split('\n').filter(Boolean) || [];
  const niveles = row.nivel_de_las_instituciones_educativas_en_la_localidad?.split('\n').filter(Boolean) || [];
  const educacion = row.tipo_de_educacion_impartida_en_la_localidad?.split('\n').filter(Boolean) || [];
  return { num, tipos, niveles, educacion };
}
