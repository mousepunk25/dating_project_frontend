'use client'

import { useEffect, useState } from 'react';
import SaveButton from '@/components/save-button';
import AddFriendButton from '@/components/add-friend-button';

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

export default function ParentProfile({
    parentId,
}: {
    parentId: string
}) {
    const [parent, setParent] = useState<Parent>();
    useEffect(() => {
        let ignore = false;
        async function fetchParent() {
            const parentResponse = await fetch(`${url}/parents/${parentId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const parentJSON = await parentResponse.json();
            if (!ignore) {
                setParent(parentJSON);
            }
        }
        fetchParent();
        return () => {
            ignore = true;
        }
    }, [parentId]);
    if (parent) {
        return (
            <div className='mt-6 font-serif'>
                <div className='flex flex-col'>
                    <div className='mt-3 block'>
                        <h1 className='text-xl font-bold'>{parent.fullName}, miasto: {parent.address.city}</h1>
                    </div>
                    <div>
                        <SaveButton sonProfileId={parent._id} />
                        <AddFriendButton sonProfileId={parent._id} />
                    </div>
                </div>
                <div className="text-lg mt-2 flex">
                    <h3 className="font-bold">Praca: </h3> <span className="ml-2">{parent.job}</span>
                </div>
            </div>
        )
    } else {
        return (
            <h2>Nie znaleziono użytkowników</h2>
        )
    }
}