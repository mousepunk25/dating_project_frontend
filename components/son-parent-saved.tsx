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
    }, [profileId]);
    if (userFriendsSaved) {
        return (
            <div>
                <h2>Candidates:</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-32 my-6'>
                    {userFriendsSaved.map(candidate => {
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
            <div>
                No users saved
            </div>
        )
    }
}