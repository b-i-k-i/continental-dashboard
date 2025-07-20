type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary?: () => void;
  context?: string; // Optional context message
};

export const ErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  // context = "application" 
}: ErrorFallbackProps) => {
  return (
    <div className="error-fallback" role="alert">
      
      {resetErrorBoundary
      && (
        <div className="global-error">
          <h2>Something went wrong</h2>
          <pre className="error-message">{error.message}</pre>
          <button onClick={resetErrorBoundary}>Retry</button>
          <a href="/">Return Home</a>
        </div>
      )
      }
    </div>
  );
};