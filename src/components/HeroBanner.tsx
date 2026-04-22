interface HeroBannerProps {
  title: string;
  subtitle: string;
}

export function HeroBanner({ title, subtitle }: HeroBannerProps) {
  return (
    <section
      className="relative bg-cover bg-center"
      style={{ backgroundImage: 'url(/fondo.png)' }}
    >
      <div className="bg-sis-navy/75">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
          <p className="text-lg md:text-xl opacity-90">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
