import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import ConsultaAsociado from './pages/ConsultaAsociado';
import LocalesEmpadronamiento from './pages/LocalesEmpadronamiento';
import LocalidadesConsulta from './pages/LocalidadesConsulta';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ConsultaAsociado />} />
        <Route path="consulta" element={<Navigate to="/" replace />} />
        <Route path="locales" element={<LocalesEmpadronamiento />} />
        <Route path="localidades" element={<LocalidadesConsulta />} />
      </Route>
    </Routes>
  );
}

export default App;
