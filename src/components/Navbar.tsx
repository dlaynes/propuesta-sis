import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

const topLinks = [
  { label: 'Portal Afiliados', href: '#' },
  { label: 'Portal Prestadores', href: '#' },
  { label: 'Portal Empleadores', href: '#' },
  { label: 'Portal Proveedores', href: '#' },
  { label: 'Contacto', href: '#' },
];

const mainLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Planes de Salud', to: '#' },
  { label: 'Red Médica', to: '#' },
  { label: 'Trámites y Consultas', to: '#' },
  { label: 'Buscador de Asociados', to: '/consulta' },
  { label: 'Preguntas Frecuentes', to: '#' },
];

export function TopNav() {
  return (
    <div className="bg-sis-navy text-white">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Heart className="w-5 h-5 fill-white" />
          <span>SIS</span>
        </Link>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {topLinks.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-sis-orange transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function MainNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-sis-navy border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <button
          className="md:hidden text-white py-3 flex items-center gap-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          <span className="text-sm">Menú</span>
        </button>
        <nav className={`md:flex items-center gap-1 text-sm text-white ${open ? 'block pb-4' : 'hidden'}`}>
          {mainLinks.map((l) => (
            l.to.startsWith('#') ? (
              <a
                key={l.label}
                href={l.to}
                className="block px-3 py-3 hover:text-sis-orange transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                className="block px-3 py-3 hover:text-sis-orange transition-colors"
              >
                {l.label}
              </Link>
            )
          ))}
        </nav>
      </div>
    </div>
  );
}
