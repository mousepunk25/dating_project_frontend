'use client'

import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { PhotoIcon } from '@heroicons/react/24/solid';

interface FormDataState {
    fullNameParent: string;
    cityParent: string;
    fullNameSon: string;
    citySon: string;
    job: string;
    email: string;
    password: string;
    educationLevel: string;
}

type FormErrors = Partial<Record<keyof FormDataState, string>>;

export default function RegisterUser() {
    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
        ? process.env.NEXT_PUBLIC_DEV_API_URL
        : process.env.NEXT_PUBLIC_PROD_API_URL;

    const [isParent, setIsParent] = useState<boolean>(true);
    const [aboutYou, setAboutYou] = useState<string>('');
    const [cities, setCities] = useState<string[]>([]);

    // Loading & Submission States
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

    // Image state (stores Base64 string and preview URL)
    const [imageBase64, setImageBase64] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const getDefault30YearsOldDate = (): string => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 30);
        return today.toISOString().split('T')[0];
    };
    const [dateOfBirth, setDateOfBirth] = useState<string>(getDefault30YearsOldDate);

    const [formData, setFormData] = useState<FormDataState>({
        fullNameParent: '',
        cityParent: '',
        fullNameSon: '',
        citySon: '',
        job: '',
        email: '',
        password: '',
        educationLevel: 'High School'
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        async function fetchCities() {
            try {
                const response = await fetch('/poland.csv');
                const text = await response.text();
                const lines = text.split('\n');
                const cityList: string[] = [];

                lines.forEach((line, index) => {
                    if (index === 0 && line.toLowerCase().includes('city')) return;
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return;

                    const [city] = trimmedLine.split(',');
                    if (city) cityList.push(city.trim());
                });

                setCities(cityList);
            } catch (error) {
                console.error('Failed to load cities list:', error);
            }
        }

        fetchCities();
    }, []);

    // Convert file input to Base64 string for direct submission to Cloudinary backend
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImageLoading(true);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setImageBase64(base64);
            setImagePreview(base64);
            setIsImageLoading(false);
        };
        reader.onerror = () => {
            setIsImageLoading(false);
        };
    };

    const validateField = (name: keyof FormDataState, value: string): string => {
        const textOnlyFields: (keyof FormDataState)[] = ['fullNameParent', 'fullNameSon', 'job'];

        if (textOnlyFields.includes(name)) {
            if (/\d/.test(value)) return 'Nie może zawierać liczb ani znaków specjalnych';
            if (value.length > 50) return 'Może mieć co najwyżej 50 znaków.';
        }

        const cityFields: (keyof FormDataState)[] = ['cityParent', 'citySon'];
        if (cityFields.includes(name)) {
            if (value.trim() !== '' && cities.length > 0) {
                const cityExists = cities.some(
                    (c) => c.toLowerCase() === value.trim().toLowerCase()
                );
                if (!cityExists) return 'Wybierz miasto z listy, która pokaże się, gdy zaczniesz wpisywać swoje miasto.';
            }
        }

        return '';
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof FormDataState;

        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        const errorMsg = validateField(fieldName, value);
        setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    };

    const handleRoleChange = (parentSelected: boolean) => {
        setIsParent(parentSelected);
        setErrors({});
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        const fieldsToValidate: (keyof FormDataState)[] = isParent
            ? ['fullNameParent', 'cityParent', 'job']
            : ['fullNameSon', 'citySon', 'job'];

        const newErrors: FormErrors = {};
        fieldsToValidate.forEach((field) => {
            const err = validateField(field, formData[field]);
            if (err) newErrors[field] = err;
        });

        if (Object.keys(newErrors).length > 0) {
            e.preventDefault();
            setErrors(newErrors);
            setIsSubmitting(false);
        } else {
            setIsSubmitting(true);
        }
    };

    const getMax18YearsOldDate = (): string => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        return today.toISOString().split('T')[0];
    };

    return (
        <form
            action={`${url}/register`}
            method="POST"
            onSubmit={handleSubmit}
            className="space-y-6 mt-6"
        >
            <datalist id="cities-list">
                {cities.map((city, index) => (
                    <option key={`${city}-${index}`} value={city} />
                ))}
            </datalist>

            {/* Hidden inputs to transmit extra form values during native POST submit */}
            <input type="hidden" name="image" value={imageBase64} />
            {!isParent && (
                <>
                    <input type="hidden" name="dateOfBirth" value={dateOfBirth} />
                    <input type="hidden" name="aboutYou" value={aboutYou} />
                </>
            )}

            <fieldset>
                <legend>Wybierz swoją rolę:</legend>

                <div className='mt-2'>
                    <input
                        type="radio"
                        id="parent"
                        name="role"
                        value="parent"
                        checked={isParent === true}
                        onChange={() => handleRoleChange(true)}
                    />
                    <label htmlFor="parent" className='ml-2'>Rodzic (szukam zięcia)</label>
                </div>

                <div className='mt-2'>
                    <input
                        type="radio"
                        id="son"
                        name="role"
                        value="son"
                        checked={isParent === false}
                        onChange={() => handleRoleChange(false)}
                    />
                    <label htmlFor="son" className='ml-2'>Zięć (szukam żony)</label>
                </div>
            </fieldset>

            {isParent && (
                <div className="parent-section space-y-4">
                    <div>
                        <label htmlFor="fullNameParent" className="block text-sm/6 font-medium text-gray-900">
                            Imię (wymagane):
                        </label>
                        <div className="mt-2">
                            <input
                                id="fullNameParent"
                                name="fullNameParent"
                                type="text"
                                required
                                maxLength={50}
                                value={formData.fullNameParent}
                                onChange={handleChange}
                                autoComplete="name"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${errors.fullNameParent ? 'outline-red-500' : 'outline-gray-300'
                                    } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                            />
                        </div>
                        {errors.fullNameParent && (
                            <p className="mt-1 text-xs text-red-600">{errors.fullNameParent}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="cityParent" className="block text-sm/6 font-medium text-gray-900">
                            Miasto (wymagane):
                        </label>
                        <div className="mt-2">
                            <input
                                id="cityParent"
                                name="cityParent"
                                type="text"
                                required
                                list="cities-list"
                                value={formData.cityParent}
                                onChange={handleChange}
                                autoComplete="off"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${errors.cityParent ? 'outline-red-500' : 'outline-gray-300'
                                    } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                            />
                        </div>
                        {errors.cityParent && (
                            <p className="mt-1 text-xs text-red-600">{errors.cityParent}</p>
                        )}
                    </div>
                </div>
            )}

            {!isParent && (
                <div className="son-section space-y-4">
                    {/* Profile Image Upload Field */}
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">
                            Zdjęcie profilowe (opcjonalnie):
                        </label>
                        <div className="mt-2 flex items-center gap-x-4">
                            {isImageLoading ? (
                                <div className="h-16 w-16 rounded-full border-2 border-gray-300 border-t-indigo-600 animate-spin" />
                            ) : imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    className="h-16 w-16 rounded-full object-cover border border-gray-300"
                                />
                            ) : (
                                <PhotoIcon aria-hidden="true" className="h-16 w-16 text-gray-300" />
                            )}
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            >
                                <span>Wybierz zdjęcie</span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="sr-only"
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="fullNameSon" className="block text-sm/6 font-medium text-gray-900">
                            Imię i nazwisko (wymagane):
                        </label>
                        <div className="mt-2">
                            <input
                                id="fullNameSon"
                                name="fullNameSon"
                                type="text"
                                required
                                maxLength={50}
                                value={formData.fullNameSon}
                                onChange={handleChange}
                                autoComplete="name"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${errors.fullNameSon ? 'outline-red-500' : 'outline-gray-300'
                                    } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                            />
                        </div>
                        {errors.fullNameSon && (
                            <p className="mt-1 text-xs text-red-600">{errors.fullNameSon}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="citySon" className="block text-sm/6 font-medium text-gray-900">
                            Miasto (wymagane):
                        </label>
                        <div className="mt-2">
                            <input
                                id="citySon"
                                name="citySon"
                                type="text"
                                required
                                list="cities-list"
                                value={formData.citySon}
                                onChange={handleChange}
                                autoComplete="off"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${errors.citySon ? 'outline-red-500' : 'outline-gray-300'
                                    } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                            />
                        </div>
                        {errors.citySon && (
                            <p className="mt-1 text-xs text-red-600">{errors.citySon}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="dateOfBirth" className="text-lg">Data urodzenia (wymagane):</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
                            max={getMax18YearsOldDate()}
                            className="sm:min-w-md grow bg-white py-4 pr-3 pl-3 text-lg text-gray-900 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label htmlFor="aboutYou" className="block text-sm/6 font-medium text-gray-900">
                            O Tobie (opcjonalnie):
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="aboutYou"
                                rows={4}
                                maxLength={1000}
                                value={aboutYou}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAboutYou(e.target.value)}
                                placeholder="Opisz siebie..."
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                            <p className="mt-1 text-right text-xs text-gray-500">
                                {aboutYou.length}/1000 znaków
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="education-level" className="block text-sm/6 font-medium text-gray-900">
                            Wykształcenie (wymagane):
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="education-level"
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleChange}
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                </div>
            )}

            {/* Common Job Input Field */}
            <div>
                <label htmlFor="job" className="block text-sm/6 font-medium text-gray-900">
                    Praca (opcjonalnie):
                </label>
                <div className="mt-2">
                    <input
                        id="job"
                        name="job"
                        type="text"
                        maxLength={50}
                        value={formData.job}
                        onChange={handleChange}
                        autoComplete="organization-title"
                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${errors.job ? 'outline-red-500' : 'outline-gray-300'
                            } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                    />
                </div>
                {errors.job && (
                    <p className="mt-1 text-xs text-red-600">{errors.job}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email (wymagane):
                </label>
                <div className="mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                        Hasło (wymagane):
                    </label>
                </div>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                Tworząc konto zgadzasz się z zasadami korzystania z portalu:
                <Link
                    href='/rules'
                    target="_blank"
                    rel="noopener noreferrer"
                    className='ml-1 text-cahir-blood'
                >
                    Link
                </Link>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center items-center gap-2 rounded-full bg-cahir-armor px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <>
                            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            <span>Rejestrowanie...</span>
                        </>
                    ) : (
                        <span>Zarejestruj się</span>
                    )}
                </button>
            </div>
        </form>
    );
}