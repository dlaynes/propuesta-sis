import { Globe, MessageCircle, Video, Camera, MapPin, Phone, Mail, Clock } from 'lucide-react';

const servicios = ['Planes de Salud','Red Médica','Emergencias','Programas Preventivos','Teleconsulta'];
const informacion = ['Quiénes Somos','Transparencia','Libro de Reclamaciones','Política de Privacidad','Términos y Condiciones'];

export function Footer() {
  return (
    <footer className="bg-sis-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-4">
            <span className="text-white" aria-hidden="true">♥</span>
            <span>SIS</span>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Somos una empresa prestadora de salud comprometida con el bienestar de nuestros asociados desde 1998.
          </p>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" aria-label="Sitio web" />
            <Camera className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" aria-label="Instagram" />
            <MessageCircle className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" aria-label="Facebook" />
            <Video className="w-5 h-5 text-white/70 hover:text-white cursor-pointer" aria-label="YouTube" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Servicios</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {servicios.map((s) => <li key={s}><a href="#" className="hover:text-white">{s}</a></li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Información</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {informacion.map((i) => <li key={i}><a href="#" className="hover:text-white">{i}</a></li>)}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Contáctanos</h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>Av. Javier Prado Este 1520, San Isidro, Lima</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>(01) 315-2800</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>consultas@vidasalud.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Lun - Vie: 8:00 am - 6:00 pm</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-400">
          © 2026. Sistema SIS Todos los derechos reservados. Superintendencia Nacional de Salud - SUSALUD
        </div>
      </div>
    </footer>
  );
}
