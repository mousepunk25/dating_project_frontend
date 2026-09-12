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
    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
        ? process.env.NEXT_PUBLIC_DEV_API_URL 
        : process.env.NEXT_PUBLIC_PROD_API_URL;
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
        <main className="min-h-screen bg-gray-50/50 font-serif text-gray-900 py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* 2-Column Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Media & Actions */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 lg:sticky lg:top-8">
                        <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] min-h-[380px] max-h-[650px] overflow-hidden rounded-xl bg-gray-100 border border-gray-100">
                            <Image
                                src={candidate.image.url}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 600px"
                                alt={`Zdjęcie kandydata - ${decodedFullName}`}
                                className="object-cover transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 pt-2">
                            <SaveButton sonProfileId={candidate._id} />
                            <AddFriendButton sonProfileId={candidate._id} />
                        </div>
                    </div>

                    {/* Right Column: Candidate Profile Information */}
                    <div className="lg:col-span-7 space-y-6">
                        
                        {/* Header Details */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                                    {decodedFullName}
                                </h1>
                                <p className="text-lg text-gray-600 mt-2 flex items-center gap-2">
                                    <span>Wiek: <strong className="text-gray-900">{age} lat</strong></span>
                                    <span>•</span>
                                    <span>Miasto: <strong className="text-gray-900">{candidate.address.city}</strong></span>
                                </p>
                            </div>

                            {/* Social Media Links */}
                            {hasSocialMedia && (
                                <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                                    {validSocialMedia.map((sMedia: SocialMedia) => (
                                        <a
                                            key={sMedia._id}
                                            href={sMedia.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
                                        >
                                            Profil {sMedia.website} →
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* About Me Section */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                                O mnie
                            </h2>
                            <p className="italic text-gray-700 leading-relaxed text-base sm:text-lg">
                                {decodedAboutYou || 'Brak opisu.'}
                            </p>
                        </div>

                        {/* Professional & Education Details */}
                        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">
                                Szczegóły
                            </h2>
                            
                            <div className="space-y-3">
                                {hasJob && (
                                    <div className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center">
                                        <span className="font-bold text-gray-900 sm:w-36">Praca:</span> 
                                        <span className="text-gray-700">
                                            {decodedJobPosition}
                                            {decodedJobPosition && decodedCompanyName ? ' w ' : ''}
                                            {decodedCompanyName}
                                        </span>
                                    </div>
                                )}

                                {decodedEducation && (
                                    <div className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center">
                                        <span className="font-bold text-gray-900 sm:w-36">Wykształcenie:</span> 
                                        <span className="text-gray-700">{decodedEducation}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}