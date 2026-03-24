import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
    title?: string;
    message?: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    title = 'Delete Confirmation',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    confirmLabel = 'Delete',
    onConfirm,
    onClose,
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10000,
                padding: 16,
                animation: 'fadeIn 0.2s ease',
            }}
        >
            <style>{`
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translateY(10px) } to { opacity: 1; transform: scale(1) translateY(0) } }
            `}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'linear-gradient(135deg, rgba(38,19,37,0.98) 0%, rgba(23,10,22,0.98) 100%)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 20,
                    padding: '32px 28px 24px',
                    width: 400,
                    maxWidth: '90vw',
                    boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(239,68,68,0.08)',
                    animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    position: 'relative',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: 16, right: 16,
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8, width: 28, height: 28,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#f1f5f9'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#64748b'; }}
                >
                    <X size={14} />
                </button>

                {/* Warning Icon */}
                <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 20,
                    boxShadow: '0 4px 16px rgba(239,68,68,0.2)',
                }}>
                    <AlertTriangle size={26} style={{ color: '#ef4444' }} />
                </div>

                {/* Title */}
                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    fontFamily: 'Outfit, sans-serif',
                }}>
                    {title}
                </h3>

                {/* Message */}
                <p style={{
                    margin: '0 0 28px 0',
                    fontSize: '0.875rem',
                    color: '#94a3b8',
                    lineHeight: 1.6,
                }}>
                    {message}
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(239,68,68,0.1)', marginBottom: 20 }} />

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 10, padding: '9px 20px',
                            color: '#94a3b8', fontSize: '0.875rem',
                            fontWeight: 500, cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'Inter, sans-serif',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#f1f5f9'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; }}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                            border: 'none',
                            borderRadius: 10, padding: '9px 20px',
                            color: 'white', fontSize: '0.875rem',
                            fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 7,
                            boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
                            transition: 'all 0.25s',
                            fontFamily: 'Inter, sans-serif',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.45)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 14px rgba(239,68,68,0.3)';
                        }}
                    >
                        <Trash2 size={15} />
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
