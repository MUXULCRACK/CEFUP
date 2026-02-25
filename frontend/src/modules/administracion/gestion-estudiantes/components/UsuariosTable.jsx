import React, { useState, useEffect } from 'react';
import { estudiantesService } from '../services/estudiantesService.api';
import { useToast } from '../../../../components/ToastProvider';

/**
 * Componente de tabla para la gestión de estudiantes.
 * @param {number} refreshTrigger - Contador del padre para forzar recarga.
 * @param {function} onEditSelected - Función para enviar datos al formulario.
 * @param {function} onNotifyUpdate - Función para avisar al padre que algo cambió.
 */
const UsuariosTable = ({ refreshTrigger, onEditSelected, onNotifyUpdate }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [estado, setEstado] = useState("Activo");
    const [cargando, setCargando] = useState(false);
    const [modalState, setModalState] = useState({ show: false, action: null, id: null, nombre: '' });

    // 1. Efecto de carga de datos: Reacciona al trigger del padre o al escribir en el buscador
    useEffect(() => {
        const cargar = async () => {
            setCargando(true);
            try {
                // El filtro se envía directamente al backend (FastAPI se encarga del ILIKE)
                const data = await estudiantesService.getAll(filtro, 0, 10, estado);
                setEstudiantes(data);
            } catch (e) {
                console.error("Error al obtener listado de estudiantes:", e);
            } finally {
                setCargando(false);
            }
        };

        // Pequeño delay opcional (debounce) para no saturar el backend mientras escribes
        const timeoutId = setTimeout(() => cargar(), 300);
        return () => clearTimeout(timeoutId);

    }, [refreshTrigger, filtro, estado]);

    // 2. Lógica para desactivación (Borrado lógico) y reactivación usando modal
    const openConfirmModal = (action, est) => {
        const nombre = `${est.nombres || ''} ${est.apellidos || ''}`.trim();
        const documento = est.numero_documento_identidad || '';
        const email = est.email || '';
        setModalState({ show: true, action, id: est.id_persona, nombre, documento, email });
    };

    const closeModal = () => setModalState({ show: false, action: null, id: null, nombre: '' });

    const toast = useToast();

    const handleDesactivarConfirmed = async (id_persona) => {
        try {
            await estudiantesService.delete(id_persona);
            if (onNotifyUpdate) onNotifyUpdate();
            toast.addToast({ message: 'Registro desactivado exitosamente.', variant: 'success' });
        } catch (e) {
            toast.addToast({ message: 'Error: ' + (e.response?.data?.detail || e.message), variant: 'danger' });
        }
    };

    const handleReactivarConfirmed = async (id_persona) => {
        try {
            await estudiantesService.reactivate(id_persona);
            if (onNotifyUpdate) onNotifyUpdate();
            toast.addToast({ message: 'Registro reactivado exitosamente.', variant: 'success' });
        } catch (e) {
            toast.addToast({ message: 'Error: ' + (e.response?.data?.detail || e.message), variant: 'danger' });
        }
    };

    const handleModalConfirm = async () => {
        const { action, id } = modalState;
        closeModal();
        if (action === 'desactivar') await handleDesactivarConfirmed(id);
        if (action === 'reactivar') await handleReactivarConfirmed(id);
    };


    return (
        <div className="card shadow-sm border-0">
            {/* Buscador Superior */}
            <div className="card-header bg-white py-3 border-0">
                <div className="d-flex align-items-center justify-content-between">
                    <div style={{flex:1}}>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control bg-light border-start-0"
                                placeholder="Buscar por nombre o documento..."
                                value={filtro}
                                onChange={(e) => setFiltro(e.target.value)}
                            />
                            {cargando && (
                                <span className="input-group-text bg-light border-start-0">
                                    <div className="spinner-border spinner-border-sm text-success" role="status"></div>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="ms-3">
                        <select className="form-select form-select-sm" value={estado} onChange={(e) => setEstado(e.target.value)}>
                            <option value="Activo">Activos</option>
                            <option value="Inactivo">Inactivos</option>
                        </select>
                    </div>
                </div>
                
            </div>

            {/* Tabla de Resultados */}
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="ps-4">Identificación</th>
                            <th>Estudiante</th>
                            <th>Alergias / Observaciones</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {estudiantes.length > 0 ? (
                            estudiantes.map((est) => (
                                <tr key={est.id_persona}>
                                    <td className="ps-4 fw-bold text-secondary">
                                        {est.numero_documento_identidad}
                                    </td>
                                    <td>
                                        <div className="d-flex flex-column">
                                            <span className="fw-semibold">{est.nombres} {est.apellidos}</span>
                                            <small className="text-muted">{est.email || 'Sin correo'}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge rounded-pill ${est.alergias ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                                            <i className={`bi ${est.alergias ? 'bi-exclamation-triangle-fill' : 'bi-check-circle-fill'} me-1`}></i>
                                            {est.alergias || 'Sin novedades'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="btn-group btn-group-sm">
                                            <button
                                                className="btn btn-outline-primary"
                                                title="Editar datos"
                                                onClick={() => onEditSelected(est)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            {((est.estado || '').toLowerCase() === 'inactivo') ? (
                                                <button
                                                    className="btn btn-outline-success"
                                                    title="Reactivar"
                                                    onClick={() => openConfirmModal('reactivar', est)}
                                                >
                                                    <i className="bi bi-person-check-fill"></i>
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-outline-danger"
                                                    title="Desactivar"
                                                    onClick={() => openConfirmModal('desactivar', est)}
                                                >
                                                    <i className="bi bi-person-x-fill"></i>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-5">
                                    <i className="bi bi-info-circle fs-2 text-muted d-block mb-2"></i>
                                    {cargando ? "Cargando datos..." : "No se encontraron estudiantes para mostrar."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Modal de confirmación controlado por React (sin dependencia JS de Bootstrap) */}
            {modalState.show && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalState.action === 'desactivar' ? 'Confirmar desactivación' : 'Confirmar reactivación'}</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>
                                    {modalState.action === 'desactivar'
                                        ? '¿Está seguro de mover este registro al historial de inactivos?'
                                        : '¿Desea reactivar este estudiante y devolverlo a la lista de activos?'}
                                </p>
                                <p className="fw-semibold">{modalState.nombre}</p>
                                <dl className="row small mb-0">
                                    <dt className="col-4">Documento</dt>
                                    <dd className="col-8">{modalState.documento}</dd>
                                    <dt className="col-4">Email</dt>
                                    <dd className="col-8">{modalState.email || '—'}</dd>
                                </dl>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                                <button
                                    type="button"
                                    className={`btn ${modalState.action === 'desactivar' ? 'btn-danger' : 'btn-success'}`}
                                    onClick={handleModalConfirm}
                                >
                                    {modalState.action === 'desactivar' ? 'Desactivar' : 'Reactivar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsuariosTable;