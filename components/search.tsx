'use client';

import { useState } from 'react';

export default function Search({defaultCity = ''}) {
    const [city, setCity] = useState(defaultCity);
    return (
        <form action="/sons">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="city" className="block text-sm/6 font-medium text-gray-900">
                        <p className="font-bold text-lg">
                            City
                        </p>
                    </label>
                    <div className="mt-2 sm:flex">
                        <div className="items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                            <input
                                id="city"
                                name="city"
                                type="text"
                                placeholder="Paris"
                                className="block sm:min-w-md grow bg-white py-3 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none font-bold"
                                value={city}
                                onChange={e => setCity(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-2 mt-1 sm:mt-0"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}