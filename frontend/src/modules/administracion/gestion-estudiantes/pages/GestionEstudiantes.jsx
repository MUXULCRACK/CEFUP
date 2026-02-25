import React, { useState, useCallback } from 'react';
import EstudianteForm from '../components/EstudianteForm.jsx';
import UsuariosTable from '../components/UsuariosTable.jsx';

const GestionEstudiantes = () => {
    const [refreshSignal, setRefreshSignal] = useState(0);
    const [estudianteParaEditar, setEstudianteParaEditar] = useState(null);

    // ✅ Memoriza esta función para que UsuariosTable no se refresque sin parar
    const notifyUpdate = useCallback(() => {
        setRefreshSignal(prev => prev + 1);
        setEstudianteParaEditar(null);
    }, []);

    const handleEdit = useCallback((estudiante) => {
        setEstudianteParaEditar(estudiante);
    }, []);

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="text-success mb-4">Módulo: Gestión de Estudiantes</h2>
                    <p className="text-muted">Registro de información académica y médica para CEFUP.</p>
                    <hr />
                </div>
                
                <div className="col-md-4">
                    <div className="card shadow-sm border-success">
                        <div className="card-body">
                            <h5 className="card-title text-success">
                                {estudianteParaEditar ? "📝 Editar Estudiante" : "➕ Nuevo Estudiante"}
                            </h5>
                            <EstudianteForm 
                                onEstudianteCreated={notifyUpdate} 
                                estudianteEdit={estudianteParaEditar} 
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Listado de Estudiantes Activos</h5>
                            {/* CONEXIÓN CRÍTICA: onNotifyUpdate permite que la tabla 
                                se refresque sola al desactivar un registro */}
                            <UsuariosTable 
                                refreshTrigger={refreshSignal} 
                                onEditSelected={handleEdit} 
                                onNotifyUpdate={notifyUpdate} 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestionEstudiantes;