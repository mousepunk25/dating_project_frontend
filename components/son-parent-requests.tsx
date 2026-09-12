'use client'

import { useEffect, useState } from 'react';
import ParentCart from './parent-cart';
import SonsList from './sons-list';

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;

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
    const oppositeRole = role === 'son' ? 'parent' : 'son';

    useEffect(() => {
        let ignore = false;
        async function fetchUserFriendsWhoWantToBeAdded() {
            const userFriendsWhoWantToBeAddedResponse = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}swhowanttobeadded`, {
                method: 'GET',
                credentials: 'include'
            });
            const userFriendsWhoWantToBeAddedJSON = await userFriendsWhoWantToBeAddedResponse.json();
            if (!ignore) {
                setUserFriendsWhoWantToBeAdded(userFriendsWhoWantToBeAddedJSON);
            }
        }
        fetchUserFriendsWhoWantToBeAdded();
        return () => {
            ignore = true;
        }
    }, [profileId, role, oppositeRole]);

    // Check if the array is empty
    if (Array.isArray(userFriendsWhoWantToBeAdded) && userFriendsWhoWantToBeAdded.length === 0) {
        return (
            <div className="mt-6 text-center text-gray-600 font-serif text-lg">
                Nie masz nowych zaproszeń :/ Zaczekaj, aż ktoś przyśle Tobie zaproszenie, żeby dodać Cię do listy znajomych.
            </div>
        );
    }

    if (userFriendsWhoWantToBeAdded && role === 'parent') {
        return (
            <SonsList
            sons={userFriendsWhoWantToBeAdded}
            addedStatus='request-received'
            parentProfileId={profileId}
            />
        )
    } else if (userFriendsWhoWantToBeAdded && role === 'son') {
        return (
            <div>
                {Array.isArray(userFriendsWhoWantToBeAdded) && userFriendsWhoWantToBeAdded.map(parent => {
                    return (
                        <ParentCart key={parent._id}
                            parentId={parent._id}
                            parentFullName={parent.fullName}
                            parentCity={parent.address?.city}
                            parentJob={typeof parent.job === 'string' ? parent.job : parent.job?.position}
                            addedStatus='request-received'
                        />
                    );
                })}
            </div>
        )
    } else {
        return (
            <div>
                Nie masz nowych zaproszeń :/ Zaczekaj, aż ktoś przyśle Tobie zaproszenie, żeby dodać Cię do listy znajomych.
            </div>
        )
    }
}