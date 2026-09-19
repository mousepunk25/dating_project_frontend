'use client'

import { useEffect, useState } from 'react';
import ParentCart from './parent-cart';
import SonsList from './sons-list';

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
  ? process.env.NEXT_PUBLIC_DEV_API_URL 
  : process.env.NEXT_PUBLIC_PROD_API_URL;

interface Candidate {
    _id: string;
    fullName: string;
    dateOfBirth: string;
    image: {
        url: string;
    };
    address: {
        city: string;
    };
    job: {
        position: string;
    } | string;
}

export default function SonParentWaiting({
    profileId,
    role
}: {
    profileId: string,
    role: 'son' | 'parent'
}) {
    const [userFriendsWithRequestSent, setUserFriendsWithRequestSent] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    const oppositeRole = role === 'son' ? 'parent' : 'son';

    useEffect(() => {
        let ignore = false;
        async function fetchUserFriendsWithRequestSent() {
            setIsLoading(true);
            setHasError(false);
            try {
                const response = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}swithrequestsent`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch sent requests');
                }

                const data = await response.json();
                if (!ignore && Array.isArray(data)) {
                    setUserFriendsWithRequestSent(data);
                }
            } catch (error) {
                console.error('Error fetching sent requests:', error);
                if (!ignore) setHasError(true);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }

        fetchUserFriendsWithRequestSent();
        return () => {
            ignore = true;
        };
    }, [profileId, role, oppositeRole]);

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cahir-armor border-t-transparent" />
                <p className="text-sm text-gray-500 font-medium">Ładowanie wysłanych zaproszeń...</p>
            </div>
        );
    }

    // 2. Error State
    if (hasError) {
        return (
            <div className="mt-6 text-center text-red-600 font-medium">
                Nie udało się pobrać wysłanych zaproszeń. Spróbuj odświeżyć stronę.
            </div>
        );
    }

    // 3. Empty State
    if (userFriendsWithRequestSent.length === 0) {
        return (
            <div className="mt-6 text-center text-gray-600 font-serif text-lg">
                Nie ma tutaj żadnych zaproszeń do listy znajomych. Możesz raz dziennie wysłać je dowolnemu kandydatowi :)
            </div>
        );
    }

    // 4. Data State
    if (role === 'parent') {
        return (
            <SonsList
                sons={userFriendsWithRequestSent}
                addedStatus='request-sent'
                parentProfileId={profileId}
            />
        );
    }

    return (
        <div>
            {userFriendsWithRequestSent.map(parent => {
                const jobTitle = typeof parent.job === 'string' 
                    ? parent.job 
                    : parent.job?.position;

                return (
                    <ParentCart 
                        key={parent._id}
                        parentId={parent._id}
                        parentFullName={parent.fullName}
                        parentCity={parent.address?.city}
                        parentJob={jobTitle}
                        addedStatus='request-sent'
                        sonProfileId={profileId}
                    />
                );
            })}
        </div>
    );
}