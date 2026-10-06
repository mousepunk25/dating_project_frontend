'use client'

import { useState, useEffect } from 'react';

export default function SaveButton({ sonProfileId }: { sonProfileId: string }) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // States for checking saved status
    const [isAlreadySaved, setIsAlreadySaved] = useState<boolean>(false);
    const [isCheckingSaved, setIsCheckingSaved] = useState<boolean>(true);

    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
        ? process.env.NEXT_PUBLIC_DEV_API_URL 
        : process.env.NEXT_PUBLIC_PROD_API_URL;

    // Check if the candidate is already on the saved list
    useEffect(() => {
        async function checkSavedStatus() {
            const cookies = document.cookie.split("; ");
            const profileIdCookie = cookies.find(row => row.startsWith("profileId="));
            const roleCookie = cookies.find(row => row.startsWith("role="));

            const profileId = profileIdCookie ? profileIdCookie.split("=")[1] : null;
            const role = roleCookie ? roleCookie.split("=")[1] : null;

            if (!profileId || !role) {
                setIsCheckingSaved(false);
                return;
            }

            const oppositeRole = role === 'son' ? 'parents' : 'sons';

            try {
                const response = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}saved`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    const savedList = await response.json();

                    // Check if candidate exists in array (handles populated objects or plain string IDs)
                    const isSaved = Array.isArray(savedList) && savedList.some((item: any) => {
                        const savedId = typeof item === 'object' ? item?._id : item;
                        return savedId === sonProfileId;
                    });

                    setIsAlreadySaved(isSaved);
                }
            } catch (error) {
                console.error("Błąd podczas sprawdzania zapisanych profili:", error);
            } finally {
                setIsCheckingSaved(false);
            }
        }

        checkSavedStatus();
    }, [sonProfileId, url]);

    async function saveFriend() {
        if (isLoading) return; // Guard against rapid multi-clicks

        setIsLoading(true);
        setStatusMessage(null);
        setIsSuccess(null);

        const cookies = document.cookie.split("; ");
        const profileIdCookie = cookies.find(row => row.startsWith("profileId="));
        const roleCookie = cookies.find(row => row.startsWith("role="));
        const profileIdCookieValue = profileIdCookie ? profileIdCookie.split("=")[1] : null;
        const roleCookieValue = roleCookie ? roleCookie.split("=")[1] : null;

        const oppositeRole = roleCookieValue === 'son' ? 'parents' : 'sons';

        if (!profileIdCookieValue || !roleCookieValue) {
            setStatusMessage('Musisz być zalogowany!');
            setIsSuccess(false);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${url}/${roleCookieValue}s/${profileIdCookieValue}/${oppositeRole}saved/${sonProfileId}`, {
                method: "POST",
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMessage(data.message || "Profil został pomyślnie zapisany!");
                setIsSuccess(true);
                setIsAlreadySaved(true);
            } else {
                let messageToDisplay = "Profil nie został zapisany.";

                if (typeof data.error === 'string') {
                    messageToDisplay = data.error;
                } else if (Array.isArray(data.errors) && data.errors.length > 0) {
                    messageToDisplay = data.errors.map((e: { msg?: string }) => e.msg).join(', ');
                } else if (typeof data.message === 'string') {
                    messageToDisplay = data.message;
                }

                setStatusMessage(messageToDisplay);
                setIsSuccess(false);
            }
        } catch (error) {
            console.error(error);
            setStatusMessage("Wystąpił problem z połączeniem. Proszę spróbować później.");
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }

    if (isCheckingSaved) {
        return (
            <div className="py-2 text-sm text-gray-500">
                Sprawdzanie statusu profilu...
            </div>
        );
    }

    if (isAlreadySaved) {
        return (
            <div className="my-2 w-full rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-2 text-center text-sm font-semibold text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                Ten profil znajduje się już na Twojej liście zapisanych.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start w-full">
            <button 
                onClick={saveFriend} 
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-full bg-cahir-armor px-3 py-2 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-2 w-full disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
                {isLoading ? (
                    <>
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Zapisywanie...</span>
                    </>
                ) : (
                    <span>Zapisz, ale nie wysyłaj zaproszenia do znajomych</span>
                )}
            </button>
            {statusMessage && (
                <p className={`mt-1 text-sm sm:ml-2 font-medium ${isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {statusMessage}
                </p>
            )}
        </div>
    );
}