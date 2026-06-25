"use client";

import { Button } from "@/components/ui/Button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="font-heading text-6xl font-bold text-primary-600">500</h1>
      <h2 className="mt-4 font-heading text-2xl font-bold text-neutral-800">Something Went Wrong</h2>
      <p className="mt-2 text-neutral-500 max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-8">
        <Button onClick={reset}>Try Again</Button>
      </div>
    </div>
  );
}