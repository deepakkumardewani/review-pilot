import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-600 dark:text-neutral-300 mx-auto" />
        <p className="mt-4 text-neutral-600 dark:text-neutral-300">
          Loading...
        </p>
      </div>
    </div>
  );
}
