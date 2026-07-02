import { useState, useMemo, useEffect } from 'react';
import { useAnnouncer } from '../hooks/useAnnouncer';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import { AccessibleMarker } from '../components/AccessibleMarker';
import { HeroBanner } from '../components/HeroBanner';
import {
  ArrowLeft,
  MapPin,
  Users,
  BookOpen,
  TreePine,
  RotateCcw,
  Layers,
  Info,
  X,
} from 'lucide-react';
import type { Province, District } from '../types/ubigeo';
import {
  getAllDepartments,
  getProvincesByDepartmentId,
  getDistrictsByProvinceId,
  findDistrictById,
  findProvinceById,
  findDepartmentById,
} from '../services/ubigeoService';
import { getAllLocalidades } from '../services/localidadService';

import L from 'leaflet';


const COLOR_PALETTE = [
  '#22c55e', '#3b82f6', '#e07020', '#8b5cf6', '#eab308',
  '#ef4444', '#06b6d4', '#f97316', '#84cc16', '#d946ef',
  '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#14b8a6',
  '#f43f5e', '#0ea5e9', '#fbbf24', '#a855f7', '#16a34a',
];

function computePuebloColors(localidades: LocalidadMarker[]): Record<string, string> {
  const counts: Record<string, number> = {};
  for (const loc of localidades) {
    if (loc.pueblo && loc.pueblo !== '-') {
      counts[loc.pueblo] = (counts[loc.pueblo] || 0) + 1;
    }
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, COLOR_PALETTE.length);
  const colors: Record<string, string> = {};
  top.forEach(([pueblo], i) => {
    colors[pueblo] = COLOR_PALETTE[i];
  });
  colors['Otros'] = '#6b7280';
  return colors;
}

function isPuebloVisible(pueblo: string, puebloColors: Record<string, string>, activeLayers: string[]): boolean {
  if (activeLayers.includes(pueblo)) return true;
  if (!puebloColors[pueblo] && activeLayers.includes('Otros')) return true;
  return false;
}

function getPuebloColor(pueblo: string, puebloColors: Record<string, string>): string {
  return puebloColors[pueblo] || puebloColors.Otros;
}

interface LocalidadMarker {
  id: string;
  nombre: string;
  pueblo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  tipo: string;
  poblacion: number;
  eib: boolean;
  lat: number;
  lng: number;
}

function createCustomIcon(color: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -8],
  });
}

export default function PueblosIndigenasMapa() {
  const navigate = useNavigate();
  const { announce } = useAnnouncer();
  const departments = useMemo(() => getAllDepartments(), []);

  const [departmentId, setDepartmentId] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todas');
  const [selectedLocality, setSelectedLocality] = useState<LocalidadMarker | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [localidadesData, setLocalidadesData] = useState<LocalidadMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    getAllLocalidades().then((records) => {
      const mapped: LocalidadMarker[] = records
        .map((r) => {
          const district = findDistrictById(r.ubigeo_codigo.slice(0, 6));
          const province = district ? findProvinceById(district.province_id) : undefined;
          const department = province ? findDepartmentById(province.department_id) : undefined;
          const record = r as unknown as Record<string, unknown>;
          const lat = record.lat !== undefined ? Number(record.lat) : district?.lat;
          const lng = record.lng !== undefined ? Number(record.lng) : district?.lng;
          if (lat == null || lng == null) return null;
          const eib = (r.tipo_de_educacion_impartida_en_la_localidad || '')
            .toLowerCase()
            .includes('intercultural') ||
            (r.tipo_de_educacion_impartida_en_la_localidad || '')
            .toLowerCase()
            .includes('biling');
          return {
            id: r.num,
            nombre: r.localidad,
            pueblo: r.pueblo_indigena,
            departamento: department?.name || '',
            provincia: province?.name || '',
            distrito: district?.name || '',
            tipo: r.tipo_localidad,
            poblacion: parseInt(r.total_poblacion, 10) || 0,
            eib,
            lat,
            lng,
          };
        })
        .filter((m): m is LocalidadMarker => m !== null);
      setLocalidadesData(mapped);
      const colors = computePuebloColors(mapped);
      setActiveLayers(Object.keys(colors));
      setLoading(false);
    });
  }, []);

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

  function handleReset() {
    setDepartmentId('');
    setProvinceId('');
    setDistrictId('');
    setTipoFilter('Todas');
    setSelectedLocality(null);
    setActiveLayers(Object.keys(puebloColors));
    setShowAll(true);
    announce('Filtros restablecidos. Mostrando todos los marcadores y todos los pueblos.');
  }

  function toggleLayer(pueblo: string) {
    setActiveLayers((prev) =>
      prev.includes(pueblo) ? prev.filter((p) => p !== pueblo) : [...prev, pueblo]
    );
  }

  const puebloColors = computePuebloColors(localidadesData);

  const allPuebloKeys = Object.keys(puebloColors);
  const allSelected = allPuebloKeys.length > 0 && allPuebloKeys.every((p) => activeLayers.includes(p));

  function toggleAllLayers() {
    if (allSelected) {
      setActiveLayers([]);
      announce('Ningún pueblo indígena seleccionado en el mapa.');
    } else {
      setActiveLayers(allPuebloKeys);
      const total = allPuebloKeys.length;
      announce(
        `Mostrando los ${total} pueblos indígenas en el mapa.`
      );
    }
  }

  const filteredLocalidades = useMemo(() => {
    if (!showAll) return [] as LocalidadMarker[];
    return localidadesData.filter((loc) => {
      if (departmentId && loc.departamento !== departments.find((d) => d.id === departmentId)?.name) return false;
      if (provinceId && loc.provincia !== provinces.find((p) => p.id === provinceId)?.name) return false;
      if (districtId && loc.distrito !== districts.find((d) => d.id === districtId)?.name) return false;
      if (tipoFilter !== 'Todas' && loc.tipo !== tipoFilter) return false;
      if (!isPuebloVisible(loc.pueblo, puebloColors, activeLayers)) return false;
      return true;
    });
  }, [showAll, localidadesData, departmentId, provinceId, districtId, tipoFilter, activeLayers, puebloColors, departments, provinces, districts]);

  const stats = useMemo(() => {
    const total = filteredLocalidades.length;
    const conEib = filteredLocalidades.filter((l) => l.eib).length;
    const poblacion = filteredLocalidades.reduce((sum, l) => sum + l.poblacion, 0);
    return { total, conEib, poblacion };
  }, [filteredLocalidades]);

  useEffect(() => {
    announce(`${stats.total} localidades indígenas mostradas en el mapa.`);
  }, [stats.total, announce]);

  useEffect(() => {
    if (selectedLocality) {
      announce(`Localidad seleccionada: ${selectedLocality.nombre}, ${selectedLocality.distrito}, ${selectedLocality.departamento}.`);
    }
  }, [selectedLocality, announce]);

  const activeFilterCount = [
    departmentId,
    provinceId,
    districtId,
    tipoFilter !== 'Todas',
  ].filter(Boolean).length;

  if (loading) {
    return (
      <>
        <HeroBanner
          title="Mapa de Localidades Indígenas"
          subtitle="Cargando datos..."
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
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
        title="Mapa de Localidades Indígenas"
        subtitle="Visualiza la distribución geográfica de las localidades"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/pueblos-indigenas')}
          className="text-sis-navy hover:text-sis-link font-medium text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Localidades
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-sis-navy">Mapa Interactivo de localidades</h2>
            <p className="text-sm text-sis-text-light" aria-live="polite">
              {showAll
                ? `${stats.total} localidades visibles | ${stats.poblacion.toLocaleString()} habitantes`
                : `Marcadores ocultos | ${localidadesData.length} localidades disponibles`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="bg-white border border-sis-border hover:bg-gray-50 text-sis-navy font-medium py-2 px-4 rounded text-sm transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-sis-border p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-sis-navy">Filtrar por:</span>
            <select
              id="map-departamento"
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
              id="map-provincia"
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
              id="map-distrito"
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
            {/*<select
              id="map-tipo"
              aria-label="Tipo de localidad"
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="border border-sis-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
            >
              {tipoOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>*/}
            {activeFilterCount > 0 && (
              <span className="text-xs text-sis-text-light bg-sis-bg px-2 py-1 rounded">
                {activeFilterCount} filtro{activeFilterCount > 1 ? 's' : ''} activo{activeFilterCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-sis-border overflow-hidden">
              <div className="h-[600px] w-full relative">
                <MapContainer
                  center={[-9.19, -75.015]}
                  zoom={5}
                  scrollWheelZoom={true}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredLocalidades.map((loc) => (
                    <AccessibleMarker
                      key={loc.id}
                      position={[loc.lat, loc.lng]}
                      icon={createCustomIcon(getPuebloColor(loc.pueblo, puebloColors))}
                      ariaLabel={loc.nombre}
                      eventHandlers={{
                        click: () => setSelectedLocality(loc),
                      }}
                    >
                      <Popup>
                        <div className="text-sm min-w-[180px]">
                          <p className="font-bold text-sis-navy mb-1">{loc.nombre}</p>
                          <p className="text-sis-text-light">{loc.tipo}</p>
                          <p className="text-sis-text-light">{loc.distrito}, {loc.departamento}</p>
                          <p className="text-sis-text-light mt-1">Pueblo: <span className="font-medium text-sis-navy">{loc.pueblo}</span></p>
                          <p className="text-sis-text-light">Población: <span className="font-medium text-sis-navy">{loc.poblacion.toLocaleString()}</span></p>
                          <p className="text-sis-text-light">EIB: <span className={`font-medium ${loc.eib ? 'text-green-600' : 'text-red-600'}`}>{loc.eib ? 'Sí' : 'No'}</span></p>
                        </div>
                      </Popup>
                    </AccessibleMarker>
                  ))}
                </MapContainer>
              </div>

              {/* Leyenda */}
              <div className="bg-white border-t border-sis-border p-3">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sis-navy" />
                    <h4 className="font-bold text-sis-navy text-sm">Leyenda — Pueblos Indígenas <small>(Clic para filtrar)</small></h4>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAllLayers}
                    aria-pressed={allSelected}
                    className={`text-xs font-semibold border rounded px-2 py-1 transition-colors ${
                      allSelected
                        ? 'bg-sis-navy text-white border-sis-navy hover:bg-sis-navy-dark'
                        : 'bg-white text-sis-navy border-sis-border hover:bg-gray-50'
                    }`}
                  >
                    {allSelected ? 'Ocultar todos' : 'Mostrar todos'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(puebloColors).map(([pueblo, color]) => (
                    <button
                      key={pueblo}
                      onClick={() => toggleLayer(pueblo)}
                      className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors ${
                        activeLayers.includes(pueblo)
                          ? 'bg-gray-50 text-sis-text'
                          : 'text-gray-400 line-through opacity-60'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span>{pueblo}</span>
                      <span className="text-xs text-sis-text-light">
                        {localidadesData.filter((l) => (pueblo === 'Otros' ? !puebloColors[l.pueblo] : l.pueblo === pueblo)).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-sis-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-sis-navy" />
                  <h4 className="font-bold text-sis-navy text-sm">Localidad Seleccionada</h4>
                </div>
                {selectedLocality && (
                  <button
                    onClick={() => setSelectedLocality(null)}
                    className="text-sis-text-light hover:text-sis-navy"
                    aria-label="Cerrar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {selectedLocality ? (
                <div className="text-sm space-y-2">
                  <p className="font-semibold text-sis-navy">{selectedLocality.nombre}</p>
                  <div className="flex items-center gap-1.5 text-sis-text-light">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{selectedLocality.distrito}, {selectedLocality.provincia}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sis-text-light">
                    <Users className="w-3.5 h-3.5" />
                    <span>Población: {selectedLocality.poblacion.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sis-text-light">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>EIB: {selectedLocality.eib ? 'Sí' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sis-text-light">
                    <TreePine className="w-3.5 h-3.5" />
                    <span>Tipo: {selectedLocality.tipo}</span>
                  </div>
                  <button
                    onClick={() => selectedLocality && navigate(`/pueblos-indigenas/localidad/${selectedLocality.id}`)}
                    className="mt-2 text-sis-link hover:underline text-xs font-medium"
                  >
                    Ver ficha completa →
                  </button>
                </div>
              ) : (
                <p className="text-sm text-sis-text-light italic">
                  Haz clic en un marcador del mapa para ver sus detalles.
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg border border-sis-border p-5">
              <h4 className="font-bold text-sis-navy text-sm mb-3">Resumen del Área</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sis-text-light">Localidades</span>
                  <span className="font-semibold text-sis-navy">{stats.total}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sis-text-light">Con EIB</span>
                  <span className="font-semibold text-green-600">{stats.conEib}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-sis-text-light">Población</span>
                  <span className="font-semibold text-sis-navy">{stats.poblacion.toLocaleString()}</span>
                </div>
                <div className="h-px bg-sis-border my-2" />
                <div className="text-xs text-sis-text-light">
                  Datos actualizados al 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
