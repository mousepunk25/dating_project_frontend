'use client'

import { PhotoIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import Image from 'next/image'

export default function EditSonProfile({ profileId }: { profileId: string | undefined }) {

    const [userDetails, setUserDetails] = useState({});
    const url = 'http://localhost:5173';
    // const url = 'https://dating-project-three.vercel.app';

    useEffect(() => {
        let ignore = false;
        async function fetchUserDetails() {
            const userDetailsResponse = await fetch(`${url}/sons/${profileId}`);
            const userDetailsJSON = await userDetailsResponse.json();
            if (!ignore) {
                console.log(userDetailsJSON);
                setUserDetails(userDetailsJSON);
            }
        }
        fetchUserDetails();
        return () => {
            ignore = true;
        }
    }, [profileId]);

    async function updateProfile(formData: FormData) {
        const aboutYou = formData.get('about');
        console.log(aboutYou);
        const imageUrl = 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        const fullName = formData.get('full-name');
        const addressCountry = formData.get('country');
        const addressCity = formData.get('city');
        const jobPosition = formData.get('job-position');
        const companyName = formData.get('company');
        const schoolName = formData.get('school-name');
        const educationLevel = formData.get('education-level');
        const facebook = formData.get('facebook');
        const instagram = formData.get('instagram');
        const linkedin = formData.get('linkedin');
        const twitter = formData.get('twitter');
        const updatedUserDetails = {
            ...userDetails,
            aboutYou,
            image: {
                ...userDetails.image,
                url: imageUrl
            },
            fullName,
            address: {
                ...userDetails.address,
                country: addressCountry,
                city: addressCity
            },
            job: {
                ...userDetails.job,
                position: jobPosition,
                companyName
            },
            education: {
                ...userDetails.education,
                schoolName,
                educationLevel,
            },
            socialMedia: [
                {
                    website: 'Facebook',
                    url: facebook
                },
                {
                    website: 'Twitter',
                    url: twitter
                },
                {
                    website: 'Instagram',
                    url: instagram
                },
                {
                    website: 'Linkedin',
                    url: linkedin
                }
            ]
        }
        console.log('updatedDetails:');
        console.log(updatedUserDetails);
        setUserDetails(updatedUserDetails);
        try {
            console.log(userDetails);
            const response = await fetch(`${url}/sons/edit/${profileId}`, {
                method: "PUT",
                headers: {
                    // ✅ Tell the backend to expect JSON data
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify(updatedUserDetails),
            });
            const message = await response.json();
            console.log(message);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <form action={updateProfile}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">
                        This information will be displayed publicly so be careful what you share.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                            <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
                                About you
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="about"
                                    name="about"
                                    rows={3}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.aboutYou}
                                />
                            </div>
                            <p className="mt-3 text-sm/6 text-gray-600">Write a few sentences about yourself.</p>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
                                Photo
                            </label>
                            <div className="mt-2 flex items-center gap-x-3">
                                {userDetails.image ? <Image
                                    src={userDetails.image.url}
                                    width={500}
                                    height={500}
                                    alt="Picture of the candidate"
                                /> : <PhotoIcon aria-hidden="true" className="size-12 text-gray-300" />}
                                <button
                                    type="button"
                                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Write correct name of your city. It will be used to find you.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="full-name" className="block text-sm/6 font-medium text-gray-900">
                                Full name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="full-name"
                                    name="full-name"
                                    type="text"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.fullName}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="country" className="block text-sm/6 font-medium text-gray-900">
                                Country
                            </label>
                            <div className="mt-2 grid grid-cols-1">
                                <select
                                    id="country"
                                    name="country"
                                    autoComplete="country-name"
                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.address ? userDetails.address.country : ''}
                                >
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>Mexico</option>
                                    <option>France</option>
                                    <option>Germany</option>
                                    <option>Poland</option>
                                    <option>Spain</option>
                                </select>
                                <ChevronDownIcon
                                    aria-hidden="true"
                                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                                City
                            </label>
                            <div className="mt-2">
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.address ? userDetails.address.city : ''}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Your job</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Your job can important to someone</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="job-position" className="block text-sm/6 font-medium text-gray-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    id="job-position"
                                    name="job-position"
                                    type="text"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.job ? userDetails.job.position : ''}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="company" className="block text-sm/6 font-medium text-gray-900">
                                Company
                            </label>
                            <div className="mt-2">
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.job ? userDetails.job.companyName : ''}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Education</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Your education can be important to someone.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="school-name" className="block text-sm/6 font-medium text-gray-900">
                                School name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="school-name"
                                    name="school-name"
                                    type="text"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.education ? userDetails.education.schoolName : ''}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="education-level" className="block text-sm/6 font-medium text-gray-900">
                                Education level
                            </label>
                            <div className="mt-2 grid grid-cols-1">
                                <select
                                    id="education-level"
                                    name="education-level"
                                    autoComplete="education-level-name"
                                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.education ? userDetails.education.educationLevel : ''}
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
                </div>

                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base/7 font-semibold text-gray-900">Social media</h2>
                    <p className="mt-1 text-sm/6 text-gray-600">Maybe someone would like to know even more about you</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="facebook" className="block text-sm/6 font-medium text-gray-900">
                                Facebook
                            </label>
                            <div className="mt-2">
                                <input
                                    id="facebook"
                                    name="facebook"
                                    type="text"
                                    autoComplete="given-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.socialMedia ? userDetails.socialMedia.find(sm => sm.website === 'Facebook') ? userDetails.socialMedia.find(sm => sm.website === 'Facebook').url : '' : ''}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="instagram" className="block text-sm/6 font-medium text-gray-900">
                                Instagram
                            </label>
                            <div className="mt-2">
                                <input
                                    id="instagram"
                                    name="instagram"
                                    type="text"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.socialMedia ? userDetails.socialMedia.find(sm => sm.website === 'Instagram') ? userDetails.socialMedia.find(sm => sm.website === 'Instagram').url : '' : ''}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="twitter" className="block text-sm/6 font-medium text-gray-900">
                                Twitter
                            </label>
                            <div className="mt-2">
                                <input
                                    id="twitter"
                                    name="twitter"
                                    type="text"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.socialMedia ? userDetails.socialMedia.find(sm => sm.website === 'Twitter') ? userDetails.socialMedia.find(sm => sm.website === 'Twitter').url : '' : ''}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="linkedin" className="block text-sm/6 font-medium text-gray-900">
                                Linkedin
                            </label>
                            <div className="mt-2">
                                <input
                                    id="linkedin"
                                    name="linkedin"
                                    type="text"
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    defaultValue={userDetails.socialMedia ? userDetails.socialMedia.find(sm => sm.website === 'Linkedin') ? userDetails.socialMedia.find(sm => sm.website === 'Linkedin').url : '' : ''}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm/6 font-semibold text-gray-900">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    )
}