import { FaceSmileIcon } from '@heroicons/react/24/outline';
import Search from '../components/search';

export default async function Page() {
  const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;
  const data = await fetch(`${url}/sons/count`);
  const sonsNumber = await data.json();
  return (
    <div className="mt-12">
      <div className="space-y-2 font-serif">
        <p className="text-gray-900 text-xl">
          Find perfect match
        </p>
        <h2 className="text-gray-600 text-2xl font-bold">
          {sonsNumber.sonNumber} great candidates is waiting for you
          <FaceSmileIcon aria-hidden="true" className="block size-6 group-data-open:hidden inline ml-1" />
        </h2>
        <Search />
      </div>
    </div>
  )
}
