'use client'

import { useEffect, useState } from 'react';
import CandidateCart from './candidate-cart';

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;

interface Candidate {
    _id: string;
    fullName: string;
    dateOfBirth: string | Date;
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

function getAge(dob: string | Date | undefined): string {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970).toString();
}

export default function SonParentFriends({
    profileId,
    role
}: {
    profileId: string,
    role: 'son' | 'parent'
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
    if (userFriends) {
        return (
            <div>
                <h2>Candidates:</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-32 my-6'>
                    {Array.isArray(userFriends) && userFriends.map(candidate => {
                        return (
                            <CandidateCart key={candidate._id}
                                candidateId={candidate._id}
                                candidateImage={candidate.image.url}
                                candidateFullName={candidate.fullName}
                                candidateAge={getAge(candidate.dateOfBirth)}
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