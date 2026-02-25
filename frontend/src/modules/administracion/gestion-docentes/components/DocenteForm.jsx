import React, { useState } from 'react';
import { docentesService } from '../services/docentesService.api';
import { useToast } from '../../../../components/ToastProvider';

import { useEffect } from 'react';

const DocenteForm = ({ onDocenteCreated, selectedDocente, onCancelEdit }) => {
    const initialDefaults = {
        // Datos de Persona
        tipo_documento_identidad: 'CC',
        numero_documento_identidad: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        estado_civil: 'Soltero',
        pais_residencia: 'Colombia',
        departamento_residencia: '',
        ciudad_residencia: '',
        direccion: '',
        telefono: '',
        email: '',
        tipo_sangre: 'O+',
        // Datos de Docente
        ultimo_titulo_profesional: '',
        actual_cargo: 'Docente',
        fecha_contratacion: new Date().toISOString().split('T')[0]
    };

    const [formData, setFormData] = useState(initialDefaults);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (selectedDocente && selectedDocente.id_persona) {
                await docentesService.update(selectedDocente.id_persona, formData);
                toast.addToast({ message: 'Docente actualizado con éxito', variant: 'success' });
            } else {
                await docentesService.create(formData);
                toast.addToast({ message: 'Docente registrado con éxito', variant: 'success' });
            }
            if (onDocenteCreated) onDocenteCreated(); // Recarga la tabla
            // Si estuvimos en modo edición, limpiar el formulario y salir del modo edición tras 2s
            if (selectedDocente && onCancelEdit) {
                setTimeout(() => {
                    setFormData(initialDefaults);
                    onCancelEdit();
                }, 2000);
            }
        } catch (error) {
            toast.addToast({ message: 'Error: ' + error.message, variant: 'danger' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (selectedDocente) {
            // populate form
            setFormData({
                tipo_documento_identidad: selectedDocente.tipo_documento_identidad || initialDefaults.tipo_documento_identidad,
                numero_documento_identidad: selectedDocente.numero_documento_identidad || initialDefaults.numero_documento_identidad,
                nombres: selectedDocente.nombres || initialDefaults.nombres,
                apellidos: selectedDocente.apellidos || initialDefaults.apellidos,
                fecha_nacimiento: selectedDocente.fecha_nacimiento ? selectedDocente.fecha_nacimiento.split('T')[0] : initialDefaults.fecha_nacimiento,
                estado_civil: selectedDocente.estado_civil || initialDefaults.estado_civil,
                pais_residencia: selectedDocente.pais_residencia || initialDefaults.pais_residencia,
                departamento_residencia: selectedDocente.departamento_residencia || initialDefaults.departamento_residencia,
                ciudad_residencia: selectedDocente.ciudad_residencia || initialDefaults.ciudad_residencia,
                direccion: selectedDocente.direccion || initialDefaults.direccion,
                telefono: selectedDocente.telefono || initialDefaults.telefono,
                email: selectedDocente.email || initialDefaults.email,
                tipo_sangre: selectedDocente.tipo_sangre || initialDefaults.tipo_sangre,
                ultimo_titulo_profesional: selectedDocente.ultimo_titulo_profesional || initialDefaults.ultimo_titulo_profesional,
                actual_cargo: selectedDocente.actual_cargo || initialDefaults.actual_cargo,
                fecha_contratacion: selectedDocente.fecha_contratacion ? selectedDocente.fecha_contratacion.split('T')[0] : initialDefaults.fecha_contratacion
            });
        } else {
            // reset to defaults when no selection
            setFormData(initialDefaults);
        }
    }, [selectedDocente]);

    const headerClass = selectedDocente ? 'card-header bg-warning text-dark' : 'card-header bg-info text-white';
    const headerIcon = selectedDocente ? 'bi bi-pencil-square' : 'bi bi-person-plus-fill';

    return (
        <div className="card shadow-sm">
            <div className={headerClass}>
                <h5 className="mb-0"><i className={headerIcon}></i> {selectedDocente ? 'Editar Docente' : 'Registrar Nuevo Docente'}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <fieldset disabled={isSubmitting}>
                    <div className="row g-3">
                        {/* Fila 1: Documento */}
                        <div className="col-md-4">
                            <label className="form-label">Tipo Doc.</label>
                            <select className="form-select" name="tipo_documento_identidad" onChange={handleChange} value={formData.tipo_documento_identidad}>
                                <option value="CC">CC</option>
                                <option value="TI">TI</option>
                                <option value="CE">CE</option>
                            </select>
                        </div>
                        <div className="col-md-8">
                            <label className="form-label">Número Documento</label>
                            <input type="text" className="form-control" name="numero_documento_identidad" required onChange={handleChange} value={formData.numero_documento_identidad} />
                        </div>

                        {/* Fila 2: Nombres y Apellidos */}
                        <div className="col-md-6">
                            <label className="form-label">Nombres</label>
                            <input type="text" className="form-control" name="nombres" required onChange={handleChange} value={formData.nombres} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Apellidos</label>
                            <input type="text" className="form-control" name="apellidos" required onChange={handleChange} value={formData.apellidos} />
                        </div>

                        {/* Fila 3: Fechas */}
                        <div className="col-md-6">
                            <label className="form-label">F. Nacimiento</label>
                            <input type="date" className="form-control" name="fecha_nacimiento" required onChange={handleChange} value={formData.fecha_nacimiento} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">F. Contratación</label>
                            <input type="date" className="form-control" name="fecha_contratacion" value={formData.fecha_contratacion} onChange={handleChange} />
                        </div>

                        {/* Fila 4: Contacto */}
                        <div className="col-md-6">
                            <label className="form-label">Email Personal</label>
                            <input type="email" className="form-control" name="email" placeholder="correo@ejemplo.com" onChange={handleChange} value={formData.email} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Teléfono</label>
                            <input type="text" className="form-control" name="telefono" onChange={handleChange} value={formData.telefono} />
                        </div>

                        {/* Fila 5: Perfil Profesional (Tabla Docente) */}
                        <div className="col-md-8">
                            <label className="form-label">Título Profesional</label>
                            <input type="text" className="form-control" name="ultimo_titulo_profesional" placeholder="Ej: Ing. de Sistemas" onChange={handleChange} value={formData.ultimo_titulo_profesional} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Cargo</label>
                            <input type="text" className="form-control" name="actual_cargo" value={formData.actual_cargo} onChange={handleChange} />
                        </div>

                        <div className="col-12 text-center mt-4 d-flex gap-2">
                            {selectedDocente && (
                                <button type="button" className="btn btn-secondary w-25" onClick={() => { if (onCancelEdit) onCancelEdit(); setFormData(initialDefaults); }} disabled={isSubmitting}>
                                    ✖ Cancelar
                                </button>
                            )}
                            <button type="submit" className="btn btn-info text-white flex-grow-1 shadow-sm" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {selectedDocente ? 'Actualizando...' : 'Registrando...'}
                                    </>
                                ) : (
                                    (selectedDocente ? 'Actualizar Docente' : '🚀 Registrar Docente')
                                )}
                            </button>
                        </div>
                    </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default DocenteForm;