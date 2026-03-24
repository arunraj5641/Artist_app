import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    progress: number;
}

interface ToastContextType {
    showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DURATION = 4000;

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    const [progress, setProgress] = useState(100);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Slide in
        const enterTimer = setTimeout(() => setVisible(true), 10);

        // Progress bar countdown
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
            setProgress(remaining);
            if (remaining <= 0) clearInterval(interval);
        }, 30);

        return () => {
            clearTimeout(enterTimer);
            clearInterval(interval);
        };
    }, []);

    const getAccent = () => {
        switch (toast.type) {
            case 'success': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', glow: 'rgba(16, 185, 129, 0.25)' };
            case 'error': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', glow: 'rgba(239, 68, 68, 0.25)' };
            case 'info': return { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', glow: 'rgba(236, 72, 153, 0.25)' };
        }
    };

    const getIcon = () => {
        const size = 18;
        switch (toast.type) {
            case 'success': return <CheckCircle size={size} />;
            case 'error': return <XCircle size={size} />;
            case 'info': return <AlertCircle size={size} />;
        }
    };

    const accent = getAccent();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: '320px',
                maxWidth: '420px',
                background: 'linear-gradient(135deg, rgba(38, 19, 37, 0.95) 0%, rgba(58, 29, 56, 0.95) 100%)',
                border: `1px solid ${accent.color}40`,
                borderRadius: '14px',
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accent.color}20, 0 4px 16px ${accent.glow}`,
                backdropFilter: 'blur(16px)',
                overflow: 'hidden',
                transform: visible ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.95)',
                opacity: visible ? 1 : 0,
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
        >
            {/* Main content row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px' }}>
                {/* Icon bubble */}
                <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: accent.bg,
                    border: `1px solid ${accent.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accent.color,
                    flexShrink: 0,
                    boxShadow: `0 2px 8px ${accent.glow}`,
                }}>
                    {getIcon()}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: accent.color,
                        marginBottom: '2px',
                    }}>
                        {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
                    </div>
                    <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#f1f5f9',
                        lineHeight: 1.4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {toast.message}
                    </div>
                </div>

                {/* Close button */}
                <button
                    onClick={() => onRemove(toast.id)}
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
                        (e.currentTarget as HTMLButtonElement).style.color = '#f1f5f9';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                        (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
                    }}
                >
                    <X size={14} />
                </button>
            </div>

            {/* Progress bar */}
            <div style={{ height: '2px', background: 'rgba(255,255,255,0.06)' }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${accent.color}80, ${accent.color})`,
                    transition: 'width 0.03s linear',
                    borderRadius: '0 0 2px 2px',
                }} />
            </div>
        </div>
    );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type, progress: 100 }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, DURATION + 400); // extra time for exit anim
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'flex-end',
            }}>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};
