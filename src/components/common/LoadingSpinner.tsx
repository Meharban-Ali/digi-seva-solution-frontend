import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  label = "Loading...",
  className = "",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const content = (
    <div className={`flex flex-col items-center justify-center space-y-3 p-6 ${className}`}>
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
      {label && <p className="text-xs font-semibold text-slate-500 animate-pulse">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export default LoadingSpinner;
