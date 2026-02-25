import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

let idCounter = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(({ title = '', message = '', variant = 'success', timeout = 3500 }) => {
        const id = ++idCounter;
        setToasts((t) => [...t, { id, title, message, variant }]);
        setTimeout(() => {
            setToasts((t) => t.filter(x => x.id !== id));
        }, timeout);
    }, []);

    const removeToast = useCallback((id) => setToasts((t) => t.filter(x => x.id !== id)), []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 1080 }}>
                {toasts.map((t) => (
                    <div key={t.id} className={`toast show align-items-center text-bg-${t.variant} mb-2`} role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="d-flex">
                            <div className="toast-body">
                                {t.title && <strong className="me-1">{t.title}</strong>}
                                {t.message}
                            </div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => removeToast(t.id)}></button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
