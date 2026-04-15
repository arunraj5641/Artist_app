import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          minHeight: '300px',
          textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20, fontSize: 28,
          }}>⚠️</div>
          <h2 style={{ color: '#f1f5f9', marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#64748b', marginBottom: 8, fontSize: '0.875rem', maxWidth: 400 }}>
            This page encountered an error. Check the browser console for details.
          </p>
          <p style={{
            color: '#ef4444', fontSize: '0.78rem',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '8px 16px',
            marginBottom: 24, maxWidth: 480,
            fontFamily: 'monospace', wordBreak: 'break-word',
          }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: 'linear-gradient(135deg, #9400D3, #8b5cf6)',
              border: 'none', borderRadius: 10, padding: '10px 24px',
              color: 'white', fontWeight: 600, cursor: 'pointer',
              fontSize: '0.875rem', fontFamily: 'Inter, sans-serif',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
