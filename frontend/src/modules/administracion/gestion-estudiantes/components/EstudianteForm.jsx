import React, { useState, useEffect } from 'react';
import { estudiantesService } from '../services/estudiantesService.api';
import { useToast } from '../../../../components/ToastProvider';

const EstudianteForm = ({ onEstudianteCreated, estudianteEdit }) => {
    const [formData, setFormData] = useState({
        tipo_documento_identidad: 'CC',
        numero_documento_identidad: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        email: '',
        telefono: '',
        alergias: '',
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (estudianteEdit) {
            setFormData({
                tipo_documento_identidad: estudianteEdit.tipo_documento_identidad || 'CC',
                numero_documento_identidad: estudianteEdit.numero_documento_identidad || '',
                nombres: estudianteEdit.nombres || '',
                apellidos: estudianteEdit.apellidos || '',
                fecha_nacimiento: estudianteEdit.fecha_nacimiento || '',
                fecha_ingreso: estudianteEdit.fecha_ingreso || new Date().toISOString().split('T')[0],
                email: estudianteEdit.email || '',
                telefono: estudianteEdit.telefono || '',
                alergias: estudianteEdit.alergias || ''
            });
        }
    }, [estudianteEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (estudianteEdit && estudianteEdit.id_persona) {
                await estudiantesService.update(estudianteEdit.id_persona, formData);
                toast.addToast({ message: 'Estudiante actualizado correctamente.', variant: 'success' });
            } else {
                await estudiantesService.create(formData);
                toast.addToast({ message: 'Estudiante creado correctamente.', variant: 'success' });
            }
            if (onEstudianteCreated) onEstudianteCreated();
            if (!estudianteEdit) {
                setFormData({
                    tipo_documento_identidad: 'CC',
                    numero_documento_identidad: '',
                    nombres: '',
                    apellidos: '',
                    fecha_nacimiento: '',
                    fecha_ingreso: new Date().toISOString().split('T')[0],
                    email: '',
                    telefono: '',
                    alergias: '',
                });
            }
        } catch (err) {
            console.error(err);
            toast.addToast({ message: 'Error: ' + (err.message || 'Ocurrió un problema'), variant: 'danger' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="row g-3">
                <div className="col-md-4">
                    <label className="form-label">Tipo Doc.</label>
                    <select name="tipo_documento_identidad" className="form-select" value={formData.tipo_documento_identidad} onChange={handleChange}>
                        <option value="CC">CC</option>
                        <option value="TI">TI</option>
                        <option value="CE">CE</option>
                    </select>
                </div>

                <div className="col-md-8">
                    <label className="form-label">Documento</label>
                    <input name="numero_documento_identidad" className="form-control" value={formData.numero_documento_identidad} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Nombres</label>
                    <input name="nombres" className="form-control" value={formData.nombres} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Apellidos</label>
                    <input name="apellidos" className="form-control" value={formData.apellidos} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                    <label className="form-label">F. Nacimiento</label>
                    <input type="date" name="fecha_nacimiento" className="form-control" value={formData.fecha_nacimiento} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                    <label className="form-label">F. Ingreso</label>
                    <input type="date" name="fecha_ingreso" className="form-control" value={formData.fecha_ingreso} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com" />
                </div>

                <div className="col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
                </div>

                <div className="col-12">
                    <label className="form-label">Alergias / Observaciones</label>
                    <textarea name="alergias" className="form-control" rows="2" value={formData.alergias} onChange={handleChange}></textarea>
                </div>

                <div className="col-12 text-center mt-3">
                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                        {loading ? 'Guardando...' : (estudianteEdit ? 'Actualizar' : 'Crear')}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default EstudianteForm;