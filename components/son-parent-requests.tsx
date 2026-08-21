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
    };
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
    }, [profileId]);
    if (userFriendsWhoWantToBeAdded && role === 'parent') {
        return (
            <SonsList sons={userFriendsWhoWantToBeAdded}/>
        )
    } else if (userFriendsWhoWantToBeAdded && role === 'son') {
        return (
            <div>
                {Array.isArray(userFriendsWhoWantToBeAdded) && userFriendsWhoWantToBeAdded.map(parent => {
                    return (
                        <ParentCart key={parent._id}
                            parentId={parent._id}
                            parentFullName={parent.fullName}
                            parentCity={parent.address.city}
                            parentJob={typeof parent.job === 'string' ? parent.job : parent.job.position}
                        />
                    );
                })}
            </div>
        )
    } else {
        return (
            <div>
                No candidates sent a request yet.
            </div>
        )
    }
}