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

export default function SonParentRequests({
    profileId,
    role
}: {
    profileId: string,
    role: 'son' | 'parent'
}) {
    const [userFriendsWhoWantToBeAdded, setUserFriendsWhoWantToBeAdded] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasError, setHasError] = useState<boolean>(false);

    const oppositeRole = role === 'son' ? 'parent' : 'son';

    useEffect(() => {
        let ignore = false;
        async function fetchUserFriendsWhoWantToBeAdded() {
            setIsLoading(true);
            setHasError(false);
            try {
                const response = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}swhowanttobeadded`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch requests');
                }

                const data = await response.json();
                if (!ignore && Array.isArray(data)) {
                    if (role === 'parent') {
                        setUserFriendsWhoWantToBeAdded(data.map(d => d.son));
                    } else {
                        setUserFriendsWhoWantToBeAdded(data.map(d => d.parent));
                    }
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
                if (!ignore) setHasError(true);
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }

        fetchUserFriendsWhoWantToBeAdded();
        return () => {
            ignore = true;
        };
    }, [profileId, role, oppositeRole]);

    // 1. Loading State
    if (isLoading) {
        return (
            <div className="mt-8 flex flex-col items-center justify-center space-y-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cahir-armor border-t-transparent" />
                <p className="text-sm text-gray-500 font-medium">Ładowanie zaproszeń...</p>
            </div>
        );
    }

    // 2. Error State
    if (hasError) {
        return (
            <div className="mt-6 text-center text-red-600 font-medium">
                Nie udało się pobrać listy zaproszeń. Spróbuj odświeżyć stronę.
            </div>
        );
    }

    // 3. Empty State
    if (userFriendsWhoWantToBeAdded.length === 0) {
        return (
            <div className="mt-6 text-center text-gray-600 font-serif text-lg">
                Nie masz nowych zaproszeń :/ Zaczekaj, aż ktoś przyśle Tobie zaproszenie, żeby dodać Cię do listy znajomych.
            </div>
        );
    }

    // 4. Data State
    if (role === 'parent') {
        return (
            <SonsList
                sons={userFriendsWhoWantToBeAdded}
                addedStatus='request-received'
                parentProfileId={profileId}
            />
        );
    }

    return (
        <div>
            {userFriendsWhoWantToBeAdded.map(parent => {
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
                        addedStatus='request-received'
                    />
                );
            })}
        </div>
    );
}