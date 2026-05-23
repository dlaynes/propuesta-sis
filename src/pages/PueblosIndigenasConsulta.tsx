import { lazy, Suspense, useState, useEffect } from 'react';
import { useAnnouncer } from '../hooks/useAnnouncer';
import { useNavigate } from 'react-router-dom';
import { HeroBanner } from '../components/HeroBanner';
import { TrendingUp, Users, TreePine, BarChart3, Download } from 'lucide-react';
import { Tabs } from '../components/Tabs';
import { Spinner } from '../components/Loader';
import { computeResumenStats, type ResumenStats } from '../types/pueblos_indigenas';

const Localidades = lazy(() => import('./PueblosIndigenasConsulta/Localidades').then((m) => ({ default: m.Localidades })));
const CentrosPoblados = lazy(() => import('./PueblosIndigenasConsulta/CentrosPoblados').then((m) => ({ default: m.CentrosPoblados })));

export default function PueblosIndigenasConsulta() {
  const navigate = useNavigate();
  const { announce } = useAnnouncer();
  const [stats, setStats] = useState<ResumenStats | null>(null);

  useEffect(() => {
    computeResumenStats().then((s) => {
      setStats(s);
      announce('Estadísticas cargadas.');
    });
  }, [announce]);

  if (!stats) {
    return (
      <>
        <HeroBanner
          title="Buscador de localidades indígenas"
          subtitle="Ubica tu localidad cerca a tu ubicación a nivel nacional"
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sis-navy"></div>
          </div>
        </div>
      </>
    );
  }

  const cards = [
    {
      title: 'Total Localidades',
      value: stats.totalLocalidades.toLocaleString(),
      badge: `${stats.totalLocalidades} registradas`,
      icon: TreePine,
      color: 'border-l-green-500',
      badgeColor: 'text-green-600 bg-green-50',
    },
    {
      title: 'Centros Poblados',
      value: stats.totalCentrosPoblados.toLocaleString(),
      badge: `${((stats.centrosConPueblo / stats.totalCentrosPoblados) * 100).toFixed(0)}% con pueblo asignado`,
      icon: Users,
      color: 'border-l-blue-500',
      badgeColor: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Pueblos Indígenas',
      value: stats.totalPueblos.toLocaleString(),
      badge: `${stats.totalPueblos} pueblos distintos`,
      icon: TrendingUp,
      color: 'border-l-sis-orange',
      badgeColor: 'text-sis-orange bg-orange-50',
    },
    {
      title: 'Población total (localidades)',
      value: stats.poblacionTotalLocalidades.toLocaleString(),
      badge: 'Población censal',
      icon: BarChart3,
      color: 'border-l-purple-500',
      badgeColor: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <>
      <HeroBanner
        title="Buscador de localidades indígenas"
        subtitle="Ubica tu localidad cerca a tu ubicación a nivel nacional"
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6">
          {cards.map((s) => (
            <div
              key={s.title}
              className={`flex-1 min-w-[220px] bg-white rounded-lg border border-sis-border p-5 border-l-4 ${s.color} shadow-sm`}
            >
              <p className="text-sm text-sis-text-light mb-1">{s.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-sis-navy">{s.value}</span>
              </div>
              <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded ${s.badgeColor}`}>
                <s.icon className="w-3 h-3" />
                {s.badge}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mb-6 flex justify-center gap-2">
          <button
            onClick={() => navigate('/pueblos-indigenas/estadisticas')}
            className="bg-sis-red hover:bg-sis-red-hover text-white font-semibold py-2 px-4 rounded transition-colors cursor-pointer"
          >
            Ver más datos estadísticos
          </button>

          <button className="bg-sis-navy hover:bg-sis-navy-light text-white font-medium py-2 px-4 rounded transition-colors flex items-center gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Descargar Reporte Completo
          </button>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={[
            {
              id: 'localidad',
              label: 'Buscador por localidad',
              content: (
                <Suspense fallback={<Spinner />}>
                  <Localidades />
                </Suspense>
              ),
            },
            {
              id: 'centro-poblado',
              label: 'Buscador por centro poblado',
              content: (
                <Suspense fallback={<Spinner />}>
                  <CentrosPoblados />
                </Suspense>
              ),
            },
          ]}
          defaultTab="localidad"
        />
      </div>
    </>
  );
}
