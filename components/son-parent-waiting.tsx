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

export default function SonParentWaiting({
    profileId,
    role
}: {
    profileId: string,
    role: 'son' | 'parent'
}) {
    const [userFriendsWithRequestSent, setUserFriendsWithRequestSent] = useState<Candidate[]>([]);
    const oppositeRole = role === 'son' ? 'parent' : 'son';
    useEffect(() => {
        let ignore = false;
        async function fetchUserFriendsWithRequestSent() {
            const userFriendsWithRequestSentResponse = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}swithrequestsent`, {
                method: 'GET',
                credentials: 'include'
            });
            const userFriendsWithRequestSentJSON = await userFriendsWithRequestSentResponse.json();
            if (!ignore) {
                setUserFriendsWithRequestSent(userFriendsWithRequestSentJSON);
            }
        }
        fetchUserFriendsWithRequestSent();
        return () => {
            ignore = true;
        }
    }, [profileId]);
    if (userFriendsWithRequestSent && role === 'parent') {
        return (
            <SonsList sons={userFriendsWithRequestSent}/>
        )
    } else if (userFriendsWithRequestSent && role === 'son') {
        return (
            <div>
                {Array.isArray(userFriendsWithRequestSent) && userFriendsWithRequestSent.map(parent => {
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
                You haven't sent a request to any candidate yet.
            </div>
        )
    }
}