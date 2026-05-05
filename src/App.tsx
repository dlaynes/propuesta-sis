import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Spinner } from './components/Loader';
import ConsultaAsociado from './pages/ConsultaAsociado';

const LocalesEmpadronamiento = lazy(() => import('./pages/LocalesEmpadronamiento'));
const PueblosIndigenasConsulta = lazy(() => import('./pages/PueblosIndigenasConsulta'));
const PueblosIndigenasEstadisticas = lazy(() => import('./pages/PueblosIndigenasEstadisticas'));
const PueblosIndigenasLocalidad = lazy(() => import('./pages/PueblosIndigenasLocalidad'));
const PueblosIndigenasCentroPoblado = lazy(() => import('./pages/PueblosIndigenasCentroPoblado'));
const PueblosIndigenasMapa = lazy(() => import('./pages/PueblosIndigenasMapa'));

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ConsultaAsociado />} />
          <Route path="consulta" element={<Navigate to="/" replace />} />
          <Route path="locales" element={
            <Suspense fallback={<Spinner />}>
              <LocalesEmpadronamiento />
            </Suspense>
          } />
          <Route path="pueblos-indigenas" element={
            <Suspense fallback={<Spinner />}>
              <PueblosIndigenasConsulta />
            </Suspense>
          } />
          <Route path="pueblos-indigenas/estadisticas" element={
            <Suspense fallback={<Spinner />}>
              <PueblosIndigenasEstadisticas />
            </Suspense>
          } />
          <Route path="pueblos-indigenas/localidad/:id" element={
            <Suspense fallback={<Spinner />}>
              <PueblosIndigenasLocalidad />
            </Suspense>
          } />
          <Route path="pueblos-indigenas/centro-poblado/:id" element={
            <Suspense fallback={<Spinner />}>
              <PueblosIndigenasCentroPoblado />
            </Suspense>
          } />
          <Route path="pueblos-indigenas/mapa" element={
            <Suspense fallback={<Spinner />}>
              <PueblosIndigenasMapa />
            </Suspense>
          } />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
