'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function NotificationBanners() {
  const searchParams = useSearchParams();

  const status = searchParams.get('status');
  const error = searchParams.get('error');
  const verified = searchParams.get('verified');

  if (!status && !error && !verified) return null;

  return (
    <div className="mb-6 space-y-3">
      {/* 1. Verification Sent */}
      {status === 'verification-sent' && (
        <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
          <p className="text-sm font-medium text-blue-800">
            Verification email sent!
          </p>
          <p className="mt-1 text-sm text-blue-700">
            Please check your inbox and click the link to verify your account before logging in.
          </p>
        </div>
      )}

      {/* 2. Successfully Verified */}
      {verified === 'true' && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <p className="text-sm font-medium text-green-800">
            Email verified successfully!
          </p>
          <p className="mt-1 text-sm text-green-700">
            Your account is active. You can now sign in below.
          </p>
        </div>
      )}

      {/* 3. Missing Token */}
      {error === 'missing-token' && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">
            Invalid verification link
          </p>
          <p className="mt-1 text-sm text-red-700">
            The link was missing required parameters. Please request a new verification email.
          </p>
        </div>
      )}

      {/* 4. Invalid or Expired Token */}
      {error === 'invalid-or-expired-token' && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">
            Link expired or invalid
          </p>
          <p className="mt-1 text-sm text-red-700">
            Your verification link has expired. Please log in or request a new verification link.
          </p>
        </div>
      )}

      {/* 5. Unverified Account Error on Login Attempt */}
      {error === 'email-not-verified' && (
        <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
          <p className="text-sm font-medium text-amber-800">
            Account unverified
          </p>
          <p className="mt-1 text-sm text-amber-700">
            You must verify your email address before logging in.
          </p>
        </div>
      )}

      {/* 6. Invalid Credentials Error */}
      {error === 'invalid-credentials' && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">
            Invalid credentials
          </p>
          <p className="mt-1 text-sm text-red-700">
            Incorrect email address or password. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Login() {
  const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
    ? process.env.NEXT_PUBLIC_DEV_API_URL 
    : process.env.NEXT_PUBLIC_PROD_API_URL;

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Suspense fallback={null}>
          <NotificationBanners />
        </Suspense>

        <form action={`${url}/login`} method="POST" className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
              Email address
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
                Password
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
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-full bg-cahir-armor px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}