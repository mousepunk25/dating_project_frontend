import Image from 'next/image';
import SaveButton from '@/components/save-button';
import AddFriendButton from '@/components/add-friend-button';

function calculateAge(birthDateString: string): number {
    if (!birthDateString) return 0;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

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
        educationLevel: string;
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
    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;
    const data = await fetch(`${url}/sons/${son}`);
    const candidate: Candidate = await data.json();
    const age = calculateAge(candidate.dateOfBirth);
    return (
        <div className='mt-6 font-serif'>
            <div className='flex flex-col'>
                <div className='flex justify-center'>
                    <Image
                        src={candidate.image.url}
                        width={500}
                        height={500}
                        alt="Picture of the candidate"
                        className="max-h-[500px] w-auto"
                    />
                </div>
                <div className='mt-3 block'>
                    <h1 className='text-xl font-bold'>{candidate.fullName}, age: {age}, city: {candidate.address.city}</h1>
                </div>
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
                                    <h3 className='text-lg'>
                                        My {sMedia.website} profile - click here
                                    </h3>
                                </a>
                            )
                        })}
                    </div>
                    <SaveButton sonProfileId={candidate._id} />
                    <AddFriendButton sonProfileId={candidate._id} />
                </div>
            </div>
            <div className="mt-2">
                About {candidate.fullName}:
            </div>
            <div className="italic pb-2 border-b-1">
                {candidate.aboutYou}
            </div>
            <div className="text-lg mt-2 flex">
                <h3 className="font-bold">Job: </h3> <span className="ml-2">{candidate.job.position} at {candidate.job.companyName}</span>
            </div>
            <div className="text-lg mt-2 flex">
                <h3 className="font-bold">Education: </h3> <span className="ml-2">{candidate.education.educationLevel}</span>
            </div>
        </div>
    )
}