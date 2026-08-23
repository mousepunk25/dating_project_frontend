'use client'

import { PhotoIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';

interface UserDetails {
    aboutYou?: string;
    fullName: string;
    dateOfBirth?: Date | null;
    address: {
        city: string;
    };
    job?: string | {
        position: string;
        companyName: string;
    };
    education?: {
        educationLevel: string;
    };
    socialMedia?: { website: string; url: string }[];
    image?: {
        url: string;
        filename: string;
    };
}

function getFormString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
}

export default function EditUserProfile({
    profileId,
    role
}: {
    profileId: string;
    role: 'son' | 'parent';
}) {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

    // Validation & State Management
    const [validCities, setValidCities] = useState<string[]>([]);
    const [cityInput, setCityInput] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
        ? process.env.NEXT_PUBLIC_DEV_API_URL
        : process.env.NEXT_PUBLIC_PROD_API_URL;

    const age = Array.from({ length: 83 }, (_, i) => i + 18); // 18 to 100
    const [ageMin, setAgeMin] = useState(18);
    const [ageMax, setAgeMax] = useState(80);

    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    const maxDob = today.toISOString().split('T')[0];
    const [dob, setDob] = useState(maxDob);
    const [educationLevel, setEducationLevel] = useState<string>('High School');

    // Load CSV for City Validation
    useEffect(() => {
        async function loadCities() {
            try {
                const response = await fetch('/poland.csv');
                if (!response.ok) return;
                const text = await response.text();
                const lines = text.split('\n');
                const list = lines
                    .map((line, idx) => {
                        if (idx === 0 && line.toLowerCase().includes('city')) return '';
                        return line.split(',')[0]?.trim();
                    })
                    .filter(Boolean);
                setValidCities(list);
            } catch (e) {
                console.error('Failed to load cities:', e);
            }
        }
        loadCities();
    }, []);

    // Load User Details
    useEffect(() => {
        let ignore = false;
        async function fetchUserDetails() {
            const endpoint = role === 'son' ? `/sons/${profileId}` : `/parents/${profileId}`;
            const options: RequestInit = role === 'son' ? {} : { credentials: 'include' };

            const response = await fetch(`${url}${endpoint}`, options);
            const data = await response.json();
            console.log(data);

            if (!ignore && data) {
                setUserDetails(data);
                setAgeMin(data.sonAgeMin ?? 18);
                setAgeMax(data.sonAgeMax ?? 80);
                if (data.address?.city) setCityInput(data.address.city);
                if (data.dateOfBirth) setDob(data.dateOfBirth.slice(0, 10));

                // Decode entities like &#x2F; to / so it matches <option value="Doctorate/Ph.D">
                if (data.education?.educationLevel) {
                    setEducationLevel(decodeHTMLEntities(data.education.educationLevel));
                }
            }
        }
        fetchUserDetails();
        return () => { ignore = true; };
    }, [profileId, role, url]);

    // Handle City Input & Autocomplete
    const handleCityChange = (val: string) => {
        setCityInput(val);
        setErrors(prev => ({ ...prev, city: '' }));

        if (val.trim().length > 1) {
            const matches = validCities
                .filter(c => c.toLowerCase().startsWith(val.toLowerCase()))
                .slice(0, 5);
            setCitySuggestions(matches);
        } else {
            setCitySuggestions([]);
        }
    };

    // Form Validation Rules
    const validateForm = (formData: FormData): boolean => {
        const newErrors: Record<string, string> = {};

        // Full Name
        const fullName = getFormString(formData, 'full-name');
        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required.';
        }

        // City Validation
        const city = cityInput.trim();
        if (!city) {
            newErrors.city = 'City is required.';
        } else if (validCities.length > 0 && !validCities.some(c => c.toLowerCase() === city.toLowerCase())) {
            newErrors.city = 'Please select a valid city from the list.';
        }

        // Parent Age Range Validation
        if (role === 'parent' && ageMin > ageMax) {
            newErrors.age = 'Min age cannot be greater than Max age.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    async function handleSonSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (!validateForm(formData)) return;
        setIsSubmitting(true);

        const jobData = typeof userDetails?.job === 'object' && userDetails.job !== null ? { ...userDetails.job } : {};
        const updatedUserDetails: UserDetails = {
            ...userDetails,
            aboutYou: getFormString(formData, 'about'),
            fullName: getFormString(formData, 'full-name'),
            dateOfBirth: formData.get('dob') ? new Date(formData.get('dob') as string) : null,
            address: { ...userDetails?.address, city: cityInput },
            job: {
                ...jobData,
                position: getFormString(formData, 'job-position'),
                companyName: getFormString(formData, 'company'),
            },
            education: {
                ...userDetails?.education,
                educationLevel: getFormString(formData, 'education-level')
            },
            socialMedia: [
                { website: 'Facebook', url: getFormString(formData, 'facebook') },
                { website: 'Twitter', url: getFormString(formData, 'twitter') },
                { website: 'Instagram', url: getFormString(formData, 'instagram') },
                { website: 'Linkedin', url: getFormString(formData, 'linkedin') }
            ]
        };

        try {
            await fetch(`${url}/sons/edit/${profileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedUserDetails),
            });
            setUserDetails(updatedUserDetails);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleParentSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        if (!validateForm(formData)) return;
        setIsSubmitting(true);

        const updatedUserDetails = {
            ...userDetails,
            fullName: getFormString(formData, 'full-name'),
            address: { ...userDetails?.address, city: cityInput },
            job: getFormString(formData, 'job-position'),
            sonAgeMin: ageMin,
            sonAgeMax: ageMax
        };

        try {
            await fetch(`${url}/parents/edit/${profileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updatedUserDetails),
            });
            setUserDetails(updatedUserDetails);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    function decodeHTMLEntities(text: string): string {
        if (!text) return '';
        const parser = new DOMParser();
        const decoded = parser.parseFromString(text, 'text/html');
        return decoded.body.textContent || '';
    }

    if (role === 'son') {
        return (
            <form onSubmit={handleSonSubmit}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="col-span-full">
                                <label htmlFor="dob" className="block text-sm/6 font-medium text-gray-900">Date of Birth</label>
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    max={maxDob}
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="mt-2 block rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                    required
                                />
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">About you</label>
                                <textarea
                                    id="about"
                                    name="about"
                                    rows={3}
                                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                    defaultValue={userDetails?.aboutYou}
                                />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm/6 font-medium text-gray-900">Photo</label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    {userDetails?.image ? (
                                        <Image src={userDetails.image.url} width={100} height={100} alt="Profile" className="rounded-full" />
                                    ) : (
                                        <PhotoIcon className="size-12 text-gray-300" />
                                    )}
                                    <button type="button" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50">Change</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="full-name" className="block text-sm/6 font-medium text-gray-900">Full name</label>
                                <input
                                    id="full-name"
                                    name="full-name"
                                    type="text"
                                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                    defaultValue={userDetails?.fullName}
                                />
                                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="education-level" className="block text-sm/6 font-medium text-gray-900">
                                    Education
                                </label>
                                <div className="mt-2 grid grid-cols-1">
                                    <select
                                        id="education-level"
                                        name="education-level"
                                        value={educationLevel}
                                        onChange={(e) => setEducationLevel(e.target.value)}
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white border border-gray-300 py-1.5 pr-8 pl-3 text-base text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    >
                                        <option value="Elementary">Elementary</option>
                                        <option value="High School">High School</option>
                                        <option value="Certificate">Certificate</option>
                                        <option value="Associate's Degree">Associate's Degree</option>
                                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                                        <option value="Master's Degree">Master's Degree</option>
                                        <option value="Doctorate/Ph.D">Doctorate/Ph.D</option>
                                    </select>
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2 sm:col-start-1 relative">
                                <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">City</label>
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    value={cityInput}
                                    onChange={(e) => handleCityChange(e.target.value)}
                                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                    placeholder="Start typing your city..."
                                />
                                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                                {citySuggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                                        {citySuggestions.map((suggestion) => (
                                            <li
                                                key={suggestion}
                                                onClick={() => {
                                                    setCityInput(suggestion);
                                                    setCitySuggestions([]);
                                                }}
                                                className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer"
                                            >
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button type="button" className="text-sm/6 font-semibold text-gray-900">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50">
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    return (
        <form onSubmit={handleParentSubmit}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                    {errors.age && <p className="mt-2 text-sm text-red-500">{errors.age}</p>}

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="ageMin" className="block text-sm/6 font-medium text-gray-900">Min Age</label>
                            <select id="ageMin" name="ageMin" value={ageMin} onChange={e => setAgeMin(Number(e.target.value))} className="mt-2 block w-full rounded-md border border-gray-300 p-2">
                                {age.map(a => <option key={`min_${a}`} value={a}>{a}</option>)}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="ageMax" className="block text-sm/6 font-medium text-gray-900">Max Age</label>
                            <select id="ageMax" name="ageMax" value={ageMax} onChange={e => setAgeMax(Number(e.target.value))} className="mt-2 block w-full rounded-md border border-gray-300 p-2">
                                {age.map(a => <option key={`max_${a}`} value={a}>{a}</option>)}
                            </select>
                        </div>

                        <div className="sm:col-span-3 col-start-1">
                            <label htmlFor="full-name" className="block text-sm/6 font-medium text-gray-900">Full name</label>
                            <input
                                id="full-name"
                                name="full-name"
                                type="text"
                                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                defaultValue={userDetails?.fullName}
                            />
                            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1 relative">
                            <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">City</label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={cityInput}
                                onChange={(e) => handleCityChange(e.target.value)}
                                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                            />
                            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                            {citySuggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                                    {citySuggestions.map((suggestion) => (
                                        <li
                                            key={suggestion}
                                            onClick={() => {
                                                setCityInput(suggestion);
                                                setCitySuggestions([]);
                                            }}
                                            className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50">
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </form>
    );
}