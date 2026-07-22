import { useState, useMemo, useCallback, useRef } from 'react';
import { useAnnouncer } from '../hooks/useAnnouncer';
import { HeroBanner } from '../components/HeroBanner';
import { List, MapPin, RotateCcw, Calendar, MapPinned, MapPinHouse, Download, Search } from 'lucide-react';
import type { Province, District } from '../types/ubigeo';
import {
  getAllDepartments,
  getProvincesByDepartmentId,
  getDistrictsByProvinceId,
  findDistrictById,
} from '../services/ubigeoService';
import { getAllUleRecords } from '../services/uleService';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import { AccessibleMarker } from '../components/AccessibleMarker';
import { Pagination } from '../components/Pagination';
import L from 'leaflet';
import type { LocalEmpadronamiento } from '../types/local_empadronamiento';

function createUleIcon() {
  return L.divIcon({
    className: 'custom-marker',
    html: `\u003cdiv style="background-color:#e07020;width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"\u003e\u003c/div\u003e`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
}

function MapUpdater({ results }: { results: LocalEmpadronamiento[] }) {
  const map = useMap();
  const valid = results.filter((r) => r.lat !== undefined && r.lng !== undefined && r.lat !== 0 && r.lng !== 0);
  if (valid.length > 0) {
    const group = L.featureGroup(valid.map((r) => L.marker([r.lat!, r.lng!])));
    map.fitBounds(group.getBounds().pad(0.05));
  }
  return null;
}

function normalizeDay(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const allDays = [
  { key: 'lunes', label: 'Lu', full: 'Lunes' },
  { key: 'martes', label: 'Ma', full: 'Martes' },
  { key: 'miercoles', label: 'Mi', full: 'Miércoles' },
  { key: 'jueves', label: 'Ju', full: 'Jueves' },
  { key: 'viernes', label: 'Vi', full: 'Viernes' },
  { key: 'sabado', label: 'Sá', full: 'Sábado' },
  { key: 'domingo', label: 'Do', full: 'Domingo' },
];

function DiasAtencion({ dias }: { dias: string }) {

  const normalized = normalizeDay(dias);
  const activeIndices = allDays
    .map((d, i) => (normalized.includes(d.key) ? i : -1))
    .filter((i) => i !== -1);

  // Build human-readable summary
  function buildSummary(indices: number[]): string {
    if (indices.length === 0) return 'No especificado';
    if (indices.length === 1) return allDays[indices[0]].full;

    // Find contiguous ranges
    const ranges: [number, number][] = [];
    let start = indices[0];
    let end = indices[0];
    for (let i = 1; i < indices.length; i++) {
      if (indices[i] === end + 1) {
        end = indices[i];
      } else {
        ranges.push([start, end]);
        start = indices[i];
        end = indices[i];
      }
    }
    ranges.push([start, end]);

    const parts = ranges.map(([s, e]) => {
      if (s === e) return allDays[s].full;
      if (e === s + 1) return `${allDays[s].full} y ${allDays[e].full}`;
      return `${allDays[s].full} a ${allDays[e].full}`;
    });

    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1];
  }

  const summary = buildSummary(activeIndices);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-sis-text-light">{summary}</span>
      <div className="flex items-center gap-1">
        {allDays.map((day, idx) => {
          const isActive = activeIndices.includes(idx);
          return (
            <span
              key={day.key}
              title={day.full}
              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold leading-none select-none ${
                isActive
                  ? 'bg-sis-navy text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {day.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

interface MapFocusProps {
  target: LocalEmpadronamiento | null;
  markerRefs: React.RefObject<Map<string, L.Marker> | null>;
  onDone: () => void;
}

function MapFocus({ target, markerRefs, onDone }: MapFocusProps) {
  const map = useMap();

  useMemo(() => {
    if (!target || !markerRefs?.current) return;
    const marker = markerRefs.current.get(target.codigo);
    if (marker && target.lat && target.lng) {
      map.flyTo([target.lat, target.lng], 15, { duration: 1.5 });
      marker.openPopup();
    }
    onDone();
  }, [target, markerRefs, map, onDone]);

  return null;
}

const allLocalidades: LocalEmpadronamiento[] = getAllUleRecords().map((r) => {
  const district = findDistrictById(r.ubigeo);
  return {
    codigo: `ULE-${r.ubigeo}`,
    nombre: `${r.distrito} — ${r.provincia}, ${r.departamento}`,
    dias: r.dias_atencion,
    correo: 'No disponible',
    referencia: r.referencia,
    telefono: 'No disponible',
    direccion: r.direccion_ule,
    ubigeo: r.ubigeo,
    departamento: r.departamento,
    provincia: r.provincia,
    distrito: r.distrito,
    lat: r.lat || district?.lat,
    lng: r.lng || district?.lng,
  };
});

export default function LocalesEmpadronamiento() {
  const departments = useMemo(() => getAllDepartments(), []);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  const [departmentId, setDepartmentId] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<LocalEmpadronamiento[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [focusLoc, setFocusLoc] = useState<LocalEmpadronamiento | null>(null);
  const { announce } = useAnnouncer();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const provinces = useMemo<Province[]>(() => {
    if (!departmentId) return [];
    return getProvincesByDepartmentId(departmentId);
  }, [departmentId]);

  const districts = useMemo<District[]>(() => {
    if (!provinceId) return [];
    return getDistrictsByProvinceId(provinceId);
  }, [provinceId]);

  const selectedDepartment = departments.find((d) => d.id === departmentId);
  const selectedProvince = provinces.find((p) => p.id === provinceId);
  const selectedDistrict = districts.find((d) => d.id === districtId);

  const handleDepartmentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setDepartmentId(id);
    setProvinceId('');
    setDistrictId('');
  }, []);

  const handleProvinceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setProvinceId(id);
    setDistrictId('');
  }, []);

  const handleDistrictChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrictId(e.target.value);
  }, []);

  function handleLimpiar() {
    setDepartmentId('');
    setProvinceId('');
    setDistrictId('');
    setBusqueda('');
    setResultados([]);
    setHasSearched(false);
    setFocusLoc(null);
    setCurrentPage(1);
    announce('Filtros limpiados.');
  }

  function handleBuscar() {
    let filtered = allLocalidades;

    if (departmentId && selectedDepartment) {
      const deptName = selectedDepartment.name.toUpperCase();
      filtered = filtered.filter((l) => l.departamento?.toUpperCase() === deptName);
    }
    if (provinceId && selectedProvince) {
      const provName = selectedProvince.name.toUpperCase();
      filtered = filtered.filter((l) => l.provincia?.toUpperCase() === provName);
    }
    if (districtId && selectedDistrict) {
      const distName = selectedDistrict.name.toUpperCase();
      filtered = filtered.filter((l) => l.distrito?.toUpperCase() === distName);
    }

    if (busqueda.trim()) {
      const q = busqueda.trim().toLowerCase();
      filtered = filtered.filter((l) =>
        l.nombre.toLowerCase().includes(q) ||
        l.direccion.toLowerCase().includes(q) ||
        l.referencia.toLowerCase().includes(q) ||
        l.codigo.toLowerCase().includes(q)
      );
    }

    setResultados(filtered);
    setHasSearched(true);
    setFocusLoc(null);
    setCurrentPage(1);
    if (filtered.length > 0) {
      announce('Búsqueda completada. ' + filtered.length + ' locales de empadronamiento encontrados.');
    } else {
      announce('Búsqueda completada. No se encontraron locales para los filtros seleccionados.');
    }
  }

  function handleVerEnMapa(loc: LocalEmpadronamiento) {
    setFocusLoc(loc);
    mapContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const locationText = [selectedDepartment?.name, selectedProvince?.name, selectedDistrict?.name]
    .filter(Boolean)
    .join(' - ') || 'Todo el Perú';

  const totalPages = Math.max(1, Math.ceil(resultados.length / pageSize));
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return resultados.slice(start, start + pageSize);
  }, [resultados, currentPage, pageSize]);

  const validResults = resultados.filter((r) => r.lat !== undefined && r.lng !== undefined && r.lat !== 0 && r.lng !== 0);

  return (
    <>
      <HeroBanner
        title="Buscador de locales de empadronamiento (ULEs)"
        subtitle="Ubica un local cerca a tu ubicación a nivel nacional"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-sis-border p-6 mb-6">
          <div className="text-sis-navy font-semibold mb-4">
            <span>Filtros de búsqueda</span>
            {hasSearched && (
              <span className="ml-2 text-xs font-normal text-sis-text-light">
                ({resultados.length} resultados)
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-sis-navy mb-1">Departamento</label>
              <select
                className="w-full border border-sis-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30 bg-white"
                value={departmentId}
                onChange={handleDepartmentChange}
              >
                <option value="">Todos</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-sis-navy mb-1">Provincia</label>
              <select
                className="w-full border border-sis-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30 bg-white"
                value={provinceId}
                onChange={handleProvinceChange}
                disabled={!departmentId}
              >
                <option value="">Todos</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-sis-navy mb-1">Distrito</label>
              <select
                className="w-full border border-sis-border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30 bg-white"
                value={districtId}
                onChange={handleDistrictChange}
                disabled={!provinceId}
              >
                <option value="">Todos</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-sis-navy mb-1">Buscar por nombre o dirección</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-sis-text-light" aria-hidden="true" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ej: Chachapoyas, Plaza de Armas..."
                  className="w-full border border-sis-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleBuscar}
              className="bg-sis-orange cursor-pointer hover:bg-sis-orange-hover text-white text-sm font-semibold py-2 px-5 rounded transition-colors inline-flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
            <button
              onClick={handleLimpiar}
              className="border border-sis-border cursor-pointer hover:bg-sis-bg text-sis-text text-sm font-semibold py-2 px-4 rounded transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Limpiar
            </button>
            <a href="/data/excel/5660058-directorio-nacional-ule-2024-14-6-24.xlsx" className="text-sis-navy text-sm text-bold py-2 px-4 rounded transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Descargar Reporte Completo
            </a>
            <div className="ml-auto text-xs text-sis-text-light">
              {locationText}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-sis-text-light">Vista:</span>
            <button className="p-1.5 rounded text-sis-red bg-red-50">
              <List className="w-5 h-5" />
            </button>
            <button className="p-1.5 rounded text-gray-400 hover:text-sis-navy">
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map + Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Leaflet Map */}
          <div ref={mapContainerRef} className="lg:col-span-2 bg-white rounded-lg border border-sis-border overflow-hidden h-[500px] relative">
            <MapContainer
              center={[-9.19, -75.015]}
              zoom={5}
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {validResults.map((loc) => (
                <AccessibleMarker
                  key={loc.codigo}
                  position={[loc.lat!, loc.lng!]}
                  icon={createUleIcon()}
                  ariaLabel={loc.nombre}
                  markerRef={(marker) => {
                    if (marker) {
                      markerRefs.current.set(loc.codigo, marker);
                    }
                  }}
                >
                  <Popup>
                    <div className="text-sm min-w-[180px]">
                      <p className="font-bold text-sis-navy mb-1">{loc.nombre}</p>
                      <p className="text-sis-text-light">{loc.direccion}</p>
                      <div className="text-sis-text-light mt-1">
                        <span className="font-medium text-sis-navy">Días:</span>
                        <DiasAtencion dias={loc.dias} />
                      </div>
                      <p className="text-sis-text-light">
                        <span className="font-medium text-sis-navy">Referencia:</span> {loc.referencia}
                      </p>
                    </div>
                  </Popup>
                </AccessibleMarker>
              ))}
              {hasSearched && validResults.length > 0 && (
                <MapUpdater results={validResults} />
              )}
              <MapFocus
                target={focusLoc}
                markerRefs={markerRefs}
                onDone={() => setFocusLoc(null)}
              />
            </MapContainer>
          </div>

          {/* Cards list */}
          <div className="lg:col-span-3 space-y-4">
            {!hasSearched ? (
              <div className="bg-white rounded-lg border border-sis-border p-8 text-center">
                <Search className="w-10 h-10 text-sis-text-light/50 mx-auto mb-3" />
                <p className="text-sis-text-light text-sm font-medium">
                  Ingrese los datos del centro y haga clic en Buscar
                </p>
              </div>
            ) : resultados.length === 0 ? (
              <div className="bg-white rounded-lg border border-sis-border p-8 text-center">
                <p className="text-sis-text-light text-sm">No se encontraron locales para los filtros seleccionados.</p>
              </div>
            ) : (
              paginatedResults.map((loc) => (
                <div key={loc.codigo} className="bg-white rounded-lg border border-sis-border p-5 relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-sis-green text-white text-xs font-bold px-2 py-0.5 rounded">
                        {loc.codigo}
                      </span>
                      <h3 className="font-bold text-sis-navy">{loc.nombre}</h3>
                    </div>
                    {loc.lat && loc.lng && loc.lat !== 0 && loc.lng !== 0 ? (
                      <button
                        onClick={() => handleVerEnMapa(loc)}
                        className="text-sm text-sis-sky-blue hover:underline flex items-center gap-1 shrink-0"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Ver en mapa
                      </button>
                    ) : (
                      <span className="text-sm text-sis-text-light/60 flex items-center gap-1 shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                        Sin coordenadas
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-sis-text-light shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-sis-navy">Días de atención:</span>
                        <DiasAtencion dias={loc.dias} />
                      </div>
                    </div>
                    {/*<div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 text-sis-text-light shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-sis-navy">Teléfono:</span>{' '}
                        <span className="text-sis-text-light">{loc.telefono}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-sis-text-light shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-sis-navy">Correo:</span>{' '}
                        <span className="text-sis-text-light">{loc.correo}</span>
                      </div>
                    </div>*/}
                    <div className="flex items-start gap-2">
                      <MapPinHouse className="w-4 h-4 text-sis-text-light shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-sis-navy">Dirección:</span>{' '}
                        <span className="text-sis-text-light">{loc.direccion}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 md:col-span-2">
                      <MapPinned className="w-4 h-4 text-sis-text-light shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-sis-navy">Referencia:</span>{' '}
                        <span className="text-sis-text-light">{loc.referencia}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {hasSearched && resultados.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                pageSize={pageSize}
                pageSizeOptions={[5,10]}
                onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
