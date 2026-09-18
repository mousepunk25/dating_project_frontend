'use client';

import { useState } from 'react';

export default function SearchSon({ defaultCity = '', defaultAgeMin = '18', defaultAgeMax = '100' }) {
    const [city, setCity] = useState(defaultCity);
    const [ageMin, setAgeMin] = useState(defaultAgeMin);
    const [ageMax, setAgeMax] = useState(defaultAgeMax);

    const age = [];
    for (let i = 18; i <= 100; i++) {
        age.push(i);
    }

    return (
        <form action="/sons">
            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <div className="mt-2 sm:flex">
                        <div className='shadow-xl'>
                            {/* City Field */}
                            <label htmlFor="city" className="flex items-center rounded-t-md bg-white pl-3 outline-1 -outline-offset-1 outline-cahir-armor focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cahir-blood cursor-pointer">
                                <input
                                    id="city"
                                    name="city"
                                    type="text"
                                    placeholder="Miasto"
                                    className="block sm:min-w-md grow bg-white py-4 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none font-bold"
                                    value={city}
                                    onChange={e => setCity(e.target.value)}
                                />
                            </label>

                            {/* Min Age Field */}
                            <label htmlFor="ageMin" className="relative flex items-center bg-white pl-3 outline-1 -outline-offset-1 outline-cahir-armor focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cahir-blood cursor-pointer">
                                <span className="text-lg pointer-events-none">Wiek minimum:</span>
                                <select 
                                    name="ageMin" 
                                    id="ageMin" 
                                    value={ageMin} 
                                    onChange={e => setAgeMin(e.target.value)}
                                    className="grow bg-white py-4 mr-4 pl-1 text-lg text-gray-900 focus:outline-none font-bold cursor-pointer"
                                >
                                    {age.map(a => (
                                        <option value={a} key={`ageMin_${a}`}>{a}</option>
                                    ))}
                                </select>
                            </label>

                            {/* Max Age Field */}
                            <label htmlFor="ageMax" className="relative flex items-center rounded-b-md bg-white pl-3 outline-1 -outline-offset-1 outline-cahir-armor focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cahir-blood cursor-pointer">
                                <span className="text-lg pointer-events-none">Wiek maksimum:</span>
                                <select 
                                    name="ageMax" 
                                    id="ageMax" 
                                    value={ageMax} 
                                    onChange={e => setAgeMax(e.target.value)}
                                    className="grow bg-white py-4 mr-4 pl-1 text-lg text-gray-900 focus:outline-none font-bold cursor-pointer"
                                >
                                    {age.map(a => (
                                        <option value={a} key={`ageMax_${a}`}>{a}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="rounded-full bg-cahir-armor px-3 py-2 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cahir-blood sm:ml-2 mt-5 w-full"
                        >
                            Szukaj
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}