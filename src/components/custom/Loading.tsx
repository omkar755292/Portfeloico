interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message = "Loading...", fullScreen = true }: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? "min-h-screen" : "min-h-[200px]"
      } bg-background`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 animate-spin"></div>
          {/* Inner ring */}
          <div className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin absolute top-0 left-0"></div>
        </div>

        {/* Message */}
        <p className="text-muted-foreground text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
