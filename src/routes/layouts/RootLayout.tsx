import { Outlet } from 'react-router';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}

export function RootLayout() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        <Outlet />
      </div>
    </ErrorBoundary>
  );
}
