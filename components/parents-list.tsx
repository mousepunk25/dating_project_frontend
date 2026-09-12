'use client'

import { useEffect, useState } from 'react';
import ParentCart from '@/components/parent-cart';

interface Parent {
  _id: string;
  fullName: string;
  job: string;
  address: {
    _id: string;
    city: string;
    country: string;
    longitude: string;
    latitude: string;
  };
}

// Lightweight skeleton loader for candidate cards
function ParentCardSkeleton() {
  return (
    <div className="border-2 rounded-lg p-4 m-2 bg-white animate-pulse space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 mt-4" />
    </div>
  );
}

export default function ParentsList({
    city,
    sonAge
}: {
    city: string | undefined,
    sonAge: string | undefined
}) {
    const [parentsList, setParentsList] = useState<Parent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
      ? process.env.NEXT_PUBLIC_DEV_API_URL 
      : process.env.NEXT_PUBLIC_PROD_API_URL;

    useEffect(() => {
        let ignore = false;

        async function fetchParentsList() {
            setIsLoading(true);
            setError(null);

            try {
                const queryCity = city ? encodeURIComponent(city) : '';
                const queryAge = sonAge ? encodeURIComponent(sonAge) : '';

                const parentsListResponse = await fetch(
                  `${url}/parents?city=${queryCity}&sonAge=${queryAge}`, 
                  {
                    method: 'GET',
                    credentials: 'include'
                  }
                );

                if (!parentsListResponse.ok) {
                    throw new Error('Nie udało się pobrać listy kandydatów.');
                }

                const parentsListJSON = await parentsListResponse.json();

                if (!ignore) {
                    setParentsList(Array.isArray(parentsListJSON) ? parentsListJSON : []);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err instanceof Error ? err.message : 'Wystąpił błąd');
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        fetchParentsList();

        return () => {
            ignore = true;
        };
    }, [city, sonAge, url]); // FIXED: Added missing filter dependencies

    // 1. Loading State (Skeleton Grid)
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 my-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                    <ParentCardSkeleton key={idx} />
                ))}
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div className="my-6 text-center text-red-600 font-serif">
                <p>{error}</p>
            </div>
        );
    }

    // 3. Empty Results State
    if (parentsList.length === 0) {
        return (
            <div className="my-6 text-center text-gray-500 font-serif">
                <h2>Brak kandydatów spełniających podane kryteria.</h2>
            </div>
        );
    }

    // 4. Success State
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-6 my-6">
            {parentsList.map((parent) => (
                <ParentCart 
                    key={parent._id}
                    parentId={parent._id}
                    parentFullName={parent.fullName}
                    parentCity={parent.address?.city}
                    parentJob={parent.job} 
                />
            ))}
        </div>
    );
}