'use client'

import { useState, useEffect } from 'react';
import SearchSon from '../components/search-son';
import SearchParent from './search-parent';
import { FaceSmileIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
    const [role, setRole] = useState('parent');
    const [sonCount, setSonCount] = useState('Many');

    useEffect(() => {
        let ignore = false;
        async function fetchUserCount() {
            const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;
            const data = await fetch(`${url}/sons/count`);
            const sonsNumber = await data.json();
            if (!ignore) {
                setSonCount(sonsNumber.sonNumber);
            }
        }
        if (typeof document !== 'undefined') {
            const role = document.cookie
                .split('; ')
                .find((row) => row.startsWith('role='));
            if (role && role.includes('=son')) {
                setRole(role);
            } else {
                fetchUserCount();
                return () => {
                    ignore = true;
                }
            }
        }
    });

    if (role.includes('=son')) {
        return (
            <div className="space-y-2 font-serif">
            <p className="text-gray-900 text-xl">
                Find perfect match
            </p>
            <SearchParent />
        </div>
        )
    }
    return (
        <div className="space-y-2 font-serif">
            <p className="text-gray-900 text-xl">
                Find perfect match
            </p>
            <h2 className="text-gray-600 text-2xl font-bold">
                {sonCount} great candidates is waiting for you
                <FaceSmileIcon aria-hidden="true" className="block size-6 group-data-open:hidden inline ml-1" />
            </h2>
            <SearchSon />
        </div>
    )
}