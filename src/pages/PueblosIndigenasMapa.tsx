import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
} from '../services/ubigeoService';
import L from 'leaflet';

const tipoOptions = [
  'Todas',
  'Comunidad Nativa',
  'Centro Poblado',
  'Pueblo Indígena',
  'Comunidad Campesina',
];

const puebloColors: Record<string, string> = {
  "Asháninka": '#22c55e',
  "Awajún": '#3b82f6',
  "Shipibo-Konibo": '#e07020',
  "Quechua": '#8b5cf6',
  "Aymara": '#eab308',
  "Otros": '#6b7280',
};

function getPuebloColor(pueblo: string): string {
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

const localidadesData: LocalidadMarker[] = [
  {
    id: '1', nombre: 'Marankiari Bajo', pueblo: 'Asháninka',
    departamento: 'Junín', provincia: 'Chanchamayo', distrito: 'Perené',
    tipo: 'Comunidad Nativa', poblacion: 1245, eib: true,
    lat: -11.05, lng: -75.18,
  },
  {
    id: '2', nombre: 'Urakusa', pueblo: 'Awajún',
    departamento: 'Amazonas', provincia: 'Condorcanqui', distrito: 'Nieva',
    tipo: 'Comunidad Nativa', poblacion: 892, eib: true,
    lat: -4.48, lng: -77.92,
  },
  {
    id: '3', nombre: 'San Francisco de Yarinacocha', pueblo: 'Shipibo-Konibo',
    departamento: 'Ucayali', provincia: 'Coronel Portillo', distrito: 'Yarinacocha',
    tipo: 'Comunidad Nativa', poblacion: 2156, eib: true,
    lat: -8.38, lng: -74.58,
  },
  {
    id: '4', nombre: 'Pampa Michi', pueblo: 'Asháninka',
    departamento: 'Junín', provincia: 'Satipo', distrito: 'Río Tambo',
    tipo: 'Centro Poblado', poblacion: 567, eib: false,
    lat: -11.22, lng: -74.25,
  },
  {
    id: '5', nombre: 'Nuevo Progreso', pueblo: 'Quechua',
    departamento: 'Loreto', provincia: 'Maynas', distrito: 'Fernando Lores',
    tipo: 'Pueblo Indígena', poblacion: 432, eib: true,
    lat: -3.72, lng: -73.28,
  },
  {
    id: '6', nombre: 'Puerto Esperanza', pueblo: 'Shipibo-Konibo',
    departamento: 'Ucayali', provincia: 'Atalaya', distrito: 'Tahuanía',
    tipo: 'Comunidad Nativa', poblacion: 1103, eib: true,
    lat: -9.82, lng: -70.72,
  },
  {
    id: '7', nombre: 'Cashibocoya', pueblo: 'Quechua',
    departamento: 'Pasco', provincia: 'Oxapampa', distrito: 'Villa Rica',
    tipo: 'Centro Poblado', poblacion: 389, eib: false,
    lat: -10.35, lng: -74.85,
  },
  {
    id: '8', nombre: 'Santa Clara de Uchunya', pueblo: 'Shipibo-Konibo',
    departamento: 'Ucayali', provincia: 'Coronel Portillo', distrito: 'Callería',
    tipo: 'Comunidad Nativa', poblacion: 1567, eib: true,
    lat: -8.42, lng: -74.48,
  },
  {
    id: '9', nombre: 'Nueva Esperanza', pueblo: 'Awajún',
    departamento: 'Loreto', provincia: 'Datem del Marañón', distrito: 'Manseriche',
    tipo: 'Pueblo Indígena', poblacion: 678, eib: true,
    lat: -4.05, lng: -73.55,
  },
  {
    id: '10', nombre: 'Nuevo Eden', pueblo: 'Otros',
    departamento: 'Madre de Dios', provincia: 'Tambopata', distrito: 'Tambopata',
    tipo: 'Comunidad Nativa', poblacion: 245, eib: false,
    lat: -12.55, lng: -70.15,
  },
  {
    id: '11', nombre: 'Huayllati', pueblo: 'Aymara',
    departamento: 'Puno', provincia: 'San Antonio de Putina', distrito: 'Sina',
    tipo: 'Comunidad Campesina', poblacion: 823, eib: true,
    lat: -14.78, lng: -69.95,
  },
  {
    id: '12', nombre: 'San Juan de Arama', pueblo: 'Asháninka',
    departamento: 'Junín', provincia: 'Satipo', distrito: 'Río Tambo',
    tipo: 'Comunidad Nativa', poblacion: 934, eib: true,
    lat: -11.38, lng: -74.42,
  },
];

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
  const departments = useMemo(() => getAllDepartments(), []);

  const [departmentId, setDepartmentId] = useState('');
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todas');
  const [selectedLocality, setSelectedLocality] = useState<LocalidadMarker | null>(null);
  const [activeLayers, setActiveLayers] = useState<string[]>(Object.keys(puebloColors));

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
  }

  function toggleLayer(pueblo: string) {
    setActiveLayers((prev) =>
      prev.includes(pueblo) ? prev.filter((p) => p !== pueblo) : [...prev, pueblo]
    );
  }

  const filteredLocalidades = useMemo(() => {
    return localidadesData.filter((loc) => {
      if (departmentId && loc.departamento !== departments.find((d) => d.id === departmentId)?.name) return false;
      if (tipoFilter !== 'Todas' && loc.tipo !== tipoFilter) return false;
      if (!activeLayers.includes(loc.pueblo) && !activeLayers.includes('Otros')) {
        if (!puebloColors[loc.pueblo]) {
          if (!activeLayers.includes('Otros')) return false;
        } else {
          return false;
        }
      }
      return true;
    });
  }, [departmentId, tipoFilter, activeLayers, departments]);

  const stats = useMemo(() => {
    const total = filteredLocalidades.length;
    const conEib = filteredLocalidades.filter((l) => l.eib).length;
    const poblacion = filteredLocalidades.reduce((sum, l) => sum + l.poblacion, 0);
    return { total, conEib, poblacion };
  }, [filteredLocalidades]);

  const activeFilterCount = [
    departmentId,
    provinceId,
    districtId,
    tipoFilter !== 'Todas',
  ].filter(Boolean).length;

  return (
    <>
      <HeroBanner
        title="Mapa de Localidades Indígenas"
        subtitle="Visualiza la distribución geográfica de las localidades"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/localidades')}
          className="text-sis-navy hover:text-sis-link font-medium text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Localidades
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-sis-navy">Mapa Interactivo</h2>
            <p className="text-sm text-sis-text-light">
              {stats.total} localidades visibles | {stats.poblacion.toLocaleString()} habitantes
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
            <select
              id="map-tipo"
              aria-label="Tipo de localidad"
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="border border-sis-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
            >
              {tipoOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
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
              <div className="h-[500px] w-full relative">
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
                    <Marker
                      key={loc.id}
                      position={[loc.lat, loc.lng]}
                      icon={createCustomIcon(getPuebloColor(loc.pueblo))}
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
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-sis-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-4 h-4 text-sis-navy" />
                <h4 className="font-bold text-sis-navy text-sm">Leyenda — Pueblos Indígenas</h4>
              </div>
              <div className="space-y-2">
                {Object.entries(puebloColors).map(([pueblo, color]) => (
                  <button
                    key={pueblo}
                    onClick={() => toggleLayer(pueblo)}
                    className={`flex items-center gap-2 w-full text-left text-sm px-2 py-1.5 rounded transition-colors ${
                      activeLayers.includes(pueblo)
                        ? 'bg-gray-50 text-sis-text'
                        : 'text-gray-400 line-through'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span>{pueblo}</span>
                    <span className="ml-auto text-xs text-sis-text-light">
                      {localidadesData.filter((l) => (pueblo === 'Otros' ? !puebloColors[l.pueblo] : l.pueblo === pueblo)).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

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
                    onClick={() => navigate('/localidades/detalle')}
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
