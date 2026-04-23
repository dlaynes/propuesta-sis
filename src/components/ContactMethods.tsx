import { Mail, Phone, MessageSquare, Smartphone } from 'lucide-react';

const channels = [
  {
    icon: Mail,
    label: 'Correo Electrónico',
    text: 'Envía tu consulta a',
    link: { text: 'sis@sis.gob.pe', href: 'mailto:sis@sis.gob.pe' },
  },
  {
    icon: Phone,
    label: 'Central Telefónica',
    text: 'Llámanos a',
    link: { text: '113 Salud - Opción 4', href: 'tel:113' },
  },
  {
    icon: MessageSquare,
    label: 'WhatsApp',
    text: 'Escríbenos al',
    link: { text: '+51 945 405 104', href: 'https://wa.me/51945405104' },
  },
  {
    icon: Smartphone,
    label: 'App móvil',
    text: 'Descarga el app',
    link: { text: 'Más información', href: '#' },
  },
];

export function ContactMethods() {
  return (
    <div className="bg-blue-50/60 border border-sis-border rounded-lg p-6 mt-8">
      <h3 className="text-center font-bold text-sis-navy text-lg mb-3">
        ¿Otras formas de consultar tu afiliación?
      </h3>
      <p className="text-center text-sm text-sis-text-light mb-6">
        Si no cuentas con tu número de documento a la mano, o en caso de problemas puedes realizar la búsqueda a través de los siguientes canales:
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {channels.map((c) => (
          <div key={c.label} className="text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-sis-navy flex items-center justify-center mb-2">
              <c.icon className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <p className="text-sm font-semibold text-sis-navy">{c.label}</p>
            <p className="text-xs text-sis-text-light mt-0.5">{c.text}</p>
            <a
              href={c.link.href}
              className="text-sm text-sis-link font-medium hover:underline"
            >
              {c.link.text}
            </a>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-sis-text-light mt-6">
        También puedes acercarte a cualquiera de nuestras{' '}
        <a href="#" className="text-sis-link hover:underline">
          agencias a nivel nacional
        </a>{' '}
        con tu documento de identidad para realizar la consulta de manera presencial.
      </p>
    </div>
  );
}
