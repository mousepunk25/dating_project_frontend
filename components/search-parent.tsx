'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface SearchParentProps {
    defaultCity?: string;
    defaultSonAge?: string;
}

export default function SearchParent({
    defaultCity = '',
    defaultSonAge = '35',
}: SearchParentProps) {
    const [city, setCity] = useState<string>(defaultCity);
    const [sonAge, setSonAge] = useState<string>(defaultSonAge);

    // City autocomplete and validation state
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
                    .slice(1) // Skip CSV header
                    .map((line) => line.split(',')[0]?.trim())
                    .filter((c): c is string => Boolean(c));

                setCities(cityList);
            })
            .catch((err: unknown) => console.error('Error loading poland.csv:', err));
    }, []);

    // Filter city suggestions on typing
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

    // Handle suggestion selection
    const handleSelectCity = (selectedCity: string) => {
        setCity(selectedCity);
        setShowSuggestions(false);
        setCityError('');
    };

    // Close options list with a brief delay on blur
    const handleBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    // Validate city name on submit
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
    };

    const age: number[] = [];
    for (let i = 18; i <= 100; i++) {
        age.push(i);
    }

    return (
        <form action="/parents" onSubmit={handleSubmit}>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <div className="mt-2 sm:flex">
                        <div className="shadow-xl relative w-full">
                            {/* City Field & Dropdown */}
                            <div className="relative">
                                <div className="items-center rounded-t-md bg-white pl-3 outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cahir-blood">
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
                                </div>

                                {/* Autocomplete Suggestions List */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <ul className="absolute z-10 w-full bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto">
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

                            {/* Age Select */}
                            <div className="items-center rounded-b-md bg-white pl-3 outline-1 -outline-offset-1 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-cahir-blood">
                                <label htmlFor="sonAge" className="text-lg">
                                    Twój wiek:
                                </label>
                                <select
                                    name="sonAge"
                                    id="sonAge"
                                    value={sonAge}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setSonAge(e.target.value)
                                    }
                                    className="sm:min-w-md grow bg-white py-4 pr-3 pl-1 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none font-bold"
                                >
                                    {age.map((a) => (
                                        <option value={a} key={`sonAge_${a}`}>
                                            {a}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* City Validation Error */}
                            {cityError && (
                                <p className="text-red-500 font-semibold text-sm mt-1 pl-1">
                                    {cityError}
                                </p>
                            )}
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