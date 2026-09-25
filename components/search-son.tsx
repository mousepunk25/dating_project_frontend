'use client';

import { useState, useEffect, ChangeEvent, FormEvent, FocusEvent } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

// Define the component's props interface
interface SearchSonProps {
    defaultCity?: string;
    defaultAgeMin?: string;
    defaultAgeMax?: string;
}

export default function SearchSon({
    defaultCity = '',
    defaultAgeMin = '18',
    defaultAgeMax = '100',
}: SearchSonProps) {
    const [city, setCity] = useState<string>(defaultCity);
    const [ageMin, setAgeMin] = useState<string>(defaultAgeMin);
    const [ageMax, setAgeMax] = useState<string>(defaultAgeMax);

    // Dynamic autocomplete and validation states
    const [cities, setCities] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [cityError, setCityError] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    // Fetch and parse poland.csv from public directory
    useEffect(() => {
        fetch('/poland.csv')
            .then((res) => res.text())
            .then((text) => {
                const lines = text.split('\n');
                const cityList = lines
                    .slice(1) // Skip header row
                    .map((line) => line.split(',')[0]?.trim())
                    .filter((c): c is string => Boolean(c)); // Type guard for array filtering

                setCities(cityList);
            })
            .catch((err: unknown) => console.error('Error loading poland.csv:', err));
    }, []);

    // Handle city input typing
    const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCity(value);
        setCityError('');

        if (value.trim().length > 0) {
            const matches = cities.filter((c) =>
                c.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(matches.slice(0, 8));
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle selecting a city from the list
    const handleSelectCity = (selectedCity: string) => {
        setCity(selectedCity);
        setShowSuggestions(false);
        setCityError('');
    };

    // Handle blur event to hide suggestions list with delay
    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    // Validate if the city exists in poland.csv before form submit
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        if (city.trim()) {
            const isValidCity = cities.some(
                (c) => c.toLowerCase() === city.trim().toLowerCase()
            );

            if (!isValidCity) {
                e.preventDefault();
                setCityError('Wybierz poprawne miasto z listy.');
                return;
            }
        }

        // Track standard GA4 search event on valid submission
        sendGAEvent('event', 'search', {
            search_term: city.trim() || 'all_cities',
            search_category: 'sons',
            age_min: ageMin,
            age_max: ageMax,
        });
    };

    // Generate array of numbers for age selectors
    const age: number[] = [];
    for (let i = 18; i <= 100; i++) {
        age.push(i);
    }

    return (
        <form action="/sons" onSubmit={handleSubmit}>
            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-6">
                <div className="sm:col-span-4">
                    <div className="mt-2 sm:flex">
                        <div className="shadow-xl relative w-full">
                            {/* City Field */}
                            <div className="relative">
                                <label
                                    htmlFor="city"
                                    className="flex items-center rounded-t-md bg-white pl-3 outline-1 -outline-offset-1 outline-cahir-armor focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cahir-blood cursor-pointer"
                                >
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        placeholder="Miasto"
                                        className="block sm:min-w-md grow bg-white py-4 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none font-bold"
                                        value={city}
                                        onChange={handleCityChange}
                                        onFocus={() => city.trim() && setShowSuggestions(true)}
                                        onBlur={handleBlur}
                                        autoComplete="off"
                                    />
                                </label>

                                {/* Autocomplete Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-b-md shadow-lg max-h-60 overflow-y-auto">
                                        {suggestions.map((s, index) => (
                                            <li
                                                key={`${s}-${index}`}
                                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium"
                                                onClick={() => handleSelectCity(s)}
                                            >
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Min Age Field */}
                            <label
                                htmlFor="ageMin"
                                className="relative flex items-center bg-white pl-3 outline-1 -outline-offset-1 outline-cahir-armor focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cahir-blood cursor-pointer"
                            >
                                <span className="text-lg pointer-events-none">Wiek minimum:</span>
                                <select
                                    name="ageMin"
                                    id="ageMin"
                                    value={ageMin}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setAgeMin(e.target.value)
                                    }
                                    className="grow bg-white py-4 mr-4 pl-1 text-lg text-gray-900 focus:outline-none font-bold cursor-pointer"
                                >
                                    {age.map((a) => (
                                        <option value={a} key={`ageMin_${a}`}>
                                            {a}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* Max Age Field */}
                            <label
                                htmlFor="ageMax"
                                className="relative flex items-center rounded-b-md bg-white pl-3 outline-1 -outline-offset-1 outline-cahir-armor focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cahir-blood cursor-pointer"
                            >
                                <span className="text-lg pointer-events-none">Wiek maksimum:</span>
                                <select
                                    name="ageMax"
                                    id="ageMax"
                                    value={ageMax}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setAgeMax(e.target.value)
                                    }
                                    className="grow bg-white py-4 mr-4 pl-1 text-lg text-gray-900 focus:outline-none font-bold cursor-pointer"
                                >
                                    {age.map((a) => (
                                        <option value={a} key={`ageMax_${a}`}>
                                            {a}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* Validation Error */}
                            {cityError && (
                                <p className="text-red-500 font-semibold text-sm mt-1 pl-1">
                                    {cityError}
                                </p>
                            )}
                        </div>

                        <div className="w-full flex flex-col items-center h-full">
                            <button
                                type="submit"
                                className="rounded-full bg-cahir-armor px-3 py-2 text-lg font-semibold text-white shadow-xs hover:bg-cahir-blood focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cahir-blood sm:ml-2 mt-5 w-full sm:h-16 sm:mt-12"
                            >
                                Szukaj
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}