"use client";

import React from "react";
import { IconRefresh, IconAlertTriangle } from "@tabler/icons-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <IconAlertTriangle size={28} className="text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-brand-dark">
            Something went wrong
          </h2>
          <p className="text-sm text-text-secondary max-w-md">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleRetry}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-accent text-white text-sm font-medium hover:bg-brand-accent/90 transition-colors"
          >
            <IconRefresh size={16} />
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
