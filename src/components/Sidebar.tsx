import { ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLink {
  label: string;
  to?: string;
  href?: string;
  target?: string;
}

const links: SidebarLink[] = [
  { label: 'Consultas de asegurado', to: '/' },
  { label: 'Pueblos indígenas', to: '/pueblos-indigenas' },
  { label: 'Unidades locales de empadronamiento', to: '/locales' },
  { label: 'Consultas SIS FOH', href: 'https://focalizacion.sisfoh.gob.pe/ConsultaCSE/', target: '_blank' },
  { label: 'Consultas SUSALUD', href: 'https://app1.susalud.gob.pe/registro/', target: '_blank' },
  { label: 'Establecimientos de salud', href: 'https://sigeps.sis.gob.pe/BuscadorEESS/PortalSIS/', target: '_blank' },
];

function isActive(item: SidebarLink, pathname: string) {
  if (!item.to) return false;
  return item.to === pathname;
}

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="bg-white rounded-lg border border-sis-border p-5" role="navigation" aria-label="Enlaces de interés">
      <h4 className="font-bold text-sis-navy mb-4">Enlaces de interés</h4>
      <ul className="space-y-2">
        {links.map((l) => {
          const active = isActive(l, pathname);
          const baseClass = "block text-sm transition-colors";
          const activeClass = active
            ? "text-sis-red font-semibold"
            : "text-sis-navy hover:text-sis-link hover:underline";

          if (l.to) {
            return (
              <li key={l.label}>
                <Link to={l.to} className={`${baseClass} ${activeClass}`}>
                  {l.label}
                </Link>
              </li>
            );
          }

          return (
            <li key={l.label}>
              <a href={l.href || '#'} className={`${baseClass} ${activeClass}`} target={l.target || undefined} rel={l.target === '_blank' ? 'noopener noreferrer' : undefined}>
                {l.label}
                {l.target === '_blank' && <ExternalLink className="inline-block ml-1" aria-hidden="true" />}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
