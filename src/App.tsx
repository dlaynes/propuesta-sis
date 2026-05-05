import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import ConsultaAsociado from './pages/ConsultaAsociado';
import LocalesEmpadronamiento from './pages/LocalesEmpadronamiento';
import PueblosIndigenasConsulta from './pages/PueblosIndigenasConsulta';
import PueblosIndigenasEstadisticas from './pages/PueblosIndigenasEstadisticas';
import PueblosIndigenasLocalidad from './pages/PueblosIndigenasLocalidad';
import PueblosIndigenasMapa from './pages/PueblosIndigenasMapa';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<ConsultaAsociado />} />
        <Route path="consulta" element={<Navigate to="/" replace />} />
        <Route path="locales" element={<LocalesEmpadronamiento />} />
        <Route path="pueblos-indigenas" element={<PueblosIndigenasConsulta />} />
        <Route path="pueblos-indigenas/estadisticas" element={<PueblosIndigenasEstadisticas />} />
        <Route path="pueblos-indigenas/localidad" element={<PueblosIndigenasLocalidad />} />
        <Route path="pueblos-indigenas/mapa" element={<PueblosIndigenasMapa />} />
      </Route>
    </Routes>
    </ErrorBoundary>
  );
}

export default App;
