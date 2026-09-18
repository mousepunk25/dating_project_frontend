'use client'

import { useEffect, useState } from 'react';
import SaveButton from '@/components/save-button';
import AddFriendButton from '@/components/add-friend-button';

interface Parent {
    _id: string;
    fullName: string;
    job: string;
    sonAgeMin?: number;
    sonAgeMax?: number;
    address: {
        _id: string;
        city: string;
        country: string;
        longitude: string;
        latitude: string;
    };
}

export default function ParentProfile({
    parentId,
}: {
    parentId: string
}) {
    const [parent, setParent] = useState<Parent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
        ? process.env.NEXT_PUBLIC_DEV_API_URL 
        : process.env.NEXT_PUBLIC_PROD_API_URL;

    useEffect(() => {
        let ignore = false;
        
        async function fetchParent() {
            setIsLoading(true);
            setError(null);
            
            try {
                const parentResponse = await fetch(`${url}/parents/${parentId}`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!parentResponse.ok) {
                    throw new Error(parentResponse.status === 404 ? 'Nie znaleziono użytkownika' : 'Błąd pobierania danych');
                }

                const parentJSON = await parentResponse.json();
                
                if (!ignore) {
                    console.log(parentJSON);
                    setParent(parentJSON);
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

        fetchParent();

        return () => {
            ignore = true;
        };
    }, [parentId, url]);

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="mt-6 font-serif animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
        );
    }

    // 2. Error or Not Found State
    if (error || !parent) {
        return (
            <div className="mt-6 font-serif text-red-600">
                <h2>{error || 'Nie znaleziono użytkowników'}</h2>
            </div>
        );
    }

    // 3. Success State
    return (
        <div className="mt-6 font-serif">
            <div className="flex flex-col">
                <div className="mt-3 block">
                    <h1 className="text-xl font-bold">{parent.fullName}, miasto: {parent.address?.city}</h1>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 pt-2">
                    <SaveButton sonProfileId={parent._id} />
                    <AddFriendButton sonProfileId={parent._id} />
                </div>
            </div>
            <div className="text-lg mt-2 flex">
                <h3 className="font-bold">Praca: </h3> 
                <span className="ml-2">{parent.job}</span>
            </div>
            <div className="text-lg mt-2 flex">
                <h3 className="font-bold">Minimalny wiek kandydata: </h3> 
                <span className="ml-2">{parent.sonAgeMin ?? 'Brak danych'}</span>
            </div>
            <div className="text-lg mt-2 flex">
                <h3 className="font-bold">Maksymalny wiek kandydata: </h3> 
                <span className="ml-2">{parent.sonAgeMax ?? 'Brak danych'}</span>
            </div>
        </div>
    );
}