'use client'

import Link from "next/link";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { PhotoIcon } from '@heroicons/react/24/solid';

interface FormDataState {
    fullNameParent: string;
    cityParent: string;
    jobParent: string;
    fullNameSon: string;
    citySon: string;
    jobSon: string;
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
        jobParent: '',
        fullNameSon: '',
        citySon: '',
        jobSon: '',
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

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setImageBase64(base64);
            setImagePreview(base64);
        };
    };

    const validateField = (name: keyof FormDataState, value: string): string => {
        const textOnlyFields: (keyof FormDataState)[] = ['fullNameParent', 'fullNameSon', 'jobParent', 'jobSon'];

        if (textOnlyFields.includes(name)) {
            if (/\d/.test(value)) return 'Cannot contain numbers.';
            if (value.length > 50) return 'Must be 50 characters or less.';
        }

        const cityFields: (keyof FormDataState)[] = ['cityParent', 'citySon'];
        if (cityFields.includes(name)) {
            if (value.trim() !== '' && cities.length > 0) {
                const cityExists = cities.some(
                    (c) => c.toLowerCase() === value.trim().toLowerCase()
                );
                if (!cityExists) return 'Please select a valid city from the list.';
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
            ? ['fullNameParent', 'cityParent', 'jobParent']
            : ['fullNameSon', 'citySon', 'jobSon'];

        const newErrors: FormErrors = {};
        fieldsToValidate.forEach((field) => {
            const err = validateField(field, formData[field]);
            if (err) newErrors[field] = err;
        });

        if (Object.keys(newErrors).length > 0) {
            e.preventDefault();
            setErrors(newErrors);
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

            {/* Hidden input to transmit base64 string during normal form POST */}
            <input type="hidden" name="image" value={imageBase64} />

            <fieldset>
                <legend>Select your role:</legend>

                <div className='mt-2'>
                    <input
                        type="radio"
                        id="parent"
                        name="role"
                        value="parent"
                        checked={isParent === true}
                        onChange={() => handleRoleChange(true)}
                    />
                    <label htmlFor="parent" className='ml-2'>Parent</label>
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
                    <label htmlFor="son" className='ml-2'>Son</label>
                </div>
            </fieldset>

            {isParent && (
                <div className="parent-section space-y-4">
                    <div>
                        <label htmlFor="fullNameParent" className="block text-sm/6 font-medium text-gray-900">
                            Name (required - can be only the first name):
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
                            City (required):
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

                    <div>
                        <label htmlFor="jobParent" className="block text-sm/6 font-medium text-gray-900">
                            Job (optional):
                        </label>
                        <div className="mt-2">
                            <input
                                id="jobParent"
                                name="jobParent"
                                type="text"
                                maxLength={50}
                                value={formData.jobParent}
                                onChange={handleChange}
                                autoComplete="organization-title"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${errors.jobParent ? 'outline-red-500' : 'outline-gray-300'
                                    } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                            />
                        </div>
                        {errors.jobParent && (
                            <p className="mt-1 text-xs text-red-600">{errors.jobParent}</p>
                        )}
                    </div>
                </div>
            )}

            {!isParent && (
                <div className="son-section space-y-4">
                    {/* Profile Image Upload Field */}
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">
                            Profile Picture (optional):
                        </label>
                        <div className="mt-2 flex items-center gap-x-4">
                            {imagePreview ? (
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
                                <span>Upload photo</span>
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
                            Full Name:
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
                            City:
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
                        <label htmlFor="dateOfBirth" className="text-lg">Date of birth:</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
                            max={getMax18YearsOldDate()}
                            className="sm:min-w-md grow bg-white py-4 pr-3 pl-3 text-lg text-gray-900 focus:outline-none font-bold"
                        />
                    </div>

                    <div>
                        <label htmlFor="aboutYou" className="block text-sm/6 font-medium text-gray-900">
                            About You:
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="aboutYou"
                                name="aboutYou"
                                rows={4}
                                maxLength={1000}
                                required
                                value={aboutYou}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAboutYou(e.target.value)}
                                placeholder="Tell us about yourself..."
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                            <p className="mt-1 text-right text-xs text-gray-500">
                                {aboutYou.length}/1000 characters
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="jobSon" className="block text-sm/6 font-medium text-gray-900">
                            Job:
                        </label>
                        <div className="mt-2">
                            <input
                                id="jobSon"
                                name="jobSon"
                                type="text"
                                required
                                maxLength={50}
                                value={formData.jobSon}
                                onChange={handleChange}
                                autoComplete="organization-title"
                                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${errors.jobSon ? 'outline-red-500' : 'outline-gray-300'
                                    } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6`}
                            />
                        </div>
                        {errors.jobSon && (
                            <p className="mt-1 text-xs text-red-600">{errors.jobSon}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="education-level" className="block text-sm/6 font-medium text-gray-900">
                            Education:
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                            <select
                                id="education-level"
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleChange}
                                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            >
                                <option>Elementary</option>
                                <option>High School</option>
                                <option>Certificate</option>
                                <option>Associate's Degree</option>
                                <option>Bachelor's Degree</option>
                                <option>Master's Degree</option>
                                <option>Doctorate/Ph.D</option>
                            </select>
                            <ChevronDownIcon
                                aria-hidden="true"
                                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Email address:
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
                        Password:
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
                By creating an account you agree to this set of rules:
                <Link href='/rules' className='ml-1 text-cahir-blood'>
                    Link
                </Link>
            </div>

            <div>
                <button
                    type="submit"
                    className="flex w-full justify-center rounded-full bg-cahir-armor px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Sign in
                </button>
            </div>
        </form>
    );
}