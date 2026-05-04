import { HeroBanner } from '../components/HeroBanner';
import { Clock } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: Props) {
  return (
    <>
      <HeroBanner title={title} subtitle={description || 'Esta sección estará disponible próximamente'} />

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-sis-navy/5 rounded-full p-6 mb-6">
            <Clock className="w-16 h-16 text-sis-navy/50" />
          </div>
          <h2 className="text-2xl font-bold text-sis-navy mb-3">En construcción</h2>
          <p className="text-sis-text-light max-w-md">
            Estamos trabajando para ofrecerte esta funcionalidad. Vuelve pronto para acceder a este servicio.
          </p>
        </div>
      </div>
    </>
  );
}
