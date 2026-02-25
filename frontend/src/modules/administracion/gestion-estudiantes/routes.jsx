import React from 'react';
import { Route } from 'react-router-dom';
import GestionEstudiantes from './pages/GestionEstudiantes';

// Esta es una ruta modular
const EstudiantesRoutes = [
    <Route key="gestion-estudiantes" path="/estudiantes" element={<GestionEstudiantes />} />
];

export default EstudiantesRoutes;