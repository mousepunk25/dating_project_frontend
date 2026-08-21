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
  const filters = await searchParams
  const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;
  const data = await fetch(`${url}/sons?city=${filters.city}&ageMin=${filters.ageMin}&ageMax=${filters.ageMax}`);
  const candidates: Array<Candidate> = await data.json();
  return (
    <div className='font-serif'>
      <SearchSon defaultCity={filters.city} defaultAgeMin={filters.ageMin} defaultAgeMax={filters.ageMax} />
      <SonsList sons={candidates}/>
    </div>
  )
}