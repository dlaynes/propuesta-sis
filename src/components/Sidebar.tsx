import { Link, useLocation } from 'react-router-dom';

interface SidebarLink {
  label: string;
  to?: string;
  href?: string;
}

const links: SidebarLink[] = [
  { label: 'Consultas de asegurado', to: '/' },
  { label: 'Pueblos indígenas', to: '/localidades' },
  { label: 'Unidades locales de empadronamiento', to: '/locales' },
  { label: 'Consultas SIS FOH' },
  { label: 'Consultas SUSALUD' },
  { label: 'Establecimientos de salud' },
];

function isActive(item: SidebarLink, pathname: string) {
  if (!item.to) return false;
  return item.to === pathname;
}

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="bg-white rounded-lg border border-sis-border p-5">
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
              <a href={l.href || '#'} className={`${baseClass} ${activeClass}`}>
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
