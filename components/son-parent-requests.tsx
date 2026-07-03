'use client'

import { useEffect, useState } from 'react';
import CandidateCart from './candidate-cart';

const url = 'http://localhost:5173';
// const url = 'https://dating-project-three.vercel.app';

export default function SonParentRequests({
    profileId,
    role
}: {
    profileId: string,
    role: 'son' | 'parent'
}) {
    const [userFriendsWhoWantToBeAdded, setUserFriendsWhoWantToBeAdded] = useState([]);
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
                console.log(userFriendsWhoWantToBeAddedJSON);
                setUserFriendsWhoWantToBeAdded(userFriendsWhoWantToBeAddedJSON);
            }
        }
        fetchUserFriendsWhoWantToBeAdded();
        return () => {
            ignore = true;
        }
    }, [profileId]);
    if (userFriendsWhoWantToBeAdded) {
        return (
            <div>
                <h2>Candidates:</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-32 my-6'>
                    {userFriendsWhoWantToBeAdded.map(candidate => {
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
                No candidates sent a request yet.
            </div>
        )
    }
}