'use client'

import { useState, useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';

export default function AddFriendButton({ sonProfileId }: { sonProfileId: string }) {
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // States for status checks
    const [isAlreadyFriend, setIsAlreadyFriend] = useState<boolean>(false);
    const [isRequestSent, setIsRequestSent] = useState<boolean>(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);

    const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
        ? process.env.NEXT_PUBLIC_DEV_API_URL 
        : process.env.NEXT_PUBLIC_PROD_API_URL;

    // Check both friendship and sent request status
    useEffect(() => {
        async function checkRelationshipStatus() {
            const cookies = document.cookie.split("; ");
            const profileIdCookie = cookies.find(row => row.startsWith("profileId="));
            const roleCookie = cookies.find(row => row.startsWith("role="));
            
            const profileId = profileIdCookie ? profileIdCookie.split("=")[1] : null;
            const role = roleCookie ? roleCookie.split("=")[1] : null;

            if (!profileId || !role) {
                setIsCheckingStatus(false);
                return;
            }

            const friendsEndpoint = role === 'son' ? 'parentsfriends' : 'sonsfriends';
            const requestsSentEndpoint = role === 'son' ? 'parentswithrequestsent' : 'sonswithrequestsent';

            try {
                const [friendsRes, requestsRes] = await Promise.all([
                    fetch(`${url}/${role}s/${profileId}/${friendsEndpoint}`, { method: 'GET', credentials: 'include' }),
                    fetch(`${url}/${role}s/${profileId}/${requestsSentEndpoint}`, { method: 'GET', credentials: 'include' })
                ]);

                // 1. Check if already friends
                if (friendsRes.ok) {
                    const friendsList = await friendsRes.json();
                    const isFriend = Array.isArray(friendsList) && friendsList.some((item: any) => {
                        const targetEntity = item.parent || item.son;
                        const friendId = typeof targetEntity === 'object' ? targetEntity?._id : targetEntity;
                        return friendId === sonProfileId;
                    });
                    setIsAlreadyFriend(isFriend);
                }

                // 2. Check if friend request was already sent
                if (requestsRes.ok) {
                    const requestsList = await requestsRes.json();
                    const hasSentRequest = Array.isArray(requestsList) && requestsList.some((item: any) => {
                        // Supports populated document, sub-property entity, or raw string ID
                        const targetEntity = item.parent || item.son || item;
                        const requestId = typeof targetEntity === 'object' ? targetEntity?._id : targetEntity;
                        return requestId === sonProfileId;
                    });
                    setIsRequestSent(hasSentRequest);
                }
            } catch (error) {
                console.error("Błąd podczas sprawdzania statusu relacji:", error);
            } finally {
                setIsCheckingStatus(false);
            }
        }

        checkRelationshipStatus();
    }, [sonProfileId, url]);

    async function sendFriendRequest() {
        setStatusMessage(null);
        setIsSuccess(null);
        setIsLoading(true);

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
            const response = await fetch(`${url}/${roleCookieValue}s/${profileIdCookieValue}/${oppositeRole}withrequestsent/${sonProfileId}`, {
                method: "POST",
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                sendGAEvent('event', 'send_friend_request', {
                    category: 'social_interaction',
                    sender_role: roleCookieValue,
                });

                setStatusMessage(data.message || "Zaproszenie zostało wysłane!");
                setIsSuccess(true);
                setIsRequestSent(true); // Dynamically update status to show request sent badge
            } else {
                let messageToDisplay = "Coś poszło nie tak. Użytkownik nie został dodany.";

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

    if (isCheckingStatus) {
        return (
            <div className="py-2 text-sm text-gray-500">
                Sprawdzanie statusu...
            </div>
        );
    }

    if (isAlreadyFriend) {
        return (
            <div className="my-2 w-full rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-2 text-center text-sm font-semibold text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700">
                Ten profil znajduje się już na Twojej liście znajomych.
            </div>
        );
    }

    if (isRequestSent) {
        return (
            <div className="my-2 w-full rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-2 text-center text-sm font-semibold text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                Zaproszenie zostało już wysłane.
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start w-full">
            <button
                onClick={sendFriendRequest}
                disabled={isLoading}
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