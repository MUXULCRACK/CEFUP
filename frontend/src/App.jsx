import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import GestionDocentes from './modules/administracion/gestion-docentes/pages/GestionDocentes';
import GestionEstudiantes from './modules/administracion/gestion-estudiantes/pages/GestionEstudiantes';
import { ToastProvider } from './components/ToastProvider';



function App() {
  return (
    <ToastProvider>
    <Router>
      <div className="d-flex" id="wrapper">
        {/* Barra Lateral (Menú) */}
        <div className="bg-dark text-white p-3" style={{width: '250px', minHeight: '100vh'}}>
          <h3 className="text-center">CEFUP</h3>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto">
            <li className="nav-item">
              <Link to="/docentes" className="nav-link text-white">
                <i className="bi bi-person-badge me-2"></i> Gestión Docentes
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/estudiantes" className="nav-link text-white">
                <i className="bi bi-mortarboard me-2"></i> Gestión Estudiantes
              </Link>
            </li>
          </ul>
        </div>

        {/* Contenido Principal */}
        <div className="flex-grow-1 p-4 bg-light">
          <Routes>
            <Route path="/docentes" element={<GestionDocentes />} />
            <Route path="/estudiantes" element={<GestionEstudiantes />} />
            <Route path="/" element={<div className="container"><h1>Bienvenido al Sistema CEFUP</h1><p>Selecciona un módulo en el menú para comenzar.</p></div>} />
          </Routes>
        </div>
      </div>
    </Router>
    </ToastProvider>
  );
}

export default App;