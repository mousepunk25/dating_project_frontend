'use client'

import { useState } from 'react';

export default function AddFriendButton({ sonProfileId }: { sonProfileId: string }) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // 1. Track loading state

    async function sendFriendRequest() {
        setStatusMessage(null);
        setIsSuccess(null);
        setIsLoading(true); // 2. Start loading

        const cookies = document.cookie.split("; ");
        const profileIdCookie = cookies.find(row => row.startsWith("profileId="));
        const roleCookie = cookies.find(row => row.startsWith("role="));
        const profileIdCookieValue = profileIdCookie ? profileIdCookie.split("=")[1] : null;
        const roleCookieValue = roleCookie ? roleCookie.split("=")[1] : null;

        const oppositeRole = roleCookieValue === 'son' ? 'parents' : 'sons';
        const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
            ? process.env.NEXT_PUBLIC_DEV_API_URL 
            : process.env.NEXT_PUBLIC_PROD_API_URL;

        if (profileIdCookieValue && roleCookieValue) {
            try {
                const response = await fetch(`${url}/${roleCookieValue}s/${profileIdCookieValue}/${oppositeRole}withrequestsent/${sonProfileId}`, {
                    method: "POST",
                    credentials: 'include'
                });
                const responseMessage = await response.json();

                if (response.status === 200) {
                    setStatusMessage(responseMessage.message);
                    setIsSuccess(true);
                } else {
                    setStatusMessage(responseMessage.message || "Coś poszło nie tak. Użytkownik nie został dodany.");
                    setIsSuccess(false);
                }
            } catch (error) {
                console.error(error);
                setStatusMessage("Wystąpił problem. Proszę spróbować później.");
                setIsSuccess(false);
            } finally {
                setIsLoading(false); // 3. Always reset loading state
            }
        } else {
            setStatusMessage('Musisz być zalogowany!');
            setIsSuccess(false);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-start w-full">
            <button
                onClick={sendFriendRequest}
                disabled={isLoading} // 4. Disable interaction while pending
                className="rounded-full bg-cahir-armor px-3 py-2 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 my-2 w-full flex items-center justify-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Wysyłanie...
                    </span>
                ) : (
                    'Wyślij zaproszenie do listy znajomych'
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