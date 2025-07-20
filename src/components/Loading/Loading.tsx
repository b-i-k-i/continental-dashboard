type LoadingProps = {
  message?: string;
  fullScreen?: boolean;
};

export const Loading = ({ 
  message = "Loading...", 
  fullScreen = false 
}: LoadingProps) => {
  return (
    <div className={`loading ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loading-spinner" aria-hidden="true">
        {/* Optional: Add your custom spinner SVG or CSS animation */}
        <div className="spinner-circle" />
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};