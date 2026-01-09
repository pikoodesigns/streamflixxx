'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-netflix-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-netflix-red mb-4">Oops!</h1>
        <h2 className="text-xl md:text-2xl text-white mb-4">Something went wrong</h2>
        <p className="text-netflix-light-gray mb-8 max-w-md mx-auto">
          We're having trouble loading this page. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-8 py-3 bg-netflix-red text-white font-semibold rounded hover:bg-netflix-red-hover transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-8 py-3 border border-white text-white font-semibold rounded hover:bg-white hover:text-black transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
