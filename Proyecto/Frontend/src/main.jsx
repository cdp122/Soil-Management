import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import Auth from './Auth.jsx';
import App from './App.jsx';
import Inicio from './Inicio.jsx';
import Contacto from './Contacto.jsx';
import SuelosCRUD from './SuelosCRUD.jsx';
import Perfil from './Perfil.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/app" element={<App />}>
          <Route path="inicio" element={<Inicio />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="suelos" element={<SuelosCRUD />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
