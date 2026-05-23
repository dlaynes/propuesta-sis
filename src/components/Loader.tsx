export function Spinner() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-label="Cargando contenido">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sis-navy" aria-hidden="true"></div>
    </div>
  );
}
