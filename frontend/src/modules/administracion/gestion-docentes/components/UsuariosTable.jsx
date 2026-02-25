import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../../../../components/ToastProvider';
import { docentesService } from '../services/docentesService.api';

const UsuariosTable = ({ refreshTrigger, onNotifyUpdate, onEditSelected }) => {
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('');
    const [estado, setEstado] = useState('Activo');
    const [skip] = useState(0);
    const [limit] = useState(1000);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTarget, setModalTarget] = useState(null);
    const toast = useToast();
    const debounceRef = useRef(null);

    const cargarDocentes = async (f = filtro, st = estado) => {
        try {
            setLoading(true);
            const data = await docentesService.getAll(f, skip, limit, st);
            setDocentes(data || []);
        } catch (error) {
            console.error('Error al cargar docentes:', error);
            toast?.addToast({ message: 'No se pudo cargar los docentes', variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDocentes();
    }, [refreshTrigger]);

    useEffect(() => {
        // debounce filtro
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => cargarDocentes(filtro, estado), 350);
        return () => clearTimeout(debounceRef.current);
    }, [filtro, estado]);

    const openConfirmModal = (persona, action) => {
        setModalTarget({ persona, action });
        setModalOpen(true);
    };

    const handleModalConfirm = async () => {
        if (!modalTarget) return;
        const { persona, action } = modalTarget;
        console.log('Confirm action', action, 'for', persona && persona.id_persona);
        try {
            if (action === 'desactivar') {
                const res = await docentesService.delete(persona.id_persona);
                console.log('Desactivar response', res);
                toast.addToast({ message: 'Docente desactivado correctamente', variant: 'success' });
            } else if (action === 'reactivar') {
                const res = await docentesService.reactivate(persona.id_persona);
                console.log('Reactivar response', res);
                toast.addToast({ message: 'Docente reactivado correctamente', variant: 'success' });
            }
            setModalOpen(false);
            setModalTarget(null);
            cargarDocentes();
            if (typeof onNotifyUpdate === 'function') onNotifyUpdate();
        } catch (error) {
            console.error('Acción fallida:', error);
            const msg = error?.message || String(error) || 'La acción falló';
            toast.addToast({ message: msg, variant: 'danger' });
        }
    };

    if (loading) return <div className="text-center p-3">Cargando docentes...</div>;

    return (
        <>
            <div className="d-flex align-items-center gap-2 mb-2">
                <input
                    className="form-control form-control-sm me-2"
                    placeholder="Buscar por nombre, documento o apellido"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
                <select className="form-select form-select-sm" value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                    <option value="">Todos</option>
                </select>
            </div>

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-primary">
                        <tr>
                            <th>Identificación</th>
                            <th>Nombre Completo</th>
                            <th>Título Profesional</th>
                            <th>Cargo</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                            {docentes.length > 0 ? (
                            docentes.map((docente) => (
                                <tr key={docente.id_persona}>
                                    <td>{docente.tipo_documento_identidad} {docente.numero_documento_identidad}</td>
                                    <td>{docente.nombres} {docente.apellidos}</td>
                                    <td>{docente.ultimo_titulo_profesional || 'No registrado'}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="badge bg-info text-dark">{docente.actual_cargo || 'Docente'}</span>
                                            {/* Mostrar estado si está presente, si no usar el filtro actual */}
                                            <span className={"badge " + (((docente.estado || estado) || '').toLowerCase() === 'inactivo' ? 'bg-secondary text-white' : 'bg-success text-white')}>
                                                {docente.estado || (estado || 'Activo')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        {/** Determina si la fila es considerada inactiva: por campo o por filtro seleccionado */}
                                        {(() => {
                                            const isInactive = docente.estado ? (String(docente.estado).toLowerCase() === 'inactivo') : (estado === 'Inactivo');
                                            return (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-outline-warning me-1"
                                                        onClick={() => typeof onEditSelected === 'function' && onEditSelected(docente)}
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    {isInactive ? (
                                                        <button className="btn btn-sm btn-outline-success" onClick={() => openConfirmModal(docente, 'reactivar')}>
                                                            <i className="bi bi-arrow-counterclockwise"></i>
                                                        </button>
                                                    ) : (
                                                        <button className="btn btn-sm btn-outline-danger" onClick={() => openConfirmModal(docente, 'desactivar')}>
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-muted">
                                    No hay docentes registrados en el sistema.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal confirm */}
            {modalOpen && modalTarget && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmar acción</h5>
                                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de realizar la siguiente acción?</p>
                                <p><strong>Documento:</strong> {modalTarget.persona.numero_documento_identidad}</p>
                                <p><strong>Email:</strong> {modalTarget.persona.email || 'No registrado'}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancelar</button>
                                <button type="button" className={"btn " + (modalTarget.action === 'desactivar' ? 'btn-danger' : 'btn-success')} onClick={handleModalConfirm}>
                                    {modalTarget.action === 'desactivar' ? 'Desactivar' : 'Reactivar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UsuariosTable;