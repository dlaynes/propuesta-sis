import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import ConsultaAsociado from './pages/ConsultaAsociado';
import LocalesEmpadronamiento from './pages/LocalesEmpadronamiento';
import LocalidadesConsulta from './pages/LocalidadesConsulta';
import LocalidadesEstadisticas from './pages/LocalidadesEstadisticas';
import LocalidadesDetalle from './pages/LocalidadesDetalle';
import LocalidadesMapa from './pages/LocalidadesMapa';
import ConsultaSisFoh from './pages/ConsultaSisFoh';
import ConsultaSusalud from './pages/ConsultaSusalud';
import EstablecimientosSalud from './pages/EstablecimientosSalud';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<ConsultaAsociado />} />
        <Route path="consulta" element={<Navigate to="/" replace />} />
        <Route path="locales" element={<LocalesEmpadronamiento />} />
        <Route path="localidades" element={<LocalidadesConsulta />} />
        <Route path="localidades/estadisticas" element={<LocalidadesEstadisticas />} />
        <Route path="localidades/detalle" element={<LocalidadesDetalle />} />
        <Route path="localidades/mapa" element={<LocalidadesMapa />} />
        <Route path="consultas-sis-foh" element={<ConsultaSisFoh />} />
        <Route path="consultas-susalud" element={<ConsultaSusalud />} />
        <Route path="establecimientos" element={<EstablecimientosSalud />} />
      </Route>
    </Routes>
    </ErrorBoundary>
  );
}

export default App;
