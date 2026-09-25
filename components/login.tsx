'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function Spinner({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

function NotificationBanners() {
  const searchParams = useSearchParams();

  const status = searchParams.get('status');
  const error = searchParams.get('error');
  const verified = searchParams.get('verified');

  if (!status && !error && !verified) return null;

  return (
    <div className="mb-6 space-y-3">
      {status === 'verification-sent' && (
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-800">
            Wiadomość z weryfikacją adresu email została wysłana!
          </p>
          <p className="mt-1 text-sm text-blue-700">
            Sprawdź swoją skrzynkę i kliknij link potwierdzający Twój adres email zanim się zalogujesz. Jeśli nie widzisz maila, sprawdź folder SPAM.
          </p>
        </div>
      )}

      {verified === 'true' && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <p className="text-sm font-medium text-green-800">
            Email został zweryfikowany!
          </p>
          <p className="mt-1 text-sm text-green-700">
            Twoje konto jest aktywne. Możesz się zalogować poniżej.
          </p>
        </div>
      )}

      {error === 'missing-token' && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">
            Nieprawidłowy link weryfikacyjny
          </p>
          <p className="mt-1 text-sm text-red-700">
            W linku brakowało wymaganego parametru. Wyślij kolejną wiadomość z weryfikacją adresu email.
          </p>
        </div>
      )}

      {error === 'invalid-or-expired-token' && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">
            Link się przedawnił lub jest nieprawidłowy.
          </p>
          <p className="mt-1 text-sm text-red-700">
            Twój link weryfikacyjny się przedawnił. Zaloguj się albo poproś o wysłanie nowego linku.
          </p>
        </div>
      )}

      {error === 'email-not-verified' && (
        <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
          <p className="text-sm font-medium text-amber-800">
            Adres email niezweryfikowany.
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Musisz zweryfikować adres email zanim się zalogujesz.
          </p>
        </div>
      )}

      {error === 'invalid-credentials' && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">
            Nieprawidłowe dane logowania.
          </p>
          <p className="mt-1 text-sm text-red-700">
            Nieprawidłowy email lub hasło. Spróbuj jeszcze raz.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
    ? process.env.NEXT_PUBLIC_DEV_API_URL 
    : process.env.NEXT_PUBLIC_PROD_API_URL;

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Zaloguj się
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense fallback={null}>
          <NotificationBanners />
        </Suspense>

        <form 
          action={`${url}/login`} 
          method="POST" 
          onSubmit={() => setIsSubmitting(true)} 
          className="space-y-6"
        >
          <div>
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Hasło
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
            <div className="text-sm mt-1">
              <a href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Nie pamiętasz hasła?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-cahir-armor px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cahir-blood focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cahir-blood disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-4 text-white" />
                  <span>Logowanie...</span>
                </>
              ) : (
                'Zaloguj'
              )}
            </button>
          </div>
          <div className="text-sm mt-4">
              <a href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Nie masz konta? - załóż je
              </a>
            </div>
        </form>
      </div>
    </div>
  );
}