import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { Search, RotateCcw, TrendingUp, Users, TreePine, BarChart3, Download } from 'lucide-react';

const stats = [
  {
    title: 'Total Localidades',
    value: '2,847',
    badge: '+4.5% este año',
    icon: TreePine,
    color: 'border-l-green-500',
    badgeColor: 'text-green-600 bg-green-50',
  },
  {
    title: 'Centros Poblados',
    value: '1,523',
    badge: '53.5% del total',
    icon: Users,
    color: 'border-l-blue-500',
    badgeColor: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Pueblos Indígenas',
    value: '51',
    badge: '4 familias lingüísticas',
    icon: TrendingUp,
    color: 'border-l-sis-orange',
    badgeColor: 'text-sis-orange bg-orange-50',
  },
  {
    title: 'Población Total',
    value: '456,892',
    badge: '+12.3% vs 2023',
    icon: BarChart3,
    color: 'border-l-purple-500',
    badgeColor: 'text-purple-600 bg-purple-50',
  },
];

const rows = [
  {
    nombre: 'Marankiari Bajo',
    pueblo: 'Asháninka',
    departamento: 'Junín',
    distrito: 'Perené',
    tipo: 'Comunidad Nativa',
    tipoColor: 'bg-green-100 text-green-700',
    poblacion: '1,245',
    lengua: 78,
    eib: 'Sí',
    eibColor: 'bg-green-100 text-green-700',
  },
  {
    nombre: 'Urakusa',
    pueblo: 'Awajún',
    departamento: 'Amazonas',
    distrito: 'Nieva',
    tipo: 'Comunidad Nativa',
    tipoColor: 'bg-green-100 text-green-700',
    poblacion: '892',
    lengua: 92,
    eib: 'Sí',
    eibColor: 'bg-green-100 text-green-700',
  },
  {
    nombre: 'San Francisco de Yarinacocha',
    pueblo: 'Shipibo-Konibo',
    departamento: 'Ucayali',
    distrito: 'Yarinacocha',
    tipo: 'Comunidad Nativa',
    tipoColor: 'bg-green-100 text-green-700',
    poblacion: '2,156',
    lengua: 65,
    eib: 'Sí',
    eibColor: 'bg-green-100 text-green-700',
  },
  {
    nombre: 'Pampa Michi',
    pueblo: 'Asháninka',
    departamento: 'Pasco',
    distrito: 'Puerto Bermúdez',
    tipo: 'Caserío',
    tipoColor: 'bg-orange-100 text-orange-700',
    poblacion: '324',
    lengua: 45,
    eib: 'No',
    eibColor: 'bg-red-100 text-red-700',
  },
  {
    nombre: 'Nazareth',
    pueblo: 'Awajún',
    departamento: 'Amazonas',
    distrito: 'Imaza',
    tipo: 'Comunidad Nativa',
    tipoColor: 'bg-green-100 text-green-700',
    poblacion: '1,567',
    lengua: 88,
    eib: 'Sí',
    eibColor: 'bg-green-100 text-green-700',
  },
  {
    nombre: 'Caco Macaya',
    pueblo: 'Shipibo-Konibo',
    departamento: 'Ucayali',
    distrito: 'Iparia',
    tipo: 'Comunidad Nativa',
    tipoColor: 'bg-green-100 text-green-700',
    poblacion: '678',
    lengua: 95,
    eib: 'Sí',
    eibColor: 'bg-green-100 text-green-700',
  },
];

export default function PueblosIndigenasConsulta() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');

  return (
    <>
      <HeroBanner
        title="Buscador de localidades indígenas"
        subtitle="Ubica tu localidad cerca a tu ubicación a nivel nacional"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
          {stats.map((s) => (
            <div
              key={s.title}
              className={`flex-1 min-w-[220px] bg-white rounded-lg border border-sis-border p-5 border-l-4 ${s.color} shadow-sm`}
            >
              <p className="text-sm text-sis-text-light mb-1">{s.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-sis-navy">{s.value}</span>
              </div>
              <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded ${s.badgeColor}`}>
                <s.icon className="w-3 h-3" />
                {s.badge}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-6 flex justify-center gap-2">
          <button
            onClick={() => navigate('/pueblos-indigenas/estadisticas')}
            className="bg-sis-red hover:bg-sis-red-hover text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Ver más datos estadísticos
          </button>

          <button className="bg-sis-navy hover:bg-sis-navy-light text-white font-medium py-2 px-4 rounded transition-colors flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Descargar Reporte Completo
          </button>
        </div>

        {/* Search filters */}
        <div className="bg-white rounded-lg border border-sis-border p-6 mb-6">
          <div className="flex items-center gap-2 text-sis-navy font-semibold mb-4">
            <Search className="w-4 h-4 text-sis-red" />
            <span>Buscador de Localidades</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label htmlFor="loc-nombre" className="block text-sm font-semibold text-sis-navy mb-1">Nombre de localidad</label>
              <input
                id="loc-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese nombre de localidad..."
                className="w-full border border-sis-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
              />
            </div>
            <div>
              <label htmlFor="loc-pueblo" className="block text-sm font-semibold text-sis-navy mb-1">Pueblo Indígena</label>
              <select id="loc-pueblo" className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label htmlFor="loc-eib" className="block text-sm font-semibold text-sis-navy mb-1">Educación Bilingüe (EIB)</label>
              <select id="loc-eib" className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label htmlFor="loc-tipo" className="block text-sm font-semibold text-sis-navy mb-1">Tipo de Localidad</label>
              <select id="loc-tipo" className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30">
                <option>Todos</option>
              </select>
            </div>
            <div>
              <label htmlFor="loc-titulada" className="block text-sm font-semibold text-sis-navy mb-1">Titulada</label>
              <select id="loc-titulada" className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30">
                <option>Todos</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-4 justify-end">
            <button className="bg-gray-100 hover:bg-gray-200 text-sis-text font-semibold py-2 px-6 rounded border border-sis-border transition-colors flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Limpiar
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-sis-border p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sis-navy" />
              <h3 className="font-bold text-sis-navy">Resultados de Búsqueda</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-sis-text-light">Mostrando 1-10 de 2,847 resultados</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sis-border">
                  {[
                    'Nombre de Localidad',
                    'Pueblo Indígena',
                    'Departamento',
                    'Distrito',
                    'Tipo',
                    'Población',
                    '% Lengua Nativa',
                    'EIB',
                    'Acción',
                  ].map((col) => (
                    <th
                      key={col}
                      className="text-left font-semibold text-sis-navy px-3 py-3 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.nombre} className="border-b border-sis-border hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 font-medium text-sis-navy">{row.nombre}</td>
                    <td className="px-3 py-3 text-sis-text-light">{row.pueblo}</td>
                    <td className="px-3 py-3 text-sis-text-light">{row.departamento}</td>
                    <td className="px-3 py-3 text-sis-text-light">{row.distrito}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${row.tipoColor}`}>
                        {row.tipo}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sis-text-light">{row.poblacion}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${row.lengua}%`,
                              backgroundColor: row.lengua >= 70 ? '#22c55e' : row.lengua >= 50 ? '#f59e0b' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className="text-xs text-sis-text-light">{row.lengua}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${row.eibColor}`}>
                        {row.eib}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => navigate('/pueblos-indigenas/localidad')}
                        className="text-sis-navy hover:text-sis-link text-xs font-medium underline"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-sis-text-light">Filas por página</span>
              <select id="rows-per-page" aria-label="Filas por página" className="border border-sis-border rounded px-2 py-1 text-sm bg-white">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              {['←', '1', '2', '3', '...', '285', '→'].map((p, i) => (
                <button
                  key={`${p}-${i}`}
                  className={`px-2 py-1 rounded min-w-[32px] ${
                    p === '1'
                      ? 'bg-sis-navy text-white'
                      : 'text-sis-navy hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
