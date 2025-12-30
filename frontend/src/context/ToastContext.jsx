import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastItem = ({ id, type, message, onClose }) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <AlertCircle size={20} />;
            default: return <Info size={20} />;
        }
    };

    const getClass = () => {
        switch (type) {
            case 'success': return 'success-alert';
            case 'error': return 'error-alert';
            default: return 'glass-card'; // Fallback
        }
    };

    return (
        <div className={`${getClass()} glass-card`} style={{
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            minWidth: '300px',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            {getIcon()}
            <span style={{ flex: 1 }}>{message}</span>
            <button onClick={() => onClose(id)} className="btn-icon">
                <X size={16} />
            </button>
        </div>
    );
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {toasts.map(toast => (
                    <ToastItem key={toast.id} {...toast} onClose={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};
