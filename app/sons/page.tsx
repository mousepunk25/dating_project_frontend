import Search from '../../components/search';
import Image from 'next/image';
import { BriefcaseIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Candidate {
  _id: string;
  dateOfBirth: string;
  fullName: string;
  job: {
    position: string;
    companyName: string;
    location: {
      _id: string;
      city: string;
      country: string;
      longitude: string;
      latitude: string;
    };
  };
  address: {
    _id: string;
    city: string;
    country: string;
    longitude: string;
    latitude: string;
  };
  image: {
    _id: string;
    url: string;
    filename: string;
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const filters = await searchParams
  const url = 'http://localhost:5173';
  // const url = 'https://dating-project-three.vercel.app';
  const data = await fetch(`${url}/sons?city=${filters.city}&ageMin=${filters.ageMin}&ageMax=${filters.ageMax}`);
  const candidates: Array<Candidate> = await data.json();
  console.log(candidates[0]);
  return (
    <div className='mt-12 font-serif'>
      <Search defaultCity={filters.city} defaultAgeMin={filters.ageMin} defaultAgeMax={filters.ageMax} />
      <h2>Candidates:</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-32 my-6'>
        {candidates.map(candidate => {
          return (
            <Link
               key={candidate._id}
              href={`/sons/${candidate._id}`}
              aria-current='false'
            >
              <div className='border-3'>
                <Image
                  src={candidate.image.url}
                  width={500}
                  height={500}
                  alt="Picture of the candidate"
                />
                <h2 className='mt-4 ml-2 font-bold'>{candidate.fullName}<span className='font-normal'>, age: {candidate.dateOfBirth}</span></h2>
                <h3 className='m-2 border-b border-gray-900/10'>{candidate.address.city}</h3>
                <h3 className='flex items-center ml-1'>
                  <BriefcaseIcon className='size-8' />
                  {candidate.job.position}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
}