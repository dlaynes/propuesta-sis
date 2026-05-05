import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import {
  BarChart3,
  Download,
  MapPin,
  Users,
  BookOpen,
  GraduationCap,
  ArrowLeft,
} from 'lucide-react';
import type { Province, District } from '../types/ubigeo';
import {
  getAllDepartments,
  getProvincesByDepartmentId,
  getDistrictsByProvinceId,
} from '../services/ubigeoService';

const resumenCards = [
  {
    label: 'Total de Localidades',
    value: '2,847',
    sub: 'Registradas en el sistema',
    icon: MapPin,
    accent: 'border-l-sis-navy',
  },
  {
    label: 'Población Total',
    value: '456,892',
    sub: 'Habitantes registrados',
    icon: Users,
    accent: 'border-l-green-500',
  },
  {
    label: 'Centros Poblados',
    value: '1,523',
    sub: '53.5% del total',
    icon: BarChart3,
    accent: 'border-l-blue-500',
  },
  {
    label: 'Con EIB',
    value: '1,890',
    sub: '66.4% del total',
    icon: BookOpen,
    accent: 'border-l-sis-orange',
  },
  {
    label: 'Tituladas',
    value: '1,245',
    sub: '43.7% del total',
    icon: GraduationCap,
    accent: 'border-l-purple-500',
  },
];

const poblacionRows = [
  { rango: '0 - 500', localidades: '1,245', porcentaje: 43.7, acumulado: 43.7 },
  { rango: '501 - 1,000', localidades: '623', porcentaje: 21.9, acumulado: 65.6 },
  { rango: '1,001 - 2,000', localidades: '456', porcentaje: 16.0, acumulado: 81.6 },
  { rango: '2,001 - 5,000', localidades: '312', porcentaje: 11.0, acumulado: 92.6 },
  { rango: '5,001 - 10,000', localidades: '156', porcentaje: 5.5, acumulado: 98.1 },
  { rango: 'Más de 10,000', localidades: '55', porcentaje: 1.9, acumulado: 100.0 },
];

const pueblosRows = [
  { pueblo: 'Asháninka', familias: 'Aruak', hablantes: '97,000', localidades: '892', porcentaje: 31.3, color: 'bg-green-500' },
  { pueblo: 'Awajún', familias: 'Jíbara', hablantes: '65,000', localidades: '623', porcentaje: 21.9, color: 'bg-blue-500' },
  { pueblo: 'Shipibo-Konibo', familias: 'Pano', hablantes: '45,000', localidades: '445', porcentaje: 15.6, color: 'bg-sis-orange' },
  { pueblo: 'Quechua', familias: 'Quechua', hablantes: '78,000', localidades: '356', porcentaje: 12.5, color: 'bg-purple-500' },
  { pueblo: 'Aymara', familias: 'Aymara', hablantes: '34,000', localidades: '234', porcentaje: 8.2, color: 'bg-yellow-500' },
  { pueblo: 'Otros', familias: 'Diversas', hablantes: '156,892', localidades: '297', porcentaje: 10.4, color: 'bg-gray-500' },
];

export default function PueblosIndigenasEstadisticas() {
  const navigate = useNavigate();
  const departments = useMemo(() => getAllDepartments(), []);

  const [departmentId, setDepartmentId] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');

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
  }

  function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setProvinceId(e.target.value);
    setDistrictId('');
  }

  function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDistrictId(e.target.value);
  }

  return (
    <>
      <HeroBanner
        title="Estadísticas de Localidades Indígenas"
        subtitle="Datos actualizados al 2026"
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
            <p className="text-sm text-sis-text-light">Generado el 22 de abril de 2026 | Período: 2020 - 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-sis-navy hover:bg-sis-navy-light text-white font-medium py-2 px-4 rounded text-sm transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Descargar Reporte Completo
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-sis-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-sis-navy">Filtrar por:</span>
            <select
              id="stat-departamento"
              aria-label="Departamento"
              value={departmentId}
              onChange={handleDepartmentChange}
              className="border border-sis-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
            >
              <option value="">-- Todos los Departamentos --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select
              id="stat-provincia"
              aria-label="Provincia"
              value={provinceId}
              onChange={handleProvinceChange}
              disabled={!departmentId}
              className="border border-sis-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">-- Todas las Provincias --</option>
              {provinces.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <select
              id="stat-distrito"
              aria-label="Distrito"
              value={districtId}
              onChange={handleDistrictChange}
              disabled={!provinceId}
              className="border border-sis-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30 disabled:bg-gray-100 disabled:text-gray-400"
            >
              <option value="">-- Todos los Distritos --</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select id="stat-periodo" aria-label="Período" className="border border-sis-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30">
              <option>Período: 2020 - 2026</option>
            </select>
            <button className="bg-sis-red hover:bg-sis-red-hover text-white font-medium py-2 px-4 rounded text-sm transition-colors">
              Aplicar filtros
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {resumenCards.map((c) => (
            <div
              key={c.label}
              className={`bg-white rounded-lg border border-sis-border p-4 border-l-4 ${c.accent} shadow-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <c.icon className="w-5 h-5 text-sis-text-light" />
              </div>
              <p className="text-xs text-sis-text-light">{c.label}</p>
              <p className="text-xl font-bold text-sis-navy">{c.value}</p>
              <p className="text-xs text-sis-text-light">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribution by population */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-sis-navy flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sis-text-light" />
                Distribución por Población
              </h3>
            </div>
            <div className="h-48 flex items-end gap-2 justify-between px-2">
              {poblacionRows.map((r) => (
                <div key={r.rango} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full bg-sis-navy/80 rounded-t"
                    style={{ height: `${r.porcentaje * 2.5}px` }}
                  />
                  <span className="text-[10px] text-sis-text-light text-center leading-tight">{r.rango}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution by indigenous group */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center mb-4">
              <h3 className="font-bold text-sis-navy flex items-center gap-2">
                <Users className="w-5 h-5 text-sis-text-light" />
                Distribución por Pueblo Indígena
              </h3>
            </div>
            <div className="flex items-center justify-center h-48">
              {/* Donut simulation */}
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a3a5c" strokeWidth="3.5" strokeDasharray="31.3 68.7" strokeDashoffset="25" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeDasharray="21.9 78.1" strokeDashoffset="93.3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e07020" strokeWidth="3.5" strokeDasharray="15.6 84.4" strokeDashoffset="171.2" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8b5cf6" strokeWidth="3.5" strokeDasharray="12.5 87.5" strokeDashoffset="156.8" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#eab308" strokeWidth="3.5" strokeDasharray="8.2 91.8" strokeDashoffset="244.3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6b7280" strokeWidth="3.5" strokeDasharray="10.4 89.6" strokeDashoffset="332.1" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-sis-navy">2,847</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {pueblosRows.map((p) => (
                <div key={p.pueblo} className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${p.color}`} />
                  <span className="text-sis-text-light">{p.pueblo} ({p.porcentaje}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Population table */}
        <div className="bg-white rounded-lg border border-sis-border p-6 mb-8">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-sis-navy">Distribución de Población por Rangos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sis-border">
                  {['Rango de Población', 'N° Localidades', '% del Total', '% Acumulado'].map((h) => (
                    <th key={h} className="text-left font-semibold text-sis-navy px-3 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {poblacionRows.map((r) => (
                  <tr key={r.rango} className="border-b border-sis-border hover:bg-gray-50">
                    <td className="px-3 py-3 text-sis-navy">{r.rango}</td>
                    <td className="px-3 py-3 text-sis-text-light">{r.localidades}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-sis-navy rounded-full" style={{ width: `${r.porcentaje}%` }} />
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

        {/* Distribución por departamentos table */}
        <div className="bg-white rounded-lg border border-sis-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sis-navy">Distribución por Departamentos</h3>
            <div>
              <input id="search-departamento" aria-label="Buscar departamento" className="border border-sis-border rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Buscar departamento..." />      
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sis-border">
                  {['Departamento', 'N° Localidades', 'Centros Poblados', 'Población', '%'].map((h) => (
                    <th key={h} className="text-left font-semibold text-sis-navy px-3 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Aquí irían las filas dinámicas de departamentos */}
                <tr className="border-b border-sis-border hover:bg-gray-50">
                  <td className="px-3 py-3 text-sis-navy">Loreto</td>
                  <td className="px-3 py-3 text-sis-text-light">1,245</td>
                  <td className="px-3 py-3 text-sis-text-light">892</td>
                  <td className="px-3 py-3 text-sis-text-light">97,000</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `43.7%` }} />
                      </div>
                      <span className="text-sis-text-light">43.7%</span>
                    </div>
                  </td>
                </tr>
                {/* Más filas de departamentos... */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pueblo indigena table */}
        <div className="bg-white rounded-lg border border-sis-border p-6 mb-8">
          <div className="flex items-center mb-4">
            <h3 className="font-bold text-sis-navy">Distribución por Pueblo Indígena</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sis-border">
                  {['Pueblo Indígena', 'Familia Lingüística', 'Hablantes', 'N° Localidades', '% del Total'].map((h) => (
                    <th key={h} className="text-left font-semibold text-sis-navy px-3 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pueblosRows.map((p) => (
                  <tr key={p.pueblo} className="border-b border-sis-border hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${p.color}`} />
                        <span className="font-medium text-sis-navy">{p.pueblo}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sis-text-light">{p.familias}</td>
                    <td className="px-3 py-3 text-sis-text-light">{p.hablantes}</td>
                    <td className="px-3 py-3 text-sis-text-light">{p.localidades}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.porcentaje}%` }} />
                        </div>
                        <span className="text-sis-text-light">{p.porcentaje}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
