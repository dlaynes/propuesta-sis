import { useNavigate, useParams } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import {
  ArrowLeft, Users, Building2, School, FileText, ClipboardList,
  Info, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import centrosData from '../data/json/centros_poblados.json';
import { getDistrictHierarchy } from '../services/ubigeoService';
import type { CentroPoblado } from '../types/centro_poblado';

const records: CentroPoblado[] = centrosData as CentroPoblado[];

function findCentroPobladoByNum(num: string): CentroPoblado | undefined {
  return records.find((r) => r.num === num);
}

function parseInstituciones(row: CentroPoblado) {
  const num = parseInt(row.num_de_instituciones_educativas_en_el_centro_poblado, 10) || 0;
  const tipos = row.tipo_de_instituciones_educativas_en_el_centro_poblado?.split('\n').filter(Boolean) || [];
  const niveles = row.nivel_de_las_instituciones_educativas_en_el_centro_poblado?.split('\n').filter(Boolean) || [];
  const educacion = row.tipo_de_educacion_impartida_en_el_centro_poblado?.split('\n').filter(Boolean) || [];
  return { num, tipos, niveles, educacion };
}

export default function PueblosIndigenasCentroPoblado() {
  const navigate = useNavigate();
  const { id } = useParams();
  const row = id ? findCentroPobladoByNum(id) : undefined;

  if (!row) {
    return (
      <>
        <HeroBanner title="Centro poblado no encontrado" subtitle="El identificador no existe en la base de datos" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate('/pueblos-indigenas')}
            className="text-sis-navy hover:text-sis-link font-medium text-sm flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al buscador
          </button>
        </div>
      </>
    );
  }

  // Use first 6 digits of the 10-digit centro-poblado ubigeo for district lookup
  const ubigeoDistrito = row.ubigeo_centro_poblado_actual?.slice(0, 6) || '';
  const hierarchy = getDistrictHierarchy(ubigeoDistrito);
  const distrito = hierarchy.district?.name || '';
  const provincia = hierarchy.province?.name || '';
  const departamento = hierarchy.department?.name || '';

  const hasTitulacion =
    row.resolucion_de_titulacion_de_la_comunidad &&
    row.resolucion_de_titulacion_de_la_comunidad.trim() !== '' &&
    row.resolucion_de_titulacion_de_la_comunidad !== '-';

  const hasReconocimiento =
    row.resolucion_de_reconocimiento_de_la_comunidad &&
    row.resolucion_de_reconocimiento_de_la_comunidad.trim() !== '' &&
    row.resolucion_de_reconocimiento_de_la_comunidad !== '-';

  const tags = [
    { label: `Pueblo ${row.pueblo_indigena}`, color: 'border-green-500 text-green-700 bg-green-50' },
    ...(row.comunidad_georeferenciada?.toLowerCase() === 'si'
      ? [{ label: 'Georreferenciada', color: 'border-blue-500 text-blue-700 bg-blue-50' }]
      : []),
    ...(hasTitulacion ? [{ label: 'Titulada', color: 'border-purple-500 text-purple-700 bg-purple-50' }] : []),
  ];

  const totalPop = parseInt(row.total_poblacion, 10) || 0;
  const hombres = parseInt(row.hombres, 10) || 0;
  const mujeres = parseInt(row.mujeres, 10) || 0;
  const hablantes = parseInt(row.hablantes_alguna_lengua_indigena, 10) || 0;
  const pctHablantes = totalPop > 0 ? Math.round((hablantes / totalPop) * 100) : 0;

  // Gender percentages may be "-" in CP data; compute fallback
  const pctHombres = totalPop > 0 ? Math.round((hombres / totalPop) * 100) : 0;
  const pctMujeres = totalPop > 0 ? Math.round((mujeres / totalPop) * 100) : 0;

  const edades = [
    { rango: '0 - 4 años', porcentaje: totalPop > 0 ? Math.round((parseInt(row.cero_a_4_anios, 10) || 0) / totalPop * 100) : 0, color: 'bg-green-500' },
    { rango: '5 - 14 años', porcentaje: totalPop > 0 ? Math.round((parseInt(row.cinco_a_14_anios, 10) || 0) / totalPop * 100) : 0, color: 'bg-blue-500' },
    { rango: '15 - 29 años', porcentaje: totalPop > 0 ? Math.round((parseInt(row.de_15_a_29_anios, 10) || 0) / totalPop * 100) : 0, color: 'bg-orange-500' },
    { rango: '30 - 64 años', porcentaje: totalPop > 0 ? Math.round((parseInt(row.de_30_a_64_anios, 10) || 0) / totalPop * 100) : 0, color: 'bg-purple-500' },
    { rango: '65+ años', porcentaje: totalPop > 0 ? Math.round((parseInt(row.mas_de_65_anios, 10) || 0) / totalPop * 100) : 0, color: 'bg-red-500' },
  ];

  const instituciones = parseInstituciones(row);

  const observacionesList = [];
  if (row.observaciones && row.observaciones.trim() && row.observaciones !== '-') {
    observacionesList.push({
      icon: Info,
      iconBg: 'bg-blue-100 text-blue-700',
      borderColor: 'border-l-blue-400',
      title: 'Observación',
      text: row.observaciones,
    });
  }
  if (hasTitulacion) {
    observacionesList.push({
      icon: CheckCircle2,
      iconBg: 'bg-green-100 text-green-700',
      borderColor: 'border-l-green-400',
      title: 'Comunidad titulada',
      text: `Resolución: ${row.resolucion_de_titulacion_de_la_comunidad}`,
    });
  }
  if (hasReconocimiento) {
    observacionesList.push({
      icon: AlertTriangle,
      iconBg: 'bg-yellow-100 text-yellow-700',
      borderColor: 'border-l-yellow-400',
      title: 'Comunidad reconocida',
      text: `Resolución: ${row.resolucion_de_reconocimiento_de_la_comunidad}`,
    });
  }

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
          <h1 className="text-2xl font-bold text-sis-navy mb-2">Centro Poblado: {row.centro_poblado && row.centro_poblado !== '-' ? row.centro_poblado : 'Nombre no disponible'}</h1>
          <p className="text-sm text-sis-text-light mb-4">
            {row.tipo_localidad}
            {row.localidad && ` • Localidad: ${row.localidad}`}
            {distrito && ` • Distrito de ${distrito}`}
            {provincia && ` • Provincia de ${provincia}`}
            {departamento && ` • Departamento de ${departamento}`}
            {row.ubigeo_centro_poblado_actual && ` • Ubigeo: ${row.ubigeo_centro_poblado_actual}`}
          </p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className={`inline-block text-xs font-medium px-3 py-1 rounded-full border ${tag.color}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats / Charts / Schools */}
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
                <p className="text-xl font-bold text-sis-navy">{totalPop.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-sis-text-light">Hombres</p>
                  <p className="font-bold text-sis-navy">{hombres.toLocaleString()}</p>
                  <p className="text-xs text-sis-text-light">{pctHombres}%</p>
                </div>
                <div>
                  <p className="text-xs text-sis-text-light">Mujeres</p>
                  <p className="font-bold text-sis-navy">{mujeres.toLocaleString()}</p>
                  <p className="text-xs text-sis-text-light">{pctMujeres}%</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-sis-text-light">Hablantes de lengua originaria</p>
                <p className="text-xl font-bold text-sis-navy">{hablantes.toLocaleString()}</p>
                <p className="text-xs text-sis-text-light">{pctHablantes}% de la población</p>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${pctHablantes}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Distribución por Edades */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-sis-text-light" />
              <h3 className="font-bold text-sis-navy">Distribución por Edades</h3>
            </div>
            <div className="space-y-3">
              {edades.map((e) => (
                <div key={e.rango}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-sis-text">{e.rango}</span>
                    <span className="font-medium text-sis-navy">{e.porcentaje}%</span>
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
              {instituciones.num > 0 ? (
                <>
                  <div>
                    <p className="text-xs text-sis-text-light mb-1">Total instituciones</p>
                    <p className="text-xl font-bold text-sis-navy">{instituciones.num}</p>
                  </div>
                  {instituciones.educacion.length > 0 && (
                    <div>
                      <p className="text-xs text-sis-text-light mb-1">Tipo de educación</p>
                      <div className="flex flex-wrap gap-1.5">
                        {instituciones.educacion.map((e) => (
                          <span key={e} className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-sis-navy/10 text-sis-navy border border-sis-navy/20">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {instituciones.tipos.length > 0 && (
                    <div>
                      <p className="text-xs text-sis-text-light mb-1">Tipo de institución</p>
                      <div className="flex flex-wrap gap-1.5">
                        {instituciones.tipos.map((t) => (
                          <span key={t} className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {instituciones.niveles.length > 0 && (
                    <div>
                      <p className="text-xs text-sis-text-light mb-1">Niveles</p>
                      <div className="flex flex-wrap gap-1.5">
                        {instituciones.niveles.map((n) => (
                          <span key={n} className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                            {n}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-sis-text-light">Sin información de instituciones educativas.</p>
              )}
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
              {hasReconocimiento && (
                <div className="border border-sis-border rounded-lg p-4">
                  <p className="text-xs text-sis-text-light mb-1">Resolución de Reconocimiento</p>
                  <p className="font-semibold text-sis-navy text-sm">{row.resolucion_de_reconocimiento_de_la_comunidad}</p>
                  {row.fecha_de_reconocimiento_de_la_comunidad && (
                    <p className="text-xs text-sis-text-light mt-1">
                      Fecha: {row.fecha_de_reconocimiento_de_la_comunidad}
                    </p>
                  )}
                </div>
              )}
              {hasTitulacion && (
                <div className="border border-sis-border rounded-lg p-4">
                  <p className="text-xs text-sis-text-light mb-1">Resolución de Titulación</p>
                  <p className="font-semibold text-sis-navy text-sm">{row.resolucion_de_titulacion_de_la_comunidad}</p>
                  {row.fecha_de_titulacion_de_la_comunidad && (
                    <p className="text-xs text-sis-text-light mt-1">
                      Fecha: {row.fecha_de_titulacion_de_la_comunidad}
                    </p>
                  )}
                </div>
              )}
              {!hasReconocimiento && !hasTitulacion && (
                <p className="text-sm text-sis-text-light">Sin datos legales registrados.</p>
              )}
            </div>
            <p className="text-[10px] text-sis-text-light mt-4">
              Fuente: {row.fuentes || 'Censo Nacional de Población'}
            </p>
          </div>

          {/* Observaciones */}
          <div className="bg-white rounded-lg border border-sis-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-sis-text-light" />
              <h3 className="font-bold text-sis-navy">Observaciones</h3>
            </div>
            <div className="space-y-4">
              {observacionesList.length > 0 ? (
                observacionesList.map((obs) => (
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
                ))
              ) : (
                <p className="text-sm text-sis-text-light">Sin observaciones registradas.</p>
              )}
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
