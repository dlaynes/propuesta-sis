import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Component stack:', info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-sis-bg px-4" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="bg-white rounded-lg border border-sis-border p-8 max-w-md w-full text-center shadow-sm">
            <div className="bg-red-50 rounded-full p-4 inline-flex mb-4">
              <AlertTriangle className="w-10 h-10 text-sis-red" />
            </div>
            <h2 className="text-xl font-bold text-sis-navy mb-2">Algo salió mal</h2>
            <p className="text-sis-text-light mb-6">
              Ha ocurrido un error inesperado. Puedes intentar recargar la página.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-sis-text-light cursor-pointer hover:text-sis-navy">
                  Detalles del error
                </summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded text-sm text-sis-text overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 bg-sis-navy hover:bg-sis-navy-dark text-white font-semibold py-2.5 px-6 rounded transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
