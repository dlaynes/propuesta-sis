import { Search, RotateCcw, BarChart3 } from 'lucide-react';
import { useAnnouncer } from '../../hooks/useAnnouncer';
import { useState, useMemo, useEffect, startTransition } from 'react';
import { Spinner } from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '../../components/Pagination';
import {
  getAllLocalidades,
} from '../../services/localidadService';
import type { Localidad } from '../../types/localidad';
import { parseLocalidadInstituciones } from '../utils/functions';

interface LocalidadesProps { isActive?: boolean }

export const Localidades = ({ isActive }: LocalidadesProps) => {
  const [nombre, setNombre] = useState('');
  const [pueblo, setPueblo] = useState('');
  const [tipo, setTipo] = useState('');
  const [georeferenciada, setGeoreferenciada] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [records, setRecords] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { announce } = useAnnouncer();

  useEffect(() => {
    if (!isActive || records.length > 0) return;
    startTransition(() => setLoading(true));
    getAllLocalidades().then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, [isActive, records.length]);

  const pueblosOptions = useMemo(() => [...new Set(records.map((r) => r.pueblo_indigena))].sort(), [records]);
  const tiposOptions = useMemo(() => [...new Set(records.map((r) => r.tipo_localidad))].sort(), [records]);

  const filteredRows = useMemo(() => {
    let result = [...records];

    if (nombre.trim()) {
      result = result.filter((r) =>
        r.localidad.toLowerCase().includes(nombre.trim().toLowerCase())
      );
    }

    if (pueblo) {
      result = result.filter((r) => r.pueblo_indigena === pueblo);
    }

    if (tipo) {
      result = result.filter((r) => r.tipo_localidad === tipo);
    }

    if (georeferenciada) {
      result = result.filter((r) => r.comunidad_georeferenciada === georeferenciada);
    }

    return result;
  }, [records, nombre, pueblo, tipo, georeferenciada]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  useEffect(() => {
    if (filteredRows.length > 0) {
      announce(`${filteredRows.length} localidades encontradas.`);
    } else {
      announce('No se encontraron localidades para los filtros seleccionados.');
    }
  }, [filteredRows.length, announce]);

  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, filteredRows.length);

  function handleLimpiar() {
    setNombre('');
    setPueblo('');
    setTipo('');
    setGeoreferenciada('');
    setCurrentPage(1);
    setPageSize(10);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setCurrentPage(1);
  }

  function getLenguaPercent(row: Localidad): number {
    const lenguaPct = row.total_poblacion ? parseFloat(row.hablantes_alguna_lengua_indigena) / parseFloat(row.total_poblacion) || 0 : 0;
    return Math.round(lenguaPct * 100);
  }

  function getLenguaColor(pct: number): string {
    if (pct >= 70) return '#22c55e';
    if (pct >= 50) return '#f59e0b';
    return '#ef4444';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Search filters */}
      <div className="bg-white rounded-lg border border-sis-border p-6 mb-6">
        <div className="flex items-center gap-2 text-sis-navy font-semibold mb-4">
          <Search className="w-4 h-4 text-sis-red" />
          <span>Buscador de Localidades</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="sm:col-span-2">
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
            <select
              id="loc-pueblo"
              value={pueblo}
              onChange={(e) => setPueblo(e.target.value)}
              className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
            >
              <option value="">Todos</option>
              {pueblosOptions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="loc-tipo" className="block text-sm font-semibold text-sis-navy mb-1">Tipo de Localidad</label>
            <select
              id="loc-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
            >
              <option value="">Todos</option>
              {tiposOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="loc-geo" className="block text-sm font-semibold text-sis-navy mb-1">Georeferenciada</label>
            <select
              id="loc-geo"
              value={georeferenciada}
              onChange={(e) => setGeoreferenciada(e.target.value)}
              className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
            >
              <option value="">Todos</option>
              <option value="Sí">Sí</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-4 justify-end">
          <button
            onClick={handleLimpiar}
            className="bg-gray-100 hover:bg-gray-200 text-sis-text font-semibold py-2 px-6 rounded border border-sis-border transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar
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
            <span className="text-sm text-sis-text-light">
              Mostrando {filteredRows.length > 0 ? `${startIdx}-${endIdx}` : '0'} de {filteredRows.length.toLocaleString()} resultados
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sis-border">
                {[
                  'Nombre de Localidad',
                  'Pueblo Indígena',
                  'Tipo',
                  'Población',
                  '% Lengua Nativa',
                  'Educación',
                  'Georef.',
                  'Acción',
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left font-semibold text-sis-navy px-3 py-3 whitespace-nowrap"
                    scope="col"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((row) => {
                const lenguaPct = getLenguaPercent(row);
                const instituciones = parseLocalidadInstituciones(row);
                return (
                  <tr key={row.num} className="border-b border-sis-border hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 font-medium text-sis-navy">{row.localidad}</td>
                    <td className="px-3 py-3 text-sis-text-light">{row.pueblo_indigena}</td>
                    <td className="px-3 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded text-nowrap ${
                        row.tipo_localidad.toLowerCase().includes('nativa')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {row.tipo_localidad}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sis-text-light">{parseInt(row.total_poblacion, 10).toLocaleString()}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${lenguaPct}%`, backgroundColor: getLenguaColor(lenguaPct) }}
                          />
                        </div>
                        <span className="text-xs text-sis-text-light">{lenguaPct.toFixed(2)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sis-text-light">
                      {instituciones.educacion.filter(Boolean).filter(i => i !== '-').map((e) => (
                          <span key={e} className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-sis-navy/10 text-sis-navy border border-sis-navy/20 mr-1 mb-1">
                            {e}
                          </span>
                      ))}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${
                        row.comunidad_georeferenciada?.toLowerCase() === 'si'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {row.comunidad_georeferenciada === 'Si' ? 'Sí' : row.comunidad_georeferenciada || 'No'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        onClick={() => navigate('/pueblos-indigenas/localidad/'+row.num)}
                        className="text-sis-navy hover:text-sis-link text-xs font-medium underline cursor-pointer"
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </>
  );
};
