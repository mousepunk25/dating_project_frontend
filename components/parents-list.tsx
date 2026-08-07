'use client'

import { useEffect, useState } from 'react';
import ParentCart from '@/components/parent-cart';

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;

interface Parent {
  _id: string;
  fullName: string;
  job: string;
  address: {
    _id: string;
    city: string;
    country: string;
    longitude: string;
    latitude: string;
  };
}

export default function ParentsList({
    city,
    sonAge
}: {
    city: string | undefined,
    sonAge: string | undefined
}) {
    const [parentsList, setParentsList] = useState<Parent[]>([]);
    useEffect(() => {
        let ignore = false;
        async function fetchParentsList() {
            const parentsListResponse = await fetch(`${url}/parents?city=${city}&sonAge=${sonAge}`, {
                method: 'GET',
                credentials: 'include'
            });
            const parentsListJSON = await parentsListResponse.json();
            if (!ignore) {
                setParentsList(parentsListJSON);
            }
        }
        fetchParentsList();
        return () => {
            ignore = true;
        }
    }, []);
    if (parentsList) {
        return (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-32 my-6'>
                {Array.isArray(parentsList) && parentsList.map(parent => {
                    return (
                        <ParentCart key={parent._id}
                            parentId={parent._id}
                            parentFullName={parent.fullName}
                            parentCity={parent.address.city}
                            parentJob={parent.job} />
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