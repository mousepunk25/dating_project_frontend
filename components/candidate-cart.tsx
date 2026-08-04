'use client'

import Link from 'next/link';
import Image from 'next/image';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

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
  // Calculate exact age from ISO string
  const age = calculateAge(candidateAge);

  return (
    <Link
      href={`/sons/${candidateId}`}
      aria-current='false'
    >
      <div className='border-3 text-lg'>
        <Image
          src={candidateImage}
          width={500}
          height={500}
          alt="Picture of the candidate"
        />
        <h2 className='mt-2 ml-2 font-bold'>
          {candidateFullName}
          <span className='font-normal'>, age: <span className='font-bold'>{age}</span></span>
        </h2>
        <h3 className='ml-2 border-b border-gray-900/10'>{candidateCity}</h3>
        <h3 className='flex items-center ml-1'>
          <BriefcaseIcon className='size-8' />
          {candidateJob}
        </h3>
      </div>
    </Link>
  );
}