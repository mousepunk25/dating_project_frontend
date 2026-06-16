import Search from '../../components/search';

interface Candidate {
  _id: string;
  dateOfBirth: string;
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
  owner: {
    _id: string;
    name: string;
  };
  address: {
    _id: string;
    city: string;
    country: string;
    longitude: string;
    latitude: string;
  };
  images: Array<{
    _id: string;
    url: string;
    filename: string;
  }>;
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const filters = await searchParams
    console.log(filters.city);
    const data = await fetch(`https://dating-project-three.vercel.app/sons?city=${filters.city}`);
    const candidates: Array<Candidate> = await data.json();
    console.log(candidates[0]);
    return (
        <div className='mt-12'>
            <Search />
            <h2>Candidates:</h2>
            <ul>
                {candidates.map(candidate => {
                    return (
                        <li key={candidate._id}>
                            {candidate._id}
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}