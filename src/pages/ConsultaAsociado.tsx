import { useState } from 'react';
import { AlertCircle, Search, UserCheck, FileText, Shield, Activity } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { Sidebar } from '../components/Sidebar';
import { CaptchaWidget } from '../components/CaptchaWidget';
import { ContactMethods } from '../components/ContactMethods';

const docTypes = [
  'DNI - Documento Nacional de Identidad',
  'CE - Carnet de Extranjería',
  'Pasaporte',
  'PTP - Permiso Temporal de Permanencia',
];

interface ResultData {
  fullName: string;
  docType: string;
  docNumber: string;
  affiliationId: string;
  insuranceType: string;
  status: string;
}

export default function ConsultaAsociado() {
  const [docType, setDocType] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [captchaValue, setCaptchaValue] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setNotFound(false);
    if (!docType || !docNumber || !captchaValue) {
      alert('Por favor complete todos los campos.');
      return;
    }
    const trimmed = docNumber.trim();
    if (!/^\d{8}$/.test(trimmed)) {
      setNotFound(true);
      return;
    }
    const affiliationId = `100${trimmed}`;
    const lastDigit = parseInt(affiliationId.slice(-1), 10);
    const status = lastDigit % 2 === 0 ? 'Habilitado' : 'Cancelado';
    setResult({
      fullName: 'JUAN PEREZ GARCIA',
      docType,
      docNumber: trimmed,
      affiliationId,
      insuranceType: 'SIS GRATUITO',
      status,
    });
  };

  return (
    <>
      <HeroBanner
        title="Buscador de Asegurados en el SIS"
        subtitle="Consulta tu estado de afiliación en el Seguro de salud"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg border border-sis-border p-6">
              <h2 className="text-xl font-bold text-sis-navy mb-2">Consulta de Asociado</h2>
              <p className="text-sm text-sis-text-light mb-4">
                Estimado/a usuario, a través de esta página, podrás saber si te encuentras asegurado al SIS, así como también conocer el estado de tu afiliación y el centro o puesto de salud asignado para tu atención. Si deseas realizar otra consulta o solicitud comunícate a nuestros canales de atención
              </p>

              <h3 className="font-semibold text-sis-navy mb-2">¿Cómo realizar la búsqueda?</h3>
              <p className="text-sm text-sis-text-light mb-4">
                Elige entre la opción datos personales o tipo de documento completa la información y accede a la consulta en línea. La información que se obtenga está actualizada a la fecha de la consulta, por lo que no requiere ser corroborada.
              </p>
              <p className="text-sm mb-6">
                Mira el video de ejemplo sobre como realizar la búsqueda{' '}
                <a href="#" className="text-sis-link hover:underline">aquí</a>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="doc-type" className="block text-sm font-semibold text-sis-navy mb-1">Tipo de Documento</label>
                    <select
                      id="doc-type"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                      className="w-full border border-sis-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30 bg-white"
                    >
                      <option value="">Seleccione tipo de documento</option>
                      {docTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="doc-number" className="block text-sm font-semibold text-sis-navy mb-1">Número de Documento</label>
                    <input
                      id="doc-number"
                      type="text"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      placeholder="Ingrese su número de documento"
                      className="w-full border border-sis-border rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sis-navy/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <CaptchaWidget value={captchaValue} onChange={setCaptchaValue} />

                  <div className="text-center mt-8 md:mt-2">
                    <button
                      type="submit"
                      className="bg-sis-orange mt-6 w-full hover:bg-sis-orange-hover text-white font-semibold py-1.5 px-6 rounded transition-colors"
                    >
                      Realizar búsqueda
                    </button>
                  </div>
                </div>
              </form>

              {notFound && (
                <div className="mt-6 rounded-lg border border-sis-red/20 bg-red-50 p-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-sis-red shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-sis-red">No se encontró información</p>
                    <p className="text-sm text-sis-text-light mt-1">
                      No existe registro de asegurado para el documento ingresado. Verifique el número y el tipo, luego vuelva a intentarlo.
                    </p>
                  </div>
                </div>
              )}

              {result && (
                <div className="mt-6 rounded-lg border border-sis-border bg-white overflow-hidden">
                  <div className="bg-sis-navy/5 px-5 py-3 border-b border-sis-border flex items-center gap-2">
                    <Search className="w-4 h-4 text-sis-navy" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-sis-navy">Resultado de la consulta</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <tbody>
                        <tr className="border-b border-sis-border">
                          <td className="px-5 py-3 bg-sis-bg/50 font-semibold text-sis-navy w-1/3">
                            <div className="flex items-center gap-2">
                              <UserCheck className="w-4 h-4" aria-hidden="true" />
                              Nombres completos
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sis-text">{result.fullName}</td>
                        </tr>
                        <tr className="border-b border-sis-border">
                          <td className="px-5 py-3 bg-sis-bg/50 font-semibold text-sis-navy w-1/3">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" aria-hidden="true" />
                              Tipo y N° de documento
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sis-text">{result.docType} — {result.docNumber}</td>
                        </tr>
                        <tr className="border-b border-sis-border">
                          <td className="px-5 py-3 bg-sis-bg/50 font-semibold text-sis-navy w-1/3">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" aria-hidden="true" />
                              ID de afiliación
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sis-text">{result.affiliationId}</td>
                        </tr>
                        <tr className="border-b border-sis-border">
                          <td className="px-5 py-3 bg-sis-bg/50 font-semibold text-sis-navy w-1/3">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" aria-hidden="true" />
                              Tipo de seguro
                            </div>
                          </td>
                          <td className="px-5 py-3 text-sis-text">{result.insuranceType}</td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3 bg-sis-bg/50 font-semibold text-sis-navy w-1/3">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4" aria-hidden="true" />
                              Estado
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                result.status === 'Habilitado'
                                  ? 'bg-green-50 text-sis-green border border-green-200'
                                  : 'bg-red-50 text-sis-red border border-red-200'
                              }`}
                            >
                              {result.status === 'Habilitado' ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-sis-green" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-sis-red" />
                              )}
                              {result.status}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <ContactMethods />
          </div>

          {/* Right column */}
          <div>
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}
