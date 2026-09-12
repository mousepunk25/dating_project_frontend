'use client'

import { useState } from 'react';

export default function SaveButton({ sonProfileId }: { sonProfileId: string }) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
            ? process.env.NEXT_PUBLIC_DEV_API_URL 
            : process.env.NEXT_PUBLIC_PROD_API_URL;

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
            } else {
                // Parse error format: single string ({ error: "..." }), array ({ errors: [...] }), or fallback message
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