'use client'

import { useEffect, useState } from 'react';
import CandidateCart from './candidate-cart';

const url = 'http://localhost:5173';
// const url = 'https://dating-project-three.vercel.app';

export default function SonParentFriends({
    profileId,
    role
}: {
    profileId: string,
    role: 'son' | 'parent'
}) {
    const [userFriends, setUserFriends] = useState([]);
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
                console.log(userFriendsJSON);
                setUserFriends(userFriendsJSON);
            }
        }
        fetchUserFriends();
        return () => {
            ignore = true;
        }
    }, [profileId]);
    if (userFriends) {
        return (
            <div>
                <h2>Candidates:</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-32 my-6'>
                    {userFriends.map(candidate => {
                        return (
                            <CandidateCart key={candidate._id}
                                candidateId={candidate._id}
                                candidateImage={candidate.image.url}
                                candidateFullName={candidate.fullName}
                                candidateAge={candidate.dateOfBirth}
                                candidateCity={candidate.address.city}
                                candidateJob={candidate.job.position} />
                        );
                    })}
                </div>
            </div>
        )
    } else {
        return (
            <h2>Candidates:</h2>
        )
    }
}