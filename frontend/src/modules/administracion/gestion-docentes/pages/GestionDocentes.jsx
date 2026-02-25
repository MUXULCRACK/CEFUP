import React, { useState } from 'react';
import DocenteForm from '../components/DocenteForm';
import UsuariosTable from '../components/UsuariosTable'; // Nombre exacto pedido por el profe

const GestionDocentes = () => {
    // Estado para refrescar la tabla cuando se cree un nuevo docente
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedDocente, setSelectedDocente] = useState(null);

    const handleDocenteCreated = () => {
        setRefreshTrigger(prev => prev + 1);
        setSelectedDocente(null);
    };

    const handleEditSelected = (docente) => {
        setSelectedDocente(docente);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handleCancelEdit = () => setSelectedDocente(null);

    return (
        <div className="container-fluid py-4">
            <div className="row">
                {/* Columna del Formulario: Basado en la HU de Crear/Editar [cite: 51, 52] */}
                <div className="col-lg-4 mb-4">
                    <DocenteForm onDocenteCreated={handleDocenteCreated} selectedDocente={selectedDocente} onCancelEdit={handleCancelEdit} />
                </div>

                {/* Columna de la Tabla: Con filtros y paginación [cite: 49, 50] */}
                <div className="col-lg-8">
                    <UsuariosTable refreshTrigger={refreshTrigger} onNotifyUpdate={handleDocenteCreated} onEditSelected={handleEditSelected} />
                </div>
            </div>
        </div>
    );
};

export default GestionDocentes;