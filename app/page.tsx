import { FaceSmileIcon } from '@heroicons/react/24/outline';
import Search from '../components/search';

export default function Page() {
  return (
    <div className="mt-12">
      <div className="space-y-2 font-serif">
        <p className="text-gray-900 text-xl">
          Find perfect match
        </p>
        <h2 className="text-gray-600 text-2xl font-bold">
            [number of candidates] great candidates is waiting for you
          <FaceSmileIcon aria-hidden="true" className="block size-6 group-data-open:hidden inline ml-1" />
        </h2>
        <Search/>
      </div>
    </div>
  )
}
