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

export default function SonParentSaved({
    profileId,
    role
}: {
    profileId: string,
    role: 'son' | 'parent'
}) {
    const [userFriendsSaved, setUserFriendsSaved] = useState<Candidate[]>([]);
    const oppositeRole = role === 'son' ? 'parent' : 'son';

    useEffect(() => {
        let ignore = false;
        async function fetchUserFriendsSaved() {
            const userFriendsSavedResponse = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}ssaved`, {
                method: 'GET',
                credentials: 'include'
            });
            const userFriendsSavedJSON = await userFriendsSavedResponse.json();
            if (!ignore) {
                setUserFriendsSaved(userFriendsSavedJSON);
            }
        }
        fetchUserFriendsSaved();
        return () => {
            ignore = true;
        }
    }, [profileId, role, oppositeRole]);

    // Check if the array is empty
    if (Array.isArray(userFriendsSaved) && userFriendsSaved.length === 0) {
        return (
            <div className="mt-6 text-center text-gray-600 font-serif text-lg">
                Nie masz jeszcze nikogo zapisanego. Możesz to zrobić w każdej chwili odwiedzają profil kandydata.
            </div>
        );
    }

    if (userFriendsSaved && role === 'parent') {
        return (
            <SonsList sons={userFriendsSaved}/>
        )
    } else if (userFriendsSaved && role === 'son') {
        return (
            <div>
                {Array.isArray(userFriendsSaved) && userFriendsSaved.map(parent => {
                    return (
                        <ParentCart key={parent._id}
                            parentId={parent._id}
                            parentFullName={parent.fullName}
                            parentCity={parent.address?.city}
                            parentJob={typeof parent.job === 'string' ? parent.job : parent.job?.position}
                        />
                    );
                })}
            </div>
        )
    } else {
        return (
            <div>
                Nie masz jeszcze nikogo zapisanego. Możesz to zrobić w każdej chwili odwiedzają profil kandydata.
            </div>
        )
    }
}