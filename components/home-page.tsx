'use client'

import { useState, useEffect } from 'react';
import SearchSon from '../components/search-son';
import SearchParent from './search-parent';
import { FaceSmileIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
    const [role, setRole] = useState<string>('parent');
    const [sonCount, setSonCount] = useState<number | string | null>(null);
    const [isLoadingCount, setIsLoadingCount] = useState<boolean>(true); // 1. Track loading state

    useEffect(() => {
        let ignore = false;

        async function fetchUserCount() {
            setIsLoadingCount(true);
            try {
                const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
                    ? process.env.NEXT_PUBLIC_DEV_API_URL 
                    : process.env.NEXT_PUBLIC_PROD_API_URL;
                
                const response = await fetch(`${url}/sons/count`);
                const data = await response.json();
                
                if (!ignore && data) {
                    setSonCount(data.sonNumber);
                }
            } catch (error) {
                console.error('Failed to fetch candidate count:', error);
                if (!ignore) setSonCount('Wielu');
            } finally {
                if (!ignore) setIsLoadingCount(false);
            }
        }

        if (typeof document !== 'undefined') {
            const roleCookie = document.cookie
                .split('; ')
                .find((row) => row.startsWith('role='));
            
            const currentRole = roleCookie ? roleCookie.split('=')[1] : 'parent';

            if (currentRole === 'son') {
                setRole('son');
                setIsLoadingCount(false);
            } else {
                setRole('parent');
                fetchUserCount();
            }
        }

        return () => {
            ignore = true;
        };
    }, []); // 2. FIXED: Added empty dependency array to prevent infinite re-renders

    if (role === 'son') {
        return (
            <div className="space-y-2 font-serif">
                <p className="text-gray-900 text-xl">
                    Stwórz rodzinę
                </p>
                <SearchParent />
            </div>
        );
    }

    return (
        <div className="space-y-2 font-serif">
            <p className="text-gray-900 text-xl">
                Znajdź perfekcyjnego zięcia
            </p>
            
            <h2 className="text-gray-600 text-2xl font-bold flex items-center min-h-[36px]">
                {/* 3. Skeleton Loading indicator for the counter */}
                {isLoadingCount ? (
                    <span className="inline-block h-7 w-48 bg-gray-200 rounded animate-pulse" />
                ) : (
                    <>
                        <span>{sonCount ?? 'Wielu'} wspaniałych kandydatów czeka</span>
                        <FaceSmileIcon aria-hidden="true" className="size-6 inline ml-2 text-amber-500" />
                    </>
                )}
            </h2>
            
            <SearchSon />
        </div>
    );
}