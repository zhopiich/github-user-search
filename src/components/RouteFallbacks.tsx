interface PageLoadingFallbackProps {
  label?: string
}

interface PageErrorFallbackProps {
  error: Error
  onRetry: () => void
}

export function PageLoadingFallback({ label = 'Loading...' }: PageLoadingFallbackProps) {
  return (
    <div className="page">
      <p className="status">{label}</p>
    </div>
  )
}

export function PageErrorFallback({ error, onRetry }: PageErrorFallbackProps) {
  return (
    <div className="page route-error" role="alert">
      <p className="status error">{error.message}</p>
      <button className="retry-button" type="button" onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}
