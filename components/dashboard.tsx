'use client'

import { useEffect, useState } from 'react';
import Pulpit from './pulpit';
import Login from './login';

export default function Dashboard({
    profileId,
    logout,
    role
}: { 
    profileId: string | undefined,
    logout: string | undefined,
    role: 'son' | 'parent' | undefined
}) {
    const [hasMounted, setHasMounted] = useState(false);
    const isLoggedIn = profileId && logout !== 'true';

    useEffect(() => {
        setHasMounted(true);

        if (isLoggedIn) {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            const cookieDate = date.toUTCString();
            document.cookie = `profileId=${profileId}; expires=${cookieDate}; SameSite=None; Secure; path=/`;
            document.cookie = `role=${role}; expires=${cookieDate}; SameSite=None; Secure; path=/`;
        } else {
            document.cookie = "profileId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure; path=/";
            document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure; path=/";
        }
    }, [isLoggedIn, profileId, role]);

    // 1. Prevent screen flash before client hydration completes
    if (!hasMounted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-8 w-8 text-cahir-armor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">Ładowanie...</span>
                </div>
            </div>
        );
    }

    // 2. Render Pulpit only when authenticated and role is present
    if (isLoggedIn && role) {
        return <Pulpit profileId={profileId} role={role} />;
    }

    return <Login />;
}
