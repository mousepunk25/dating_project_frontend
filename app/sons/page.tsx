import Search from '../../components/search';
import CandidateCart from '@/components/candidate-cart';

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
  const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;
  const data = await fetch(`${url}/sons?city=${filters.city}&ageMin=${filters.ageMin}&ageMax=${filters.ageMax}`);
  const candidates: Array<Candidate> = await data.json();
  return (
    <div className='mt-12 font-serif'>
      <Search defaultCity={filters.city} defaultAgeMin={filters.ageMin} defaultAgeMax={filters.ageMax} />
      <h2>Candidates:</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-32 my-6'>
        {candidates.map(candidate => {
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
}