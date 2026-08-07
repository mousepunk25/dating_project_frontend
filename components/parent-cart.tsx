'use client'

import Link from 'next/link';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

export default function ParentCart({
  parentId,
  parentFullName,
  parentCity,
  parentJob
}: {
  parentId: string,
  parentFullName: string,
  parentCity: string,
  parentJob: string
}) {
return (
    <Link
      href={`/parents/${parentId}`}
      aria-current='false'
    >
      <div className='border-3 text-lg m-2'>
        <h2 className='mt-2 ml-2 font-bold'>
          {parentFullName}
        </h2>
        <h3 className='ml-2 border-b border-gray-900/10'>{parentCity}</h3>
        <h3 className='flex items-center ml-1'>
          <BriefcaseIcon className='size-8'/>
          {parentJob}
        </h3>
      </div>
    </Link>
  );
}