import { useState } from 'react';
import { HeroBanner } from '../components/HeroBanner';
import { List, MapPin, ChevronDown, RotateCcw, Calendar, Mail, MapPinned, Phone, MapPinHouse, Download, Search } from 'lucide-react';

const localidades = [
  {
    codigo: 'ULE-001',
    nombre: 'Agencia Lima Centro - Sede Principal',
    dias: 'Lunes a Viernes, 8:00 - 17:00',
    correo: 'ule.limacentro@reniec.gob.pe',
    referencia: 'A una cuadra de la Av. Abancay, frente al Parque Universitario',
    telefono: '(01) 315-4000 Anexo 1201',
    direccion: 'Jr. Bolivia 109, Cercado de Lima',
  },
  {
    codigo: 'ULE-002',
    nombre: 'Agencia Jirón de la Unión',
    dias: 'Lunes a Sábado, 8:30 - 16:30',
    correo: 'No disponible',
    referencia: 'Entre Jr. Camaná y Jr. Callao, cerca de la Plaza San Martín',
    telefono: '(01) 315-4000 Anexo 1305',
    direccion: 'Jr. de la Unión 630, Cercado de Lima',
  },
  {
    codigo: 'ULE-003',
    nombre: 'Agencia Barrios Altos',
    dias: 'Lunes a Viernes, 9:00 - 16:00',
    correo: 'ule.barriosaltos@reniec.gob.pe',
    referencia: 'A dos cuadras del Mercado Central, frente a la Iglesia de las Nazarenas',
    telefono: '(01) 315-4000 Anexo 1410',
    direccion: 'Jr. Ancash 1290, Cercado de Lima',
  },
  {
    codigo: 'ULE-004',
    nombre: 'Agencia Monserrate',
    dias: 'Lunes a Viernes, 8:00 - 15:30',
    correo: 'No disponible',
    referencia: 'Al costado de la Iglesia de Monserrate, cerca de la Av. Tacna',
    telefono: 'No disponible',
    direccion: 'Jr. Camaná 370, Cercado de Lima',
  },
  {
    codigo: 'ULE-005',
    nombre: 'Agencia Rímac - Puente de Piedra',
    dias: 'Lunes a Viernes, 8:30 - 16:00',
    correo: 'ule.rimac@reniec.gob.pe',
    referencia: 'A media cuadra del Puente de Piedra, frente a la Alameda de los Descalzos',
    telefono: '(01) 315-4000 Anexo 1520',
    direccion: 'Jr. Trujillo 618, Cercado de Lima',
  },
];

export default function LocalesEmpadronamiento() {
  const [region] = useState('Lima');
  const [provincia] = useState('Lima');
  const [distrito] = useState('Cercado de Lima');
  const [busqueda, setBusqueda] = useState('');

  return (
    <>
      <HeroBanner
        title="Buscador de locales de empadronamiento"
        subtitle="Ubica un local cerca a tu ubicación a nivel nacional"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg border border-sis-border p-6 mb-6">
          <div className="text-sis-navy font-semibold mb-4">
            <span>Filtros de Búsqueda</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-sis-navy mb-1">Región</label>
              <select className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30">
                <option>{`-- ${region} --`}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-sis-navy mb-1">Provincia</label>
              <select className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30">
                <option>{`-- ${provincia} --`}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-sis-navy mb-1">Distrito</label>
              <select className="w-full border border-sis-border rounded px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sis-navy/30">
                <option>{`-- ${distrito} --`}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-sis-navy mb-1">Nombre de localidad</label>
              <div className="flex">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Nombre de localidad..."
                  className="flex-1 border border-sis-border rounded-l px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 justify-between items-center">
            <div className="flex gap-3 mt-4">
              <button className="bg-sis-red hover:bg-sis-red-hover text-white font-semibold py-2 px-6 rounded transition-colors flex direction-row items-center gap-1.5">
                <Search className="w-4 h-4 mr-1.5" />
                Buscar
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-sis-text font-semibold py-2 px-6 rounded border border-sis-border transition-colors flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Limpiar filtros
              </button>            
            </div>

            <button className="bg-sis-navy hover:bg-sis-navy-light text-white font-semibold py-2 px-6 rounded transition-colors flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Descargar listado de locales de empadronamiento
            </button>
          </div>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sis-red"></span>
            <span className="text-sm font-medium text-sis-navy">
              Se encontraron 5 locales de empadronamiento en Lima - Lima - Cercado de Lima
            </span>
          </div>
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
          {/* Map placeholder */}
          <div className="lg:col-span-2 bg-gray-100 rounded-lg border border-sis-border h-[500px] flex items-center justify-center relative overflow-hidden">
            <div className="text-center p-6">
              <MapPinHouse className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-medium">Mapa de ubicaciones</p>
              <p className="text-xs text-gray-400 mt-1">Requiere API Key de Google Maps</p>
            </div>
            {/* Simulated map styling */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 40px, #ccc 40px, #ccc 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #ccc 40px, #ccc 41px)',
              }}
            />
          </div>

          {/* Cards list */}
          <div className="lg:col-span-3 space-y-4">
            {localidades.map((loc) => (
              <div key={loc.codigo} className="bg-white rounded-lg border border-sis-border p-5 relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-sis-green text-white text-xs font-bold px-2 py-0.5 rounded">
                      {loc.codigo}
                    </span>
                    <h3 className="font-bold text-sis-navy">{loc.nombre}</h3>
                  </div>
                  <a href="#" className="text-sm text-sis-sky-blue hover:underline flex items-center gap-1 shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                    Ver en mapa
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-sis-text-light shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-sis-navy">Días de atención:</span>{' '}
                      <span className="text-sis-text-light">{loc.dias}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
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
                  </div>
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
