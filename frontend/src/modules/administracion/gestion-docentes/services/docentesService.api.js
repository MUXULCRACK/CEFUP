// Actualizamos la URL para que incluya el prefijo api/v1 y la barra final
const API_URL = "http://localhost:8000/api/v1/docentes/"; 

export const docentesService = {
    getAll: async (filtro = "", skip = 0, limit = 10, estado = "Activo") => {
        try {
            const query = `?filtro=${encodeURIComponent(filtro)}&skip=${skip}&limit=${limit}&estado=${encodeURIComponent(estado)}`;
            const url = `${API_URL}${query}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error("Error al obtener docentes");
            const text = await response.text();
            try { return JSON.parse(text); } catch { return text; }
        } catch (error) {
            console.error("Error en docentesService.getAll:", error);
            throw error;
        }
    },

    create: async (docenteData) => {
        try {
            const response = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(docenteData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al crear docente");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en docentesService.create:", error);
            throw error;
        }
    }
    ,
    delete: async (id_persona) => {
        try {
            const response = await fetch(`${API_URL}${id_persona}`, { method: 'DELETE' });
            if (!response.ok) {
                let errText = 'Error al desactivar';
                try { const e = await response.json(); errText = e.detail || JSON.stringify(e); } catch { errText = await response.text(); }
                throw new Error(errText);
            }
            // backend may return JSON or empty body
            try { return await response.json(); } catch { return { message: 'OK' }; }
        } catch (error) {
            console.error('Error en docentesService.delete:', error);
            throw error;
        }
    },
    reactivate: async (id_persona) => {
        try {
            const response = await fetch(`${API_URL}${id_persona}/activar`, { method: 'POST' });
            if (!response.ok) {
                let errText = 'Error al reactivar';
                try { const e = await response.json(); errText = e.detail || JSON.stringify(e); } catch { errText = await response.text(); }
                throw new Error(errText);
            }
            try { return await response.json(); } catch { return { message: 'OK' }; }
        } catch (error) {
            console.error('Error en docentesService.reactivate:', error);
            throw error;
        }
    }
,
    update: async (id_persona, payload) => {
        try {
            const response = await fetch(`${API_URL}${id_persona}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                let errText = 'Error al actualizar';
                try { const e = await response.json(); errText = e.detail || JSON.stringify(e); } catch { errText = await response.text(); }
                throw new Error(errText);
            }
            try { return await response.json(); } catch { return { message: 'OK' }; }
        } catch (error) {
            console.error('Error en docentesService.update:', error);
            throw error;
        }
    }
};