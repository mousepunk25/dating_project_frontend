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
        const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;

        if (profileIdCookieValue && roleCookieValue) {
            try {
                const response = await fetch(`${url}/${roleCookieValue}s/${profileIdCookieValue}/${oppositeRole}saved/${sonProfileId}`, {
                    method: "POST",
                    credentials: 'include'
                });
                const responseMessage = await response.json();
                if (response.status === 200) {
                    setStatusMessage(responseMessage.message);
                    setIsSuccess(true);
                } else {
                    setStatusMessage("User was not successfully saved.");
                    setIsSuccess(false);
                }
            } catch (error) {
                console.error(error);
                setStatusMessage("A network error occurred. Please try again.");
                setIsSuccess(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            setStatusMessage('You have to be logged in!');
            setIsSuccess(false);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-start">
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
                <p className={`mt-1 text-sm sm:ml-2 font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {statusMessage}
                </p>
            )}
        </div>
    );
}