import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  onRetry: () => void;
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}
