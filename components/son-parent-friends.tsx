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
    job: { position: string } | string;
}

export default function SonParentFriends({
    profileId,
    role,
    showChat,
    unreadConversations
}: {
    profileId: string,
    role: 'son' | 'parent',
    showChat: Function
}) {
    const [userFriends, setUserFriends] = useState<Candidate[]>([]);
    const oppositeRole = role === 'son' ? 'parent' : 'son';
    useEffect(() => {
        let ignore = false;
        async function fetchUserFriends() {
            const userFriendsResponse = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}sfriends`, {
                method: 'GET',
                credentials: 'include'
            });
            const userFriendsJSON = await userFriendsResponse.json();
            if (!ignore) {
                setUserFriends(userFriendsJSON);
            }
        }
        fetchUserFriends();
        return () => {
            ignore = true;
        }
    }, [profileId]);
    if (userFriends && role === 'parent') {
        return (
            <SonsList sons={userFriends} showChat={showChat} unreadConversations={unreadConversations}/>
        )
    } else if (userFriends && role === 'son') {
        return (
            <div>
                {Array.isArray(userFriends) && userFriends.map(parent => {
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
            <h2>Candidates:</h2>
        )
    }
}