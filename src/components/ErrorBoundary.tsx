import type { ReactNode } from 'react'
import { Component } from 'react'

interface ErrorBoundaryFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: (props: ErrorBoundaryFallbackProps) => ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      error: error instanceof Error ? error : new Error('Something went wrong'),
    }
  }

  resetErrorBoundary = () => {
    this.props.onReset?.()
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        resetErrorBoundary: this.resetErrorBoundary,
      })
    }

    return this.props.children
  }
}
