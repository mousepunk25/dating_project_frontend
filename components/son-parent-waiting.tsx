'use client'

import { useEffect, useState } from 'react';
import CandidateCart from './candidate-cart';

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
    if (userFriendsWithRequestSent) {
        return (
            <div>
                <h2>Candidates:</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-32 my-6'>
                    {Array.isArray(userFriendsWithRequestSent) && userFriendsWithRequestSent.map(candidate => {
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
            <div>
                You haven't sent a request to any candidate yet.
            </div>
        )
    }
}