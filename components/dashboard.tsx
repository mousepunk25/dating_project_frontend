'use client'

import { useEffect } from 'react';
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
    const isLoggedIn = profileId && logout !== 'true';

    // Move all document interactions safely inside useEffect
    useEffect(() => {
        if (isLoggedIn) {
            const date = new Date();
            date.setDate(date.getDate() + 7);
            const cookieDate = date.toUTCString();
            document.cookie = `profileId=${profileId}; expires=${cookieDate}; SameSite=None; Secure; path=/`;
            document.cookie = `role=${role}; expires=${cookieDate}; SameSite=None; Secure; path=/`
        } else {
            document.cookie = "profileId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure; path=/";
            document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure; path=/";
        }
    }, [isLoggedIn, profileId]); // Re-run whenever login state or profileId changes

    // Keep your return statements clean and free of side-effects
    if (isLoggedIn) {
        return <Pulpit profileId={profileId} role={role}/>;
    }

    return <Login />;
}
