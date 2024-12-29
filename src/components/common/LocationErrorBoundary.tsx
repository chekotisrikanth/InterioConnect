import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class LocationErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error) {
    console.error('Location error caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-sm text-red-600">
          Error loading locations. Please try again later.
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-2 text-xs bg-red-50 p-2 rounded">
              {this.state.error?.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
