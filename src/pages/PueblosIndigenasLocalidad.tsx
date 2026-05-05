import { useNavigate } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import {
  ArrowLeft, Users, Building2, School, FileText, ClipboardList,
  Info, AlertTriangle, CheckCircle2,
} from 'lucide-react';

const edades = [
  { rango: '0-14 años', cantidad: '271', porcentaje: 32, color: 'bg-green-500' },
  { rango: '15-29 años', cantidad: '220', porcentaje: 26, color: 'bg-blue-500' },
  { rango: '30-44 años', cantidad: '186', porcentaje: 22, color: 'bg-orange-500' },
  { rango: '45-59 años', cantidad: '110', porcentaje: 13, color: 'bg-purple-500' },
  { rango: '60+ años', cantidad: '9', porcentaje: 7, color: 'bg-red-500' },
];

const instituciones = [
  {
    nombre: 'I.E. N° 60127 San Juan',
    tipo: 'Escolarizado',
    modalidad: 'Educación Básica Regular',
    tags: [
      { label: 'Inicial', color: 'bg-green-100 text-green-700 border-green-300' },
      { label: 'Primaria', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    ],
    borderColor: 'border-l-green-500',
  },
  {
    nombre: 'I.E.S. Comunal Kukama',
    tipo: 'Escolarizado',
    modalidad: 'Educación Básica Regular',
    tags: [
      { label: 'Secundaria', color: 'bg-orange-100 text-orange-700 border-orange-300' },
    ],
    borderColor: 'border-l-orange-500',
  },
  {
    nombre: 'CETPRO Artesanías Amazónicas',
    tipo: 'No Escolarizado',
    modalidad: 'Educación Técnico-Productiva',
    tags: [
      { label: 'Superior Técnico', color: 'bg-purple-100 text-purple-700 border-purple-300' },
    ],
    borderColor: 'border-l-purple-500',
  },
];

const observaciones = [
  {
    icon: AlertTriangle,
    iconBg: 'bg-yellow-100 text-yellow-700',
    borderColor: 'border-l-yellow-400',
    title: 'Acceso limitado en temporada de lluvias',
    text: 'El acceso a la comunidad puede verse dificultado durante los meses de diciembre a marzo debido al incremento del caudal del río Marañón.',
  },
  {
    icon: CheckCircle2,
    iconBg: 'bg-green-100 text-green-700',
    borderColor: 'border-l-green-400',
    title: 'Proyecto de electrificación en curso',
    text: 'Actualmente se encuentra en ejecución un proyecto de electrificación rural con paneles solares para 150 viviendas. Finalización prevista: diciembre 2024.',
  },
  {
    icon: Info,
    iconBg: 'bg-blue-100 text-blue-700',
    borderColor: 'border-l-blue-400',
    title: 'Lengua originaria preservada',
    text: 'El 87% de la población habla la lengua Kukama-Kukamiria. Se ejecuta un programa de revitalización lingüística en las instituciones educativas.',
  },
];

export default function LocalidadesDetalle() {
  const navigate = useNavigate();

  return (
    <>
      <HeroBanner
        title="Buscador de localidades indígenas"
        subtitle="Ubica tu localidad cerca a tu ubicación a nivel nacional"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back link */}
        <button
          onClick={() => navigate('/pueblos-indigenas')}
          className="text-sis-navy hover:text-sis-link font-medium text-sm flex items-center gap-1 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al buscador
        </button>

        {/* Title card */}
        <div className="bg-white rounded-lg border border-sis-border p-6 mb-6">
          <h1 className="text-2xl font-bold text-sis-navy mb-2">Comunidad Nativa San Juan de Miraflores</h1>
          <p className="text-sm text-sis-text-light mb-4">
            Comunidad Nativa • Distrito de Nauta • Provincia de Loreto • Departamento de Loreto • Código ZIP: 16501
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Pueblo Kukama-Kukamiria', color: 'border-green-500 text-green-700 bg-green-50' },
              { label: 'Georreferenciada', color: 'border-blue-500 text-blue-700 bg-blue-50' },
              { label: 'Con C.P. Censal', color: 'border-orange-500 text-orange-700 bg-orange-50' },
              { label: 'Titulada', color: 'border-purple-500 text-purple-700 bg-purple-50' },
            ].map((tag) => (
              <span
                key={tag.label}
                className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${tag.color}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats / Charts / Schools — 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Datos Estadísticos */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-sis-text-light" />
              <h3 className="font-bold text-sis-navy">Datos Estadísticos</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-sis-text-light">Población Total</p>
                <p className="text-xl font-bold text-sis-navy">847</p>
              </div>
              <div>
                <p className="text-xs text-sis-text-light">Edad Promedio</p>
                <p className="text-xl font-bold text-teal-600">28.4</p>
              </div>
              <div>
                <p className="text-xs text-sis-text-light">Población Indígena</p>
                <p className="text-xl font-bold text-purple-600">94.2%</p>
              </div>
            </div>

            <hr className="my-4 border-sis-border" />

            <h4 className="font-semibold text-sis-navy text-sm mb-3">Distribución por Género</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-sis-text-light">Hombres</span>
                  <span className="font-semibold text-sis-navy">438 (51.7%)</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '51.7%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-sis-text-light">Mujeres</span>
                  <span className="font-semibold text-sis-navy">409 (48.3%)</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: '48.3%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Estructura Poblacional por Edad */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-sis-text-light" />
              <h3 className="font-bold text-sis-navy">Estructura Poblacional por Edad</h3>
            </div>
            <div className="space-y-3">
              {edades.map((e) => (
                <div key={e.rango}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-sis-text">{e.rango}</span>
                    <span className="font-medium text-sis-navy">{e.cantidad} ({e.porcentaje}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${e.color}`} style={{ width: `${e.porcentaje}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instituciones Educativas EIB */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <School className="w-5 h-5 text-sis-text-light" />
              <h3 className="font-bold text-sis-navy">Instituciones Educativas EIB</h3>
            </div>
            <div className="space-y-4">
              {instituciones.map((inst) => (
                <div
                  key={inst.nombre}
                  className={`border border-sis-border rounded-lg p-3 border-l-4 ${inst.borderColor}`}
                >
                  <p className="font-semibold text-sis-navy text-sm">{inst.nombre}</p>
                  <p className="text-xs text-sis-text-light mt-0.5">
                    Tipo: {inst.tipo} • Modalidad: {inst.modalidad}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {inst.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded border ${tag.color}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Datos Legales + Observaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Datos Legales */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-sis-text-light" />
              <h3 className="font-bold text-sis-navy">Datos Legales</h3>
            </div>
            <div className="space-y-4">
              <div className="border border-sis-border rounded-lg p-4">
                <p className="text-xs text-sis-text-light mb-1">Resolución de Reconocimiento</p>
                <p className="font-semibold text-sis-navy text-sm">R.D. N° 0234-78-DR-XXII-L</p>
                <p className="text-xs text-sis-text-light mt-1">Fecha de Reconocimiento: 15 de marzo de 1978</p>
              </div>
              <div className="border border-sis-border rounded-lg p-4">
                <p className="text-xs text-sis-text-light mb-1">Resolución de Titulación</p>
                <p className="font-semibold text-sis-navy text-sm">R.M. N° 0456-82-AG-DGRA</p>
                <p className="text-xs text-sis-text-light mt-1">Fecha de Titulación: 22 de agosto de 1982</p>
              </div>
            </div>
            <p className="text-[10px] text-sis-text-light mt-4">
              Fuente de Datos: Censo Nacional 2017 - XII de Población y VII de Vivienda / Base de Datos de Comunidades Nativas MINAGRI
            </p>
          </div>

          {/* Observaciones */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-sis-text-light" />
              <h3 className="font-bold text-sis-navy">Observaciones</h3>
            </div>
            <div className="space-y-4">
              {observaciones.map((obs) => (
                <div
                  key={obs.title}
                  className={`flex items-start gap-3 border border-sis-border rounded-lg p-4 border-l-4 ${obs.borderColor}`}
                >
                  <div className={`p-1.5 rounded-full shrink-0 ${obs.iconBg}`}>
                    <obs.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-sis-navy text-sm">{obs.title}</p>
                    <p className="text-xs text-sis-text-light mt-1">{obs.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/pueblos-indigenas')}
          className="text-sis-navy hover:text-sis-link font-medium text-sm mt-8 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al buscador
        </button>
      </div>
    </>
  );
}
