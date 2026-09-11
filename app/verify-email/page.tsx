'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
      ? process.env.NEXT_PUBLIC_DEV_API_URL
      : process.env.NEXT_PUBLIC_PROD_API_URL;

  useEffect(() => {
    // 1. If no token in URL, redirect directly to login/myprofile page with error
    if (!token) {
      window.location.href = '/myprofile?error=missing-token';
      return;
    }

    // 2. Direct browser redirection option: hit backend verify endpoint
    // The Express backend controller will perform its database updates and issue a 302 redirect.
    window.location.href = `${apiBaseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  }, [token, apiBaseUrl]);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        {!error ? (
          <div className="space-y-4">
            {/* Loading Spinner */}
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]" role="status">
              <span className="sr-only">Ładowanie...</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Weryfikowanie twojego adresu email...
            </h2>
            <p className="text-sm text-gray-500">
              Proszę czekać zanim potwierdzimy szczegóły twojego konta.
            </p>
          </div>
        ) : (
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center p-12 text-center text-sm text-gray-500">
          Weryfikacja...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}