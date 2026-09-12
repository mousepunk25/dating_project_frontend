import SearchSon from '../../components/search-son';
import SonsList from '@/components/sons-list';
import { cookies } from 'next/headers';

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
  
  // Read parent profile ID from cookies or query params
  const cookieStore = await cookies();
  const parentProfileId = filters.profileid || cookieStore.get('profileId')?.value;

  const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
    ? process.env.NEXT_PUBLIC_DEV_API_URL 
    : process.env.NEXT_PUBLIC_PROD_API_URL;
  
  // Provide fallbacks to avoid passing "undefined" as string parameters to the API
  const cityParam = filters.city ? encodeURIComponent(filters.city) : '';
  const ageMinParam = filters.ageMin ?? '';
  const ageMaxParam = filters.ageMax ?? '';

  const data = await fetch(
    `${url}/sons?city=${cityParam}&ageMin=${ageMinParam}&ageMax=${ageMaxParam}`
  );
  const candidates: Array<Candidate> = await data.json();

  const hasCandidates = Array.isArray(candidates) && candidates.length > 0;

  return (
    <main className="min-h-screen bg-gray-50/50 font-serif text-gray-900">
      {/* Max-width container prevents content stretching on 1440p+ & 4K displays */}
      <div className="max-w-7xl xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        
        {/* Search Panel Card */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <SearchSon 
            defaultCity={filters.city} 
            defaultAgeMin={filters.ageMin} 
            defaultAgeMax={filters.ageMax} 
          />
        </section>

        {/* Candidate Results Section */}
        <section className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Wyniki wyszukiwania
            </h2>
          </div>

          {hasCandidates ? (
            <SonsList sons={candidates} parentProfileId={parentProfileId} />
          ) : (
            <div className="py-16 text-center bg-white border border-gray-200 rounded-2xl shadow-sm space-y-2">
              <p className="text-lg md:text-xl font-medium text-gray-700">
                Nie znaleziono kandydatów :(
              </p>
              <p className="text-sm text-gray-500">
                Spróbuj zmienić kryteria wyszukiwania.
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}