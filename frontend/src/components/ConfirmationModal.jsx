import { X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="glass-card modal-content">
                <div className="modal-header">
                    <div className={`modal-icon ${type}`}>
                        <AlertTriangle size={24} />
                    </div>
                    <h3>{title}</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={onConfirm} className={`btn-${type}`}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
