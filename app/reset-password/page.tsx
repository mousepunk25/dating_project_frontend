import { Suspense } from 'react';
import ResetPasswordForm from '@/components/reset-password';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resetuj hasło',
};

function ResetPasswordFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-lg ring-1 ring-gray-900/5 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center">
                    <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
                <p className="text-sm font-medium text-gray-600">Loading reset form...</p>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<ResetPasswordFallback />}>
            <ResetPasswordForm />
        </Suspense>
    );
}