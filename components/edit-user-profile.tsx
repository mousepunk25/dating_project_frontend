'use client'

import { PhotoIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useEffect, useState, useRef, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';

function Spinner({ className = "size-5" }: { className?: string }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
    );
}

interface UserDetails {
    aboutYou?: string;
    fullName: string;
    dateOfBirth?: Date | string | null;
    address: {
        city: string;
    };
    job?: string | {
        position?: string;
        companyName?: string;
    };
    education?: {
        educationLevel: string;
    };
    socialMedia?: { website: string; url: string }[];
    image?: {
        url: string;
        filename: string;
    };
    sonAgeMin?: number;
    sonAgeMax?: number;
}

function getFormString(formData: FormData, key: string): string {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
}

function getDobLimits() {
    const today = new Date();

    const maxDateObj = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxDob = maxDateObj.toISOString().split('T')[0];

    const minDateObj = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const minDob = minDateObj.toISOString().split('T')[0];

    return { minDob, maxDob };
}

export default function EditUserProfile({
    profileId,
    role
}: {
    profileId: string;
    role: 'son' | 'parent';
}) {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

    // Ref for smooth auto-scrolling on error/success feedback
    const feedbackRef = useRef<HTMLDivElement>(null);

    // Validation & State Management
    const [validCities, setValidCities] = useState<string[]>([]);
    const [cityInput, setCityInput] = useState('');
    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Feedback States
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    // Son Image Upload State
    const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
        ? process.env.NEXT_PUBLIC_DEV_API_URL
        : process.env.NEXT_PUBLIC_PROD_API_URL;

    const ageRange = Array.from({ length: 83 }, (_, i) => i + 18);
    const [ageMin, setAgeMin] = useState(18);
    const [ageMax, setAgeMax] = useState(80);

    const { minDob, maxDob } = getDobLimits();
    const [dob, setDob] = useState(maxDob);
    const [aboutYou, setAboutYou] = useState('');
    const [fullName, setFullName] = useState('');
    const [jobPosition, setJobPosition] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [educationLevel, setEducationLevel] = useState<string>('High School');

    const scrollToFeedback = () => {
        setTimeout(() => {
            feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
    };

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
            setIsLoadingData(true);
            try {
                const endpoint = role === 'son' ? `/sons/${profileId}` : `/parents/${profileId}`;
                const options: RequestInit = role === 'son' ? {} : { credentials: 'include' };

                const response = await fetch(`${url}${endpoint}`, options);
                const data = await response.json();

                if (!ignore && data) {
                    setUserDetails(data);
                    setAgeMin(data.sonAgeMin ?? 18);
                    setAgeMax(data.sonAgeMax ?? 80);
                    if (data.fullName) setFullName(decodeHTMLEntities(data.fullName));

                    if (data.aboutYou) setAboutYou(decodeHTMLEntities(data.aboutYou));

                    if (data.job) {
                        if (typeof data.job === 'string') {
                            setJobPosition(decodeHTMLEntities(data.job));
                        } else {
                            if (data.job.position) setJobPosition(decodeHTMLEntities(data.job.position));
                            if (data.job.companyName) setCompanyName(decodeHTMLEntities(data.job.companyName));
                        }
                    }

                    if (data.address?.city) setCityInput(data.address.city);
                    if (data.dateOfBirth) setDob(String(data.dateOfBirth).slice(0, 10));

                    if (data.education?.educationLevel) {
                        setEducationLevel(decodeHTMLEntities(data.education.educationLevel));
                    }
                }
            } catch (error) {
                console.error("Failed to load profile details:", error);
            } finally {
                if (!ignore) setIsLoadingData(false);
            }
        }
        fetchUserDetails();
        return () => { ignore = true; };
    }, [profileId, role, url]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, image: 'Rozmiar zdjęcia musi być mniejszy niż 10MB.' }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setSelectedImageBase64(base64String);
            setPreviewUrl(base64String);
            setErrors(prev => ({ ...prev, image: '' }));
            setSubmitError(null);
        };
        reader.readAsDataURL(file);
    };

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

    const validateForm = (formData: FormData): boolean => {
        const newErrors: Record<string, string> = {};

        const nameVal = getFormString(formData, 'full-name').trim();
        if (!nameVal) {
            newErrors.fullName = 'Imię jest wymagane.';
        } else if (nameVal.length > 50) {
            newErrors.fullName = 'Imię nie może przekraczać 50 znaków.';
        }

        if (role === 'son') {
            const dobVal = formData.get('dob') as string;
            if (!dobVal) {
                newErrors.dob = 'Data urodzenia jest wymagana.';
            } else {
                const birthDate = new Date(dobVal);
                const today = new Date();

                let ageCalculated = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    ageCalculated--;
                }

                if (ageCalculated < 18 || ageCalculated > 100) {
                    newErrors.dob = 'Musisz mieć więcej niż 18 i mniej niż 100 lat.';
                }
            }

            const aboutVal = getFormString(formData, 'about');
            if (aboutVal.length > 1000) {
                newErrors.about = 'Tekst w sekcji O mnie nie może być dłuższy niż 1000 znaków.';
            }

            const jobPos = getFormString(formData, 'job-position');
            if (jobPos.length > 200) {
                newErrors.jobPosition = 'Stanowisko pracy nie może przekraczać 200 znaków.';
            }

            const compName = getFormString(formData, 'company');
            if (compName.length > 200) {
                newErrors.companyName = 'Nazwa firmy nie może przekraczać 200 znaków.';
            }
        }

        const city = cityInput.trim();
        if (!city) {
            newErrors.city = 'Miasto jest wymagane.';
        } else if (validCities.length > 0 && !validCities.some(c => c.toLowerCase() === city.toLowerCase())) {
            newErrors.city = 'Wybierz prawidłowe miasto z listy, która się pojawi.';
        }

        if (role === 'parent' && ageMin > ageMax) {
            newErrors.age = 'Wiek minimalny nie może być większy niż wiek maksymalny.';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            scrollToFeedback();
            return false;
        }

        return true;
    };

    async function handleSonSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(null);

        const formData = new FormData(e.currentTarget);

        if (!validateForm(formData)) return;
        setIsSubmitting(true);

        const payload: Record<string, unknown> = {
            ...userDetails,
            aboutYou: getFormString(formData, 'about'),
            fullName: getFormString(formData, 'full-name'),
            dateOfBirth: formData.get('dob') ? new Date(formData.get('dob') as string) : null,
            address: { ...userDetails?.address, city: cityInput },
            job: {
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

        if (selectedImageBase64) {
            payload.image = selectedImageBase64;
        }

        try {
            const res = await fetch(`${url}/sons/edit/${profileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setSubmitError(data.error || 'Wystąpił błąd podczas aktualizacji profilu.');
                scrollToFeedback();
                return;
            }

            if (data.profile) {
                setUserDetails(data.profile);
                setSelectedImageBase64(null);
                setSubmitSuccess('Profil został pomyślnie zaktualizowany!');
                scrollToFeedback();
            }
        } catch (err) {
            console.error(err);
            setSubmitError('Wystąpił błąd połączenia z serwerem.');
            scrollToFeedback();
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleParentSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(null);

        const formData = new FormData(e.currentTarget);

        if (!validateForm(formData)) return;
        setIsSubmitting(true);

        const payload = {
            ...userDetails,
            fullName: getFormString(formData, 'full-name'),
            address: { ...userDetails?.address, city: cityInput },
            job: jobPosition,
            sonAgeMin: ageMin,
            sonAgeMax: ageMax
        };

        try {
            const res = await fetch(`${url}/parents/edit/${profileId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                setSubmitError(data.error || 'Wystąpił błąd podczas aktualizacji profilu.');
                scrollToFeedback();
                return;
            }

            if (data.profile) {
                setUserDetails(data.profile);
                setSubmitSuccess('Profil został pomyślnie zaktualizowany!');
                scrollToFeedback();
            }
        } catch (err) {
            console.error(err);
            setSubmitError('Wystąpił błąd połączenia z serwerem.');
            scrollToFeedback();
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

    const currentPhotoSrc = previewUrl || userDetails?.image?.url;

    if (isLoadingData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
                <Spinner className="size-8 text-indigo-600" />
                <span className="text-sm font-medium text-gray-600">Ładowanie danych profilu...</span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Scroll Anchor Target */}
            <div ref={feedbackRef}>
                {submitError && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
                        <div className="flex">
                            <div className="text-sm text-red-700 font-medium">{submitError}</div>
                        </div>
                    </div>
                )}

                {submitSuccess && (
                    <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
                        <div className="flex">
                            <div className="text-sm text-green-700 font-medium">{submitSuccess}</div>
                        </div>
                    </div>
                )}
            </div>

            {role === 'son' ? (
                <form onSubmit={handleSonSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base/7 font-semibold text-gray-900">Profil</h2>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                <div className="col-span-full">
                                    <label htmlFor="dob" className="block text-sm/6 font-medium text-gray-900">Data urodzenia</label>
                                    <input
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        min={minDob}
                                        max={maxDob}
                                        value={dob}
                                        onChange={(e) => {
                                            setDob(e.target.value);
                                            setErrors(prev => ({ ...prev, dob: '' }));
                                        }}
                                        className="mt-2 block rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                        required
                                    />
                                    {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob}</p>}
                                </div>

                                <div className="col-span-full">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">O mnie</label>
                                        <span className="text-xs text-gray-500">{aboutYou.length}/1000</span>
                                    </div>
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={4}
                                        maxLength={1000}
                                        value={aboutYou}
                                        onChange={(e) => {
                                            setAboutYou(e.target.value);
                                            setErrors(prev => ({ ...prev, about: '' }));
                                        }}
                                        className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                    />
                                    {errors.about && <p className="mt-1 text-xs text-red-500">{errors.about}</p>}
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-sm/6 font-medium text-gray-900">Zdjęcie</label>
                                    <div className="mt-2 flex items-center gap-x-3">
                                        {currentPhotoSrc ? (
                                            <Image src={currentPhotoSrc} width={100} height={100} alt="Profile" className="size-24 rounded-full object-cover" />
                                        ) : (
                                            <PhotoIcon className="size-16 text-gray-300" />
                                        )}
                                        <label htmlFor="photo-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50">
                                            Zmień
                                        </label>
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                    {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base/7 font-semibold text-gray-900">Informacje szczegółowe</h2>
                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                <div className="sm:col-span-3">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="full-name" className="block text-sm/6 font-medium text-gray-900">Imię i nazwisko</label>
                                        <span className="text-xs text-gray-500">{fullName.length}/50</span>
                                    </div>
                                    <input
                                        id="full-name"
                                        name="full-name"
                                        type="text"
                                        maxLength={50}
                                        value={fullName}
                                        onChange={(e) => {
                                            setFullName(e.target.value);
                                            setErrors(prev => ({ ...prev, fullName: '' }));
                                        }}
                                        className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                    />
                                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="education-level" className="block text-sm/6 font-medium text-gray-900">
                                        Wykształcenie
                                    </label>
                                    <div className="mt-2 grid grid-cols-1">
                                        <select
                                            id="education-level"
                                            name="education-level"
                                            value={educationLevel}
                                            onChange={(e) => setEducationLevel(e.target.value)}
                                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white border border-gray-300 py-1.5 pr-8 pl-3 text-base text-gray-900 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        >
                                            <option value="Elementary">Podstawowe</option>
                                            <option value="High School">Średnie</option>
                                            <option value="Certificate">Średnie techniczne</option>
                                            <option value="Bachelor's Degree">Licencjat/Inżynier</option>
                                            <option value="Master's Degree">Magister</option>
                                            <option value="Doctorate/Ph.D">Doktor</option>
                                        </select>
                                        <ChevronDownIcon
                                            aria-hidden="true"
                                            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                        />
                                    </div>
                                </div>

                                {/* Son Job - Position */}
                                <div className="sm:col-span-3">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="job-position" className="block text-sm/6 font-medium text-gray-900">
                                            Stanowisko zawodowe
                                        </label>
                                        <span className="text-xs text-gray-500">{jobPosition.length}/200</span>
                                    </div>
                                    <input
                                        id="job-position"
                                        name="job-position"
                                        type="text"
                                        maxLength={200}
                                        value={jobPosition}
                                        onChange={(e) => {
                                            setJobPosition(e.target.value);
                                            setErrors(prev => ({ ...prev, jobPosition: '' }));
                                        }}
                                        className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                        placeholder="np. Programista, Inżynier..."
                                    />
                                    {errors.jobPosition && <p className="mt-1 text-xs text-red-500">{errors.jobPosition}</p>}
                                </div>

                                {/* Son Job - Company Name */}
                                <div className="sm:col-span-3">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="company" className="block text-sm/6 font-medium text-gray-900">
                                            Firma / Pracodawca
                                        </label>
                                        <span className="text-xs text-gray-500">{companyName.length}/200</span>
                                    </div>
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        maxLength={200}
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                            setErrors(prev => ({ ...prev, companyName: '' }));
                                        }}
                                        className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                        placeholder="np. Acme Corp..."
                                    />
                                    {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1 relative">
                                    <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">Miasto</label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={cityInput}
                                        onChange={(e) => handleCityChange(e.target.value)}
                                        className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                        placeholder="Zacznij wpisywać miasto..."
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
                            <button type="button" className="text-sm/6 font-semibold text-gray-900">Anuluj</button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner className="size-4 text-white" />
                                        <span>Zapisuję...</span>
                                    </>
                                ) : (
                                    'Zapisz'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleParentSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-gray-900/10 pb-12">
                            <h2 className="text-base/7 font-semibold text-gray-900">Informacje o Tobie</h2>
                            {errors.age && <p className="mt-2 text-sm text-red-500">{errors.age}</p>}

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <label htmlFor="ageMin" className="block text-sm/6 font-medium text-gray-900">Minimalny wiek zięcia:</label>
                                    <select id="ageMin" name="ageMin" value={ageMin} onChange={e => setAgeMin(Number(e.target.value))} className="mt-2 block w-full rounded-md border border-gray-300 p-2">
                                        {ageRange.map(a => <option key={`min_${a}`} value={a}>{a}</option>)}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="ageMax" className="block text-sm/6 font-medium text-gray-900">Maksymalny wiek zięcia:</label>
                                    <select id="ageMax" name="ageMax" value={ageMax} onChange={e => setAgeMax(Number(e.target.value))} className="mt-2 block w-full rounded-md border border-gray-300 p-2">
                                        {ageRange.map(a => <option key={`max_${a}`} value={a}>{a}</option>)}
                                    </select>
                                </div>

                                <div className="sm:col-span-3 col-start-1">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="full-name" className="block text-sm/6 font-medium text-gray-900">Imię</label>
                                        <span className="text-xs text-gray-500">{fullName.length}/50</span>
                                    </div>
                                    <input
                                        id="full-name"
                                        name="full-name"
                                        type="text"
                                        maxLength={50}
                                        value={fullName}
                                        onChange={(e) => {
                                            setFullName(e.target.value);
                                            setErrors(prev => ({ ...prev, fullName: '' }));
                                        }}
                                        className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                    />
                                    {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="job-position" className="block text-sm/6 font-medium text-gray-900">
                                        Praca
                                    </label>
                                    <input
                                        id="job-position"
                                        name="job-position"
                                        type="text"
                                        value={jobPosition}
                                        onChange={(e) => setJobPosition(e.target.value)}
                                        className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900"
                                        placeholder="np. Inżynier, Nauczyciel, Emeryt..."
                                    />
                                </div>

                                <div className="sm:col-span-2 sm:col-start-1 relative">
                                    <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">Miasto</label>
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
                            <button type="button" className="text-sm/6 font-semibold text-gray-900">Anuluj</button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner className="size-4 text-white" />
                                        <span>Zapisuję...</span>
                                    </>
                                ) : (
                                    'Zapisz'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}