import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

interface ErrorProps {
  message: string | null;
}

export default function Error({ message }: ErrorProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (!message || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <AlertDescription>{message}</AlertDescription>
        </div>
        <button onClick={handleDismiss} className="hover:text-foreground transition-colors">
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </Alert>
  );
}
