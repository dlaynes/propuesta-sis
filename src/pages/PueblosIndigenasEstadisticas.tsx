import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAnnouncer } from '../hooks/useAnnouncer';
import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import {
  BarChart3,
  Download,
  MapPin,
  Users,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  Box, Map as MapIcon 
} from 'lucide-react';
import type { Province, District } from '../types/ubigeo';
import {
  getAllDepartments,
  getProvincesByDepartmentId,
  getDistrictsByProvinceId,
} from '../services/ubigeoService';
import { Pagination } from '../components/Pagination';
import PeruMap from '../components/PeruMap/PeruMap';
import { computeDepartmentHeatColors } from '../utils/departmentHeatColors';
import { Spinner } from '../components/Loader';
import {
  computeResumenStats,
  computePueblosStats,
  computePoblacionBuckets,
  computeDepartamentoStats,
  type ResumenStats,
  type PuebloIndigena,
  type PoblacionBucket,
  type DepartamentoStat,
} from '../types/pueblos_indigenas';

const OTROS_OFFSET = 10; // Número de pueblos a mostrar antes de agrupar en "Otros"

const PeruMap3DLazy = lazy(() =>
  import('../components/PeruMap3D/PeruMap3D').then((m) => ({ default: m.PeruMap3D }))
);


export default function PueblosIndigenasEstadisticas() {
  const navigate = useNavigate();
  const departments = useMemo(() => getAllDepartments(), []);

  const [departmentId, setDepartmentId] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');

  const [pueblosPage, setPueblosPage] = useState(1);
  const [pueblosPageSize, setPueblosPageSize] = useState(10);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
const [searchParams, setSearchParams] = useSearchParams();
const [view3D, setView3D] = useState<boolean>(() => searchParams.get('view') === '3d');
  const [loading3D, setLoading3D] = useState(false);
const { announce: announceForToggle } = useAnnouncer();

const toggleView = () => {
  setView3D((prev) => {
    const next = !prev;
    const params = new URLSearchParams(searchParams);
    if (next) {
      params.set('view', '3d');
      setLoading3D(true);
      announceForToggle('Visualización 3D activada. Use el puntero del mouse o los dedos para rotar el mapa.');
      window.setTimeout(() => setLoading3D(false), 600);
    } else {
      params.delete('view');
      announceForToggle('Visualización 2D activada.');
      setLoading3D(false);
    }
    setSearchParams(params, { replace: true });
    return next;
  });
};

  // Derive ubigeo prefix from dropdown selection
  const ubigeoPrefix = useMemo(() => {
    if (districtId) return districtId;
    if (provinceId) return provinceId;
    if (departmentId) return departmentId;
    return undefined;
  }, [departmentId, provinceId, districtId]);

  const [stats, setStats] = useState<ResumenStats | null>(null);
  const [pueblosRows, setPueblosRows] = useState<PuebloIndigena[]>([]);
  const [poblacionRows, setPoblacionRows] = useState<PoblacionBucket[]>([]);
  const [deptRows, setDeptRows] = useState<DepartamentoStat[]>([]);

  const { announce } = useAnnouncer();

  useEffect(() => {
    Promise.all([
      computeResumenStats(ubigeoPrefix),
      computePueblosStats(ubigeoPrefix),
      computePoblacionBuckets(ubigeoPrefix),
      computeDepartamentoStats(ubigeoPrefix),
    ]).then(([s, p, pb, d]) => {
      setStats(s);
      setPueblosRows(p);
      setPoblacionRows(pb);
      setDeptRows(d);
      announce('Estadísticas actualizadas.');
    });
  }, [ubigeoPrefix, announce]);

  const chartEntries = useMemo(() => {
    const sorted = [...pueblosRows].sort((a, b) => b.localidadesCount - a.localidadesCount);
    const totalLocalidades = sorted.reduce((s, p) => s + p.localidadesCount, 0);
    const topN = sorted.slice(0, OTROS_OFFSET);
    const hasOtros = sorted.length > OTROS_OFFSET;
    const otrosCount = hasOtros
      ? sorted.slice(OTROS_OFFSET).reduce((s, p) => s + p.localidadesCount, 0)
      : 0;
    const entries = hasOtros
      ? [...topN, { nombre: 'Otros', familiaLinguistica: 'Diversas', localidadesCount: otrosCount, centrosPobladosCount: 0, poblacionTotal: 0, porcentajePoblacion: 0, hablantes: 0 }]
      : topN;
    return { entries, totalLocalidades };
  }, [pueblosRows]);

  const handleRegionClick = (deptCode: string) => {
    if (selectedRegion === deptCode) {
      setSelectedRegion(null);
      announce('Selección eliminada.');
    } else {
      setSelectedRegion(deptCode);
      const dept = deptRows.find((d) => d.codigo === deptCode);
      if (dept) {
        announce(`${dept.nombre}: ${dept.localidades.toLocaleString()} localidades, ${dept.centrosPoblados.toLocaleString()} centros poblados, ${dept.porcentaje}% de hablantes indígenas.`);
      } else {
        announce('Región seleccionada.');
      }
    }
  };

  const selectedDept = selectedRegion ? deptRows.find((d) => d.codigo === selectedRegion) : undefined;

  const resumenCards = !stats ? [] : [
    {
      label: 'Total de Localidades',
      value: stats.totalLocalidades.toLocaleString(),
      sub: 'Registradas en el sistema',
      icon: MapPin,
      accent: 'border-l-sis-navy',
    },
    {
      label: 'Población Total',
      value: stats.poblacionTotalLocalidades.toLocaleString(),
      sub: 'Habitantes registrados',
      icon: Users,
      accent: 'border-l-green-500',
    },
    {
      label: 'Centros Poblados',
      value: stats.totalCentrosPoblados.toLocaleString(),
      sub: `${stats.centrosConPueblo} con pueblo indígena asignado`,
      icon: BarChart3,
      accent: 'border-l-blue-500',
    },
    {
      label: 'Con Educación',
      value: stats.conEscolarizado.toLocaleString(),
      sub: `${stats.totalLocalidades ? ((stats.conEscolarizado / stats.totalLocalidades) * 100).toFixed(1) : '--'}% del total`,
      icon: BookOpen,
      accent: 'border-l-sis-orange',
    },
    {
      label: 'Tituladas',
      value: stats.conTitulacion.toLocaleString(),
      sub: `${stats.totalLocalidades ? ((stats.conTitulacion / stats.totalLocalidades) * 100).toFixed(1) : '--'}% del total`,
      icon: GraduationCap,
      accent: 'border-l-purple-500',
    },
  ];

  const provinces = useMemo<Province[]>(() => {
    if (!departmentId) return [];
    return getProvincesByDepartmentId(departmentId);
  }, [departmentId]);

  const districts = useMemo<District[]>(() => {
    if (!provinceId) return [];
    return getDistrictsByProvinceId(provinceId);
  }, [provinceId]);

  function handleDepartmentChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDepartmentId(e.target.value);
    setProvinceId('');
    setDistrictId('');
    setPueblosPage(1);
  }

  function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setProvinceId(e.target.value);
    setDistrictId('');
    setPueblosPage(1);
  }

  function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDistrictId(e.target.value);
    setPueblosPage(1);
  }

  const colorMap: Record<string, string> = {
    Arawak: 'bg-green-500',
    Jivaroan: 'bg-blue-500',
    Panoan: 'bg-sis-orange',
    Quechuan: 'bg-purple-500',
    Aymaran: 'bg-yellow-500',
    Tupian: 'bg-red-500',
    'Peba-Yaguan': 'bg-teal-500',
    Cahuapanan: 'bg-indigo-500',
    Zaparoan: 'bg-pink-500',
    'Bora-Witotoan': 'bg-cyan-500',
    Diversas: 'bg-gray-500',
  };

  if (!stats) {
    return (
      <>
        <HeroBanner
          title="Estadísticas de Localidades Indígenas"
          subtitle="Datos actualizados al censo"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/pueblos-indigenas')}
            className="text-sis-navy hover:text-sis-link font-medium text-sm mb-8 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al buscador
          </button>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sis-navy"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroBanner
        title="Estadísticas de Localidades Indígenas"
        subtitle="Datos actualizados al censo"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back link */}
        <button
          onClick={() => navigate('/pueblos-indigenas')}
          className="text-sis-navy hover:text-sis-link font-medium text-sm mb-8 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al buscador
        </button>

        {/* Header + filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-sis-navy">Panel de Estadísticas</h2>
            <p className="text-sm text-sis-text-light">Generado desde los datos censales</p>
          </div>
          <div className="flex items-center gap-2">
            <a className="bg-sis-navy hover:bg-sis-navy-light text-white font-medium py-2 px-4 rounded text-sm transition-colors flex items-center gap-1.5"
              href="/data/excel/5660105-rm-020-2018-mc_sig.xlsx">
              <Download className="w-3.5 h-3.5" />
              Descargar Reporte Completo
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-sis-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex flex-wrap gap-3">
              <select
                className="border border-sis-border rounded-md py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={departmentId}
                onChange={handleDepartmentChange}
              >
                <option value="">Todos los departamentos</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <select
                className="border border-sis-border rounded-md py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={provinceId}
                onChange={handleProvinceChange}
                disabled={!departmentId}
              >
                <option value="">Todas las provincias</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                className="border border-sis-border rounded-md py-1.5 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={districtId}
                onChange={handleDistrictChange}
                disabled={!provinceId}
              >
                <option value="">Todos los distritos</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-sis-text-light">Última actualización: censo</span>
            </div>
          </div>
        </div>

        {/* Resumen cards */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
          {resumenCards.map((card) => (
            <div
              key={card.label}
              className={`flex-1 min-w-[180px] bg-white rounded-lg border border-sis-border p-4 ${card.accent} border-l-4 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-sis-text-light">{card.label}</span>
                <card.icon className="w-5 h-5 text-sis-text-light" />
              </div>
              <div className="text-2xl font-bold text-sis-navy">{card.value}</div>
              <div className="text-xs text-sis-text-light mt-1">{card.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Distribución por rango de población */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-sis-navy">Distribución por Rango de Población</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sis-border">
                    {['Rango', 'N° de Localidades', '%', 'Acumulado %'].map((h) => (
                      <th key={h} className="text-left font-semibold text-sis-navy px-3 py-3" scope="col">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {poblacionRows.map((r) => (
                    <tr key={r.rango} className="border-b border-sis-border hover:bg-gray-50">
                      <td className="px-3 py-3 text-sis-navy">{r.rango}</td>
                      <td className="px-3 py-3 text-sis-text-light">{r.localidades.toLocaleString()}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sis-navy rounded-full"
                              style={{ width: `${r.porcentaje}%` }}
                            />
                          </div>
                          <span className="text-sis-text-light">{r.porcentaje}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sis-text-light">{r.acumulado}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Distribución por pueblo indígena en localidades (Gráfico) */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-sis-navy flex items-center gap-2">
                <Users className="w-5 h-5 text-sis-text-light" />
                Distribución por Pueblo Indígena (Centros poblados)
              </h3>
            </div>
            {(() => {
              const { entries, totalLocalidades } = chartEntries;
              const R = 15.9;
              const C = 2 * Math.PI * R;
              const palette = ['#1a3a5c', '#22c55e', '#e07020', '#8b5cf6', '#eab308', '#6b7280', '#f97316', '#3b82f6', '#ec4899', '#14b8a6', '#db2777', '#10b981'];
              const segments = entries.map((entry, i) => {
                const pct = totalLocalidades > 0 ? (entry.localidadesCount / totalLocalidades) * 100 : 0;
                const arc = (pct / 100) * C;
                const prevPcts = entries.slice(0, i).reduce((sum, e) => sum + (totalLocalidades > 0 ? (e.localidadesCount / totalLocalidades) * 100 : 0), 0);
                const offset = C / 4 - (prevPcts / 100) * C;
                return { ...entry, pct, arc, offset, color: palette[i % palette.length] };
              });
              return (
                <>
                  <div className="flex items-center justify-center h-48">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        {segments.map((seg, i) => (
                          <circle
                            key={i}
                            cx="18"
                            cy="18"
                            r={R}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth="3.5"
                            strokeDasharray={`${seg.arc} ${C - seg.arc}`}
                            strokeDashoffset={seg.offset}
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-sis-navy">{totalLocalidades.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center mt-4">
                    {segments.map((seg) => (
                      <div key={seg.nombre} className="flex items-center gap-1.5 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
                        <span className="text-sis-text-light">{seg.nombre} ({seg.pct.toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Distribución por departamentos + Mapa de calor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-bold text-sis-navy">Mapa de Calor — Localidades por Departamento</h3>
              <div
                className="inline-flex items-center rounded border border-sis-border overflow-hidden"
                role="group"
                aria-label="Cambiar el modo de visualización del mapa"
              >
                <button
                  type="button"
                  onClick={() => { if (view3D) toggleView(); }}
                  aria-pressed={!view3D}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-colors ${!view3D ? 'bg-sis-navy text-white' : 'bg-white text-sis-navy hover:bg-sis-bg'}`}
                >
                  <MapIcon className="w-4 h-4" aria-hidden="true" />
                  2D
                </button>
                <button
                  type="button"
                  onClick={() => { if (!view3D) toggleView(); }}
                  aria-pressed={view3D}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-colors border-l border-sis-border ${view3D ? 'bg-sis-navy text-white' : 'bg-white text-sis-navy hover:bg-sis-bg'}`}
                >
                  <Box className="w-4 h-4" aria-hidden="true" />
                  3D / XR
                </button>
              </div>
            </div>
            <div
              className="h-[400px] w-full"
              role="region"
              aria-busy={view3D && loading3D}
              aria-label="Mapa de calor por departamento"
            >
              {view3D ? (
                <Suspense
                  fallback={
                    <div
                      className="flex items-center justify-center h-full"
                      role="status"
                      aria-live="polite"
                    >
                      <Spinner />
                    </div>
                  }
                >
                  <PeruMap3DLazy
                    deptRows={deptRows}
                    activeRegion={selectedRegion ?? undefined}
                    onRegionClick={handleRegionClick}
                  />
                </Suspense>
              ) : (
                <PeruMap
                  activeRegion={selectedRegion ?? undefined}
                  departmentFills={computeDepartmentHeatColors(deptRows) as Record<string, string>}
                  departmentStrokes={Object.fromEntries(deptRows.map((r) => [r.codigo, '#166534'])) as Record<string, string>}
                  departmentOpacities={Object.fromEntries(deptRows.map((r) => [r.codigo, 0.9])) as Record<string, number>}
                  onRegionClick={handleRegionClick}
                  title={null}
                  width={600}
                  height={400}
                />
              )}
            </div>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-2 text-xs text-sis-text-light">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f0fdf4' }} />
                <span>Bajo</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-sis-text-light">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#15803d' }} />
                <span>Alto</span>
              </div>
            </div>

            {selectedDept && (
              <div className="mt-4 border border-sis-border rounded-lg p-4 bg-sis-bg/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sis-navy text-sm">{selectedDept.nombre}</h4>
                  <button
                    onClick={() => setSelectedRegion(null)}
                    className="text-sis-text-light hover:text-sis-navy text-xs"
                    aria-label="Cerrar detalles"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-sis-text-light text-xs">Localidades</p>
                    <p className="font-semibold text-sis-navy">{selectedDept.localidades.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sis-text-light text-xs">Centros Poblados</p>
                    <p className="font-semibold text-sis-navy">{selectedDept.centrosPoblados.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sis-text-light text-xs">Población</p>
                    <p className="font-semibold text-sis-navy">{selectedDept.poblacion.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sis-text-light text-xs">% del Total</p>
                    <p className="font-semibold text-sis-navy">{selectedDept.porcentaje}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sis-navy">Distribución por Departamentos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sis-border">
                    {['Departamento', 'N° Localidades', 'Centros Poblados', 'Población', '%'].map((h) => (
                      <th key={h} className="text-left font-semibold text-sis-navy px-3 py-3" scope="col">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {deptRows.map((r) => (
                    <tr key={r.codigo} className={"border-b border-sis-border hover:bg-gray-50" + (selectedRegion === r.codigo ? " bg-gray-100" : "")}
                      onClick={() => handleRegionClick(r.codigo)}
                      >
                      <td className="px-3 py-3 text-sis-navy">{r.nombre}</td>
                      <td className="px-3 py-3 text-sis-text-light">{r.localidades.toLocaleString()}</td>
                      <td className="px-3 py-3 text-sis-text-light">{r.centrosPoblados.toLocaleString()}</td>
                      <td className="px-3 py-3 text-sis-text-light">{r.poblacion.toLocaleString()}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${r.porcentaje}%` }} />
                          </div>
                          <span className="text-sis-text-light">{r.porcentaje}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Distribución por pueblo indígena */}
        <div className="bg-white rounded-lg border border-sis-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sis-navy">Distribución por Pueblo Indígena (Localidades)</h3>
            <span className="text-sm text-sis-text-light">
              Mostrando {pueblosRows.length > 0 ? `${(pueblosPage - 1) * pueblosPageSize + 1}-${Math.min(pueblosPage * pueblosPageSize, pueblosRows.length)}` : '0'} de {pueblosRows.length.toLocaleString()}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sis-border">
                  {['Pueblo Indígena', 'Familia Lingüística', 'Hablantes', 'N° Localidades', '% del Total'].map((h) => (
                    <th key={h} className="text-left font-semibold text-sis-navy px-3 py-3" scope="col">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pueblosRows.slice((pueblosPage - 1) * pueblosPageSize, pueblosPage * pueblosPageSize).map((p) => (
                  <tr key={p.nombre} className="border-b border-sis-border hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${colorMap[p.familiaLinguistica] || 'bg-gray-500'}`} />
                        <span className="font-medium text-sis-navy">{p.nombre}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sis-text-light">{p.familiaLinguistica}</td>
                    <td className="px-3 py-3 text-sis-text-light">{p.hablantes.toLocaleString()}</td>
                    <td className="px-3 py-3 text-sis-text-light">{p.localidadesCount.toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colorMap[p.familiaLinguistica] || 'bg-gray-500'}`}
                            style={{ width: `${p.porcentajePoblacion}%` }}
                          />
                        </div>
                        <span className="text-sis-text-light">{p.porcentajePoblacion}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pueblosPage}
            totalPages={Math.max(1, Math.ceil(pueblosRows.length / pueblosPageSize))}
            onPageChange={setPueblosPage}
            pageSize={pueblosPageSize}
            onPageSizeChange={(size) => { setPueblosPageSize(size); setPueblosPage(1); }}
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/pueblos-indigenas')}
            className="text-sis-navy hover:text-sis-link font-medium text-sm flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al buscador
          </button>
        </div>
      </div>
    </>
  );
}
