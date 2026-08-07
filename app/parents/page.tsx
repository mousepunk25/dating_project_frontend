import SearchParent from '../../components/search-parent';
import ParentsList from '@/components/parents-list';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const filters = await searchParams
  return (
    <div className='mt-12 font-serif'>
      <SearchParent defaultCity={filters.city} defaultSonAge={filters.sonAge} />
      <h2 className="mt-4">Candidates</h2>
      <ParentsList city={filters.city} sonAge={filters.sonAge}/>
    </div>
  )
}