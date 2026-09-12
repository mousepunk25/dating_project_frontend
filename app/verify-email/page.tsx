'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyEmailLoadingUI({ message = 'Weryfikowanie twojego adresu email...' }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center space-y-4">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em]"
          role="status"
        >
          <span className="sr-only">Ładowanie...</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {message}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Proszę czekać, trwa przekierowanie do serwisu.
        </p>
      </div>
    </div>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
      ? process.env.NEXT_PUBLIC_DEV_API_URL
      : process.env.NEXT_PUBLIC_PROD_API_URL;

  useEffect(() => {
    if (!token) {
      window.location.href = '/myprofile?error=missing-token';
      return;
    }

    window.location.href = `${apiBaseUrl}/verify-email?token=${encodeURIComponent(token)}`;
  }, [token, apiBaseUrl]);

  return <VerifyEmailLoadingUI />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoadingUI message="Ładowanie weryfikacji..." />}>
      <VerifyEmailContent />
    </Suspense>
  );
}