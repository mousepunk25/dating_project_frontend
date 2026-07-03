'use client'

import { useState } from 'react'; // 1. Import useState

export default function AddFriendButton({ sonProfileId }: { sonProfileId: string }) {
    // 2. Create state to hold the status message
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

    async function sendFriendRequest() {
        // Clear previous message on a new click
        setStatusMessage(null);
        setIsSuccess(null);

        const cookies = document.cookie.split("; ");
        const profileIdCookie = cookies.find(row => row.startsWith("profileId="));
        const roleCookie = cookies.find(row => row.startsWith("role="));
        const profileIdCookieValue = profileIdCookie ? profileIdCookie.split("=")[1] : null;
        const roleCookieValue = roleCookie ? roleCookie.split("=")[1] : null;

        const oppositeRole = roleCookieValue === 'son' ? 'parents' : 'sons';

        const url = 'http://localhost:5173';

        if (profileIdCookieValue && roleCookieValue) {
            try {
                const response = await fetch(`${url}/${roleCookieValue}s/${profileIdCookieValue}/${oppositeRole}withrequestsent/${sonProfileId}`, {
                    method: "POST",
                    credentials: 'include'
                });
                const responseMessage = await response.json();

                // 3. Check the response status
                if (response.status === 200) {
                    setStatusMessage(responseMessage.message);
                    setIsSuccess(true);
                } else {
                    setStatusMessage("User was not successfully added.");
                    setIsSuccess(false);
                }
            } catch (error) {
                console.error(error);
                setStatusMessage("A network error occurred. Please try again.");
                setIsSuccess(false);
            }
        } else {
            setStatusMessage('You have to be logged in!');
            setIsSuccess(false);
        }

    }

    return (
        <div className="flex flex-col items-start">
            <button
                onClick={sendFriendRequest}
                className="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-2 mt-12"
            >
                Add to the friends list
            </button>

            {/* 4. Conditionally render the message below the button */}
            {statusMessage && (
                <p className={`mt-3 text-sm sm:ml-2 font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {statusMessage}
                </p>
            )}
        </div>
    );
}