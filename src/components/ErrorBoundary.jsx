import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas-ice flex items-center justify-center p-4">
          <div className="text-center max-w-sm">
            <p className="text-[48px] mb-4">🌵</p>
            <h2 className="text-[20px] font-bold text-adaline-ink mb-2">Algo salió mal</h2>
            <p className="text-[14px] text-slate-mist mb-6">
              {this.state.error?.message || 'Error inesperado'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
