import SearchParent from '../../components/search-parent';
import ParentsList from '@/components/parents-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wyniki wyszukiwania teściów',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const filters = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50/50 font-serif text-gray-900">
      {/* Container with max-width constraints for big screens */}
      <div className="max-w-7xl xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        
        {/* Search Panel Section */}
        <section className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <SearchParent defaultCity={filters.city} defaultSonAge={filters.sonAge} />
        </section>

        {/* Header & List Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Kandydaci na teściów
            </h2>
          </div>

          {/* Results Area */}
          <div className="w-full">
            <ParentsList city={filters.city} sonAge={filters.sonAge} />
          </div>
        </section>

      </div>
    </main>
  );
}