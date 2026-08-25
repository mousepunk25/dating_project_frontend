import Image from 'next/image';
import SaveButton from '@/components/save-button';
import AddFriendButton from '@/components/add-friend-button';

// Helper function to decode standard HTML entities on the server or client
function decodeHTMLEntities(text?: string): string {
    if (!text) return '';
    return text
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
}

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
    url: string;
}

interface Candidate {
    _id: string;
    dateOfBirth: string;
    fullName: string;
    aboutYou: string;
    job?: {
        position?: string;
        companyName?: string;
        location?: {
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
    socialMedia?: Array<SocialMedia>;
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

    // Filter out social links with missing or empty URLs
    const validSocialMedia = candidate.socialMedia?.filter(
        sMedia => Boolean(sMedia.url && sMedia.url.trim() !== '')
    ) ?? [];

    const hasSocialMedia = validSocialMedia.length > 0;
    const hasJob = Boolean(candidate.job && (candidate.job.position || candidate.job.companyName));

    const decodedFullName = decodeHTMLEntities(candidate.fullName);
    const decodedAboutYou = decodeHTMLEntities(candidate.aboutYou);
    const decodedEducation = decodeHTMLEntities(candidate.education?.educationLevel);
    const decodedJobPosition = decodeHTMLEntities(candidate.job?.position);
    const decodedCompanyName = decodeHTMLEntities(candidate.job?.companyName);

    return (
        <div className='mt-6 font-serif'>
            <div className='flex flex-col'>
                <div className='flex justify-center w-full'>
                    <Image
                        src={candidate.image.url}
                        width={400}
                        height={400}
                        alt="Picture of the candidate"
                        className="max-h-[400px] max-w-[400px] w-full h-auto object-cover rounded-md"
                    />
                </div>
                <div className='mt-3 block'>
                    <h1 className='text-xl font-bold'>{decodedFullName}, age: {age}, city: {candidate.address.city}</h1>
                </div>
                <div>
                    {hasSocialMedia && (
                        <div>
                            {validSocialMedia.map((sMedia: SocialMedia) => {
                                return (
                                    <a
                                        key={sMedia._id}
                                        href={sMedia.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className='underline m-4 inline-block'
                                    >
                                        <h3 className='text-lg'>
                                            My {sMedia.website} profile - click here
                                        </h3>
                                    </a>
                                )
                            })}
                        </div>
                    )}
                    <SaveButton sonProfileId={candidate._id} />
                    <AddFriendButton sonProfileId={candidate._id} />
                </div>
            </div>
            <div className="mt-2">
                About {decodedFullName}:
            </div>
            <div className="italic pb-2 border-b-1">
                {decodedAboutYou}
            </div>
            
            {hasJob && (
                <div className="text-lg mt-2 flex">
                    <h3 className="font-bold">Job: </h3> 
                    <span className="ml-2">
                        {decodedJobPosition}
                        {decodedJobPosition && decodedCompanyName ? ' at ' : ''}
                        {decodedCompanyName}
                    </span>
                </div>
            )}

            <div className="text-lg mt-2 flex">
                <h3 className="font-bold">Education: </h3> <span className="ml-2">{decodedEducation}</span>
            </div>
        </div>
    )
}