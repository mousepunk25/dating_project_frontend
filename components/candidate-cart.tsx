'use client'

import Link from 'next/link';
import Image from 'next/image';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

export default function CandidateCart({
candidateId,
candidateImage,
candidateFullName,
candidateAge,
candidateCity,
candidateJob
}: {
candidateId: string,
candidateImage: string,
candidateFullName: string,
candidateAge: string,
candidateCity: string,
candidateJob: string
}) {
    return (
        <Link
            key={candidateId}
            href={`/sons/${candidateId}`}
            aria-current='false'
        >
            <div className='border-3'>
                <Image
                    src={candidateImage}
                    width={500}
                    height={500}
                    alt="Picture of the candidate"
                />
                <h2 className='mt-4 ml-2 font-bold'>{candidateFullName}<span className='font-normal'>, age: {candidateAge}</span></h2>
                <h3 className='m-2 border-b border-gray-900/10'>{candidateCity}</h3>
                <h3 className='flex items-center ml-1'>
                    <BriefcaseIcon className='size-8' />
                    {candidateJob}
                </h3>
            </div>
        </Link>
    );
}