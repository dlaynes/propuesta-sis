import localidadesData from '../data/json/localidades.json';
import centrosData from '../data/json/centros_poblados.json';
import departamentosData from '../data/json/ubigeo_peru_2016_departamentos.json';

export interface PuebloIndigena {
  nombre: string;
  familiaLinguistica: string;
  localidadesCount: number;
  centrosPobladosCount: number;
  poblacionTotal: number;
  porcentajePoblacion: number;
  hablantes: number;
}

export interface PoblacionBucket {
  rango: string;
  localidades: number;
  porcentaje: number;
  acumulado: number;
}

export interface DepartamentoStat {
  codigo: string;
  nombre: string;
  localidades: number;
  centrosPoblados: number;
  poblacion: number;
  porcentaje: number;
}

export interface ResumenStats {
  totalLocalidades: number;
  totalCentrosPoblados: number;
  centrosConPueblo: number;
  totalPueblos: number;
  poblacionTotalLocalidades: number;
  conEscolarizado: number;
  conTitulacion: number;
  conReconocimiento: number;
}

const FAMILIA_LINGUISTICA_MAP: Record<string, string> = {
  Ashaninka: 'Arawak',
  Asheninka: 'Arawak',
  Yanesha: 'Arawak',
  'Mashco piro': 'Arawak',
  Awajún: 'Jivaroan',
  Achuar: 'Jivaroan',
  Shiwilu: 'Jivaroan',
  'Shipibo-konibo': 'Panoan',
  Kakataibo: 'Panoan',
  Matsigenka: 'Panoan',
  'Amahuaca': 'Panoan',
  'Sharanahua': 'Panoan',
  Kichwa: 'Quechuan',
  Quechua: 'Quechuan',
  Aymara: 'Aymaran',
  Tikuna: 'Tupian',
  Yagua: 'Peba-Yaguan',
  Shawi: 'Cahuapanan',
  'Kandozi': 'Zaparoan',
  'Kukama kukamiria': 'Tupian',
  Madija: 'Arawan',
  'Iskonawa': 'Panoan',
  'Chamicuro': 'Arawak',
  'Murui-muinane': 'Bora-Witotoan',
  'Witoto-mürui': 'Bora-Witotoan',
};

export function getFamiliaLinguistica(pueblo: string): string {
  return FAMILIA_LINGUISTICA_MAP[pueblo] || 'Diversas';
}

function filterByUbigeoPrefix(
  records: Array<Record<string, string>>,
  prefix: string | undefined,
  field: string
): Array<Record<string, string>> {
  if (!prefix) return records;
  return records.filter((r) => r[field]?.startsWith(prefix));
}

export function computeResumenStats(ubigeoPrefix?: string): ResumenStats {
  const locs = localidadesData as Array<Record<string, string>>;
  const cps = centrosData as Array<Record<string, string>>;

  const filteredLocs = filterByUbigeoPrefix(locs, ubigeoPrefix, 'ubigeo_codigo');
  const filteredCps = filterByUbigeoPrefix(cps, ubigeoPrefix, 'ubigeo_distrito_actual');

  const totalLocalidades = filteredLocs.length;
  const totalCentrosPoblados = filteredCps.length;
  const centrosConPueblo = filteredCps.filter(
    (r) => r.pueblo_indigena && r.pueblo_indigena.trim() !== ''
  ).length;

  const pueblosSet = new Set<string>();
  for (const r of filteredLocs) {
    if (r.pueblo_indigena) pueblosSet.add(r.pueblo_indigena);
  }
  for (const r of filteredCps) {
    if (r.pueblo_indigena) pueblosSet.add(r.pueblo_indigena);
  }

  let poblacionTotalLocalidades = 0;
  for (const r of filteredLocs) {
    poblacionTotalLocalidades += parseInt(r.total_poblacion, 10) || 0;
  }

  const conEscolarizado = filteredLocs.filter((r) =>
    r.tipo_de_educacion_impartida_en_la_localidad?.toLowerCase().includes('escolarizado')
  ).length;

  const conTitulacion = filteredLocs.filter(
    (r) =>
      r.resolucion_de_titulacion_de_la_comunidad &&
      r.resolucion_de_titulacion_de_la_comunidad.trim() !== '' &&
      r.resolucion_de_titulacion_de_la_comunidad !== '-'
  ).length;

  const conReconocimiento = filteredLocs.filter(
    (r) =>
      r.resolucion_de_reconocimiento_de_la_comunidad &&
      r.resolucion_de_reconocimiento_de_la_comunidad.trim() !== '' &&
      r.resolucion_de_reconocimiento_de_la_comunidad !== '-'
  ).length;

  return {
    totalLocalidades,
    totalCentrosPoblados,
    centrosConPueblo,
    totalPueblos: pueblosSet.size,
    poblacionTotalLocalidades,
    conEscolarizado,
    conTitulacion,
    conReconocimiento,
  };
}

export function computePueblosStats(ubigeoPrefix?: string): PuebloIndigena[] {
  const locs = localidadesData as Array<Record<string, string>>;
  const cps = centrosData as Array<Record<string, string>>;

  const filteredLocs = filterByUbigeoPrefix(locs, ubigeoPrefix, 'ubigeo_codigo');
  const filteredCps = filterByUbigeoPrefix(cps, ubigeoPrefix, 'ubigeo_distrito_actual');

  const stats: Record<
    string,
    {
      localidades: number;
      centros: number;
      poblacion: number;
      hablantes: number;
    }
  > = {};

  for (const r of filteredLocs) {
    const p = r.pueblo_indigena;
    if (!p) continue;
    if (!stats[p]) stats[p] = { localidades: 0, centros: 0, poblacion: 0, hablantes: 0 };
    stats[p].localidades += 1;
    stats[p].poblacion += parseInt(r.total_poblacion, 10) || 0;
    stats[p].hablantes += parseInt(r.hablantes_alguna_lengua_indigena, 10) || 0;
  }

  for (const r of filteredCps) {
    const p = r.pueblo_indigena;
    if (!p) continue;
    if (!stats[p]) stats[p] = { localidades: 0, centros: 0, poblacion: 0, hablantes: 0 };
    stats[p].centros += 1;
  }

  const totalPoblacion = Object.values(stats).reduce((sum, s) => sum + s.poblacion, 0);

  const result: PuebloIndigena[] = Object.entries(stats).map(([nombre, s]) => ({
    nombre,
    familiaLinguistica: getFamiliaLinguistica(nombre),
    localidadesCount: s.localidades,
    centrosPobladosCount: s.centros,
    poblacionTotal: s.poblacion,
    porcentajePoblacion: totalPoblacion > 0 ? parseFloat(((s.poblacion / totalPoblacion) * 100).toFixed(1)) : 0,
    hablantes: s.hablantes,
  }));

  return result.sort((a, b) => b.poblacionTotal - a.poblacionTotal);
}

export function computePoblacionBuckets(ubigeoPrefix?: string): PoblacionBucket[] {
  const locs = localidadesData as Array<Record<string, string>>;

  const filteredLocs = filterByUbigeoPrefix(locs, ubigeoPrefix, 'ubigeo_codigo');

  const buckets = [
    { rango: '0 - 500', count: 0 },
    { rango: '501 - 1,000', count: 0 },
    { rango: '1,001 - 2,000', count: 0 },
    { rango: '2,001 - 5,000', count: 0 },
    { rango: '5,001 - 10,000', count: 0 },
    { rango: 'Más de 10,000', count: 0 },
  ];

  for (const r of filteredLocs) {
    const pop = parseInt(r.total_poblacion, 10) || 0;
    if (pop <= 500) buckets[0].count++;
    else if (pop <= 1000) buckets[1].count++;
    else if (pop <= 2000) buckets[2].count++;
    else if (pop <= 5000) buckets[3].count++;
    else if (pop <= 10000) buckets[4].count++;
    else buckets[5].count++;
  }

  const total = filteredLocs.length;
  let acumulado = 0;

  return buckets.map((b) => {
    const porcentaje = total > 0 ? parseFloat(((b.count / total) * 100).toFixed(1)) : 0;
    acumulado += porcentaje;
    return {
      rango: b.rango,
      localidades: b.count,
      porcentaje,
      acumulado: parseFloat(acumulado.toFixed(1)),
    };
  });
}

export function computeDepartamentoStats(ubigeoPrefix?: string): DepartamentoStat[] {
  const locs = localidadesData as Array<Record<string, string>>;
  const cps = centrosData as Array<Record<string, string>>;
  const depts = departamentosData as Array<{ id: string; name: string }>;

  const filteredLocs = filterByUbigeoPrefix(locs, ubigeoPrefix, 'ubigeo_codigo');
  const filteredCps = filterByUbigeoPrefix(cps, ubigeoPrefix, 'ubigeo_distrito_actual');

  const deptMap: Record<string, string> = {};
  for (const d of depts) deptMap[d.id] = d.name;

  const stats: Record<
    string,
    { localidades: number; centros: number; poblacion: number }
  > = {};

  for (const r of filteredLocs) {
    const code = r.ubigeo_codigo?.slice(0, 2);
    if (!code) continue;
    if (!stats[code]) stats[code] = { localidades: 0, centros: 0, poblacion: 0 };
    stats[code].localidades += 1;
    stats[code].poblacion += parseInt(r.total_poblacion, 10) || 0;
  }

  for (const r of filteredCps) {
    const code = r.ubigeo_centro_poblado_actual?.slice(0, 2);
    if (!code) continue;
    if (!stats[code]) stats[code] = { localidades: 0, centros: 0, poblacion: 0 };
    stats[code].centros += 1;
  }

  const totalPoblacion = Object.values(stats).reduce((s, v) => s + v.poblacion, 0);

  const result: DepartamentoStat[] = Object.entries(stats).map(([codigo, s]) => ({
    codigo,
    nombre: deptMap[codigo] || codigo,
    localidades: s.localidades,
    centrosPoblados: s.centros,
    poblacion: s.poblacion,
    porcentaje: totalPoblacion > 0 ? parseFloat(((s.poblacion / totalPoblacion) * 100).toFixed(1)) : 0,
  }));

  return result.sort((a, b) => b.localidades - a.localidades);
}
