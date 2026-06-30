import Image from 'next/image';
import SaveButton from '@/components/saveButton';
import AddFriendButton from '@/components/addFriendButton';

interface SocialMedia {
    _id: string;
    website: string;
    url: string
}

interface Candidate {
  _id: string;
  dateOfBirth: string;
  fullName: string;
  aboutYou: string;
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
  education: {
    schoolName: string;
    educationLevel: string;
    field: string;
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
  socialMedia: Array<SocialMedia>
}

export default async function Page({
    params,
}: {
    params: Promise<{ son: string }>
}) {
    const { son } = await params;
    const url = 'http://localhost:5173';
  // const url = 'https://dating-project-three.vercel.app';
    const data = await fetch(`${url}/sons/${son}`);
    const candidate: Candidate = await data.json();
    return (
        <div className='mt-12 font-serif'>
            <div className='flex justify-evenly'>
                <Image
                    src={candidate.image.url}
                    width={500}
                    height={500}
                    alt="Picture of the candidate"
                    className="max-h-120 w-auto max-w-64 sm:max-w-120 h-auto"
                />
                <div>
                    <div>
                        {candidate.socialMedia?.map((sMedia: SocialMedia) => {
                            return (
                                <a
                                    key={sMedia._id}
                                    href={sMedia.url}
                                    target="_blank"
                                    className='underline m-4'
                                >
                                    <h3>
                                        My {sMedia.website} profile - click here
                                    </h3>
                                </a>
                            )
                        })}
                    </div>
                    <SaveButton profileId={candidate._id}/>
                    <AddFriendButton sonProfileId={candidate._id}/>
                </div>
            </div>
            <div className='mt-4'>
                <h1 className='text-xl font-bold'>Temporary, age: {candidate.dateOfBirth}, city: {candidate.address.city}</h1>
            </div>
            <div className="mt-4 pb-2 border-b-1">
                About Temporary: <span className="italic">{candidate.aboutYou}</span>
            </div>
            <div className="text-lg mt-2 flex">
                <h3 className="font-bold">Job: </h3> <span className="ml-2">{candidate.job.position} at {candidate.job.companyName}</span>
            </div>
            <div className="text-lg mt-2 flex">
                <h3 className="font-bold">Education: </h3> <span className="ml-2">{candidate.education.field}, {candidate.education.schoolName}, {candidate.education.educationLevel}</span>
            </div>
        </div>
    )
}