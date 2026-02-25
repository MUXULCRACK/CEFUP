// app/modules/administracion/gestion_estudiantes/services/estudiantesService.api.js

const API_URL = "http://localhost:8000/api/v1/estudiantes/"; 

export const estudiantesService = {
    /**
     * Obtiene el listado de estudiantes activos con JOIN.
     */
    getAll: async (filtro = "", skip = 0, limit = 10, estado = "Activo") => {
        try {
            // Construimos la URL con los parámetros de búsqueda
            const query = `?filtro=${encodeURIComponent(filtro)}&skip=${skip}&limit=${limit}&estado=${encodeURIComponent(estado)}`;
            const response = await fetch(`${API_URL}${query}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al obtener la lista");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en getAll:", error);
            throw error;
        }
    },

    /**
     * Registra un nuevo estudiante (Persona + Estudiante).
     */
    create: async (estudianteData) => {
        try {
            const response = await fetch(`${API_URL}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(estudianteData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al crear");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en create:", error);
            throw error;
        }
    },

    /**
     * Actualiza datos en ambas tablas de MySQL.
     */
    update: async (id_persona, estudianteData) => {
        try {
            const response = await fetch(`${API_URL}${id_persona}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(estudianteData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al actualizar");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en update:", error);
            throw error;
        }
    },
    
    /**
     * Desactiva un estudiante (Eliminación Lógica).
     * CORRECCIÓN: El DELETE en FastAPI para este caso no suele llevar Body.
     */
    delete: async (id_persona) => {
        try {
            const response = await fetch(`${API_URL}${id_persona}`, {
                method: "DELETE"
                // No necesitamos headers ni body aquí porque el ID va en la URL
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al desactivar");
            }

            return await response.json();
        } catch (error) {
            console.error("Error en delete:", error);
            throw error;
        }
    }
    ,
    reactivate: async (id_persona) => {
        try {
            const response = await fetch(`${API_URL}${id_persona}/activar`, {
                method: "POST"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error al reactivar");
            }
            return await response.json();
        } catch (error) {
            console.error("Error en reactivate:", error);
            throw error;
        }
    }
};