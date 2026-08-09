'use client'

import Link from "next/link";
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

export default function RegisterUser() {

    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;
    const [isParent, setIsParent] = useState(true);
    const [aboutYou, setAboutYou] = useState('');
    const getDefault30YearsOldDate = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 30);
        return today.toISOString().split('T')[0];
    };
    const [dateOfBirth, setDateOfBirth] = useState(getDefault30YearsOldDate);
    return (
        <form action={`${url}/register`} method="POST" className="space-y-6 mt-6">

            <fieldset>
                <legend>Select your role:</legend>

                <div className='mt-2'>
                    <input
                        type="radio"
                        id="parent"
                        name="role"
                        value="parent"
                        checked={isParent === true}
                        onChange={() => setIsParent(true)}
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
                        onChange={() => setIsParent(false)}
                    />
                    <label htmlFor="son" className='ml-2'>Son</label>
                </div>
            </fieldset>
            {isParent && (
                <div className="parent-section">
                    <div>
                        <label htmlFor="fullNameParent" className="block text-sm/6 font-medium text-gray-900">
                            Name (required - can be only the first name):
                        </label>
                        <div className="mt-2">
                            <input
                                id="fullNameParent"
                                name="fullNameParent"
                                type="fullNameParent"
                                required
                                autoComplete="fullNameParent"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="cityParent" className="block text-sm/6 font-medium text-gray-900">
                            City (required):
                        </label>
                        <div className="mt-2">
                            <input
                                id="cityParent"
                                name="cityParent"
                                type="cityParent"
                                required
                                autoComplete="cityParent"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="jobParent" className="block text-sm/6 font-medium text-gray-900">
                            Job (optional):
                        </label>
                        <div className="mt-2">
                            <input
                                id="jobParent"
                                name="jobParent"
                                type="jobParent"
                                required
                                autoComplete="jobParent"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Son section - renders only when isParent is false */}
            {!isParent && (
                <div className="son-section">
                    <div>
                        <label htmlFor="fullNameSon" className="block text-sm/6 font-medium text-gray-900">
                            Full Name:
                        </label>
                        <div className="mt-2">
                            <input
                                id="fullNameSon"
                                name="fullNameSon"
                                type="fullNameSon"
                                required
                                autoComplete="fullNameSon"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="citySon" className="block text-sm/6 font-medium text-gray-900">
                            City:
                        </label>
                        <div className="mt-2">
                            <input
                                id="citySon"
                                name="citySon"
                                type="citySon"
                                required
                                autoComplete="citySon"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="dateOfBirth" className="text-lg">Date of birth:</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={e => setDateOfBirth(e.target.value)}
                            max={new Date().toISOString().split('T')[0]} // Prevents selecting future dates
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
                                onChange={(e) => setAboutYou(e.target.value)}
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
                                type="jobSon"
                                required
                                autoComplete="jobSon"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="education" className="block text-sm/6 font-medium text-gray-900">
                            Education:
                        </label>
                        <div className="mt-2 grid grid-cols-1">
                                    <select
                                        id="education-level"
                                        name="education-level"
                                        autoComplete="education-level-name"
                                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        defaultValue='High School'
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
                        autoComplete="current-password"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                </div>
            </div>

            <div>
                By creating an account you agree to this set of rules:
                <Link
                    href='/rules'
                    className='ml-1 text-cahir-blood'
                >
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
    )
}