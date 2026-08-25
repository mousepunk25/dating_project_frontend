import SearchSon from '../../components/search-son';
import SonsList from '@/components/sons-list';

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
  const filters = await searchParams;
  const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;
  
  // Provide fallbacks to avoid passing "undefined" as string parameters to the API
  const cityParam = filters.city ? encodeURIComponent(filters.city) : '';
  const ageMinParam = filters.ageMin ?? '';
  const ageMaxParam = filters.ageMax ?? '';

  const data = await fetch(`${url}/sons?city=${cityParam}&ageMin=${ageMinParam}&ageMax=${ageMaxParam}`);
  const candidates: Array<Candidate> = await data.json();

  const hasCandidates = Array.isArray(candidates) && candidates.length > 0;

  return (
    <div className='font-serif'>
      <SearchSon defaultCity={filters.city} defaultAgeMin={filters.ageMin} defaultAgeMax={filters.ageMax} />
      
      {hasCandidates ? (
        <SonsList sons={candidates} />
      ) : (
        <div className="mt-8 text-center text-lg text-gray-600">
          No candidates found :(. Try changing the criteria.
        </div>
      )}
    </div>
  );
}