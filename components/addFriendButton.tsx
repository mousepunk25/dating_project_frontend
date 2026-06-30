'use client'

export default function AddFriendButton({ sonProfileId }: {sonProfileId: string}) {
    async function sendFriendRequest() {
        const cookies = document.cookie.split("; ");
        const profileIdCookie = cookies.find(row => row.startsWith("profileId="));
        const roleCookie = cookies.find(row => row.startsWith("role="));
        const profileIdCookieValue = profileIdCookie ? profileIdCookie.split("=")[1] : null;
        const roleCookieValue = roleCookie ? roleCookie.split("=")[1] : null;
        const oppositeRole = roleCookie === 'son' ? 'parents' : 'sons';
        const url = 'http://localhost:5173';
        // const url = 'https://dating-project-three.vercel.app';
        const response = await fetch(`${url}/${roleCookieValue}s/${profileIdCookieValue}/${oppositeRole}withrequestsent/${sonProfileId}`, {
            method: "POST",
            credentials: 'include'
        });
        const responseMessage = await response.json();
        console.log(responseMessage);
    }
    return (
        <button onClick={sendFriendRequest} className="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-2 mt-12">
            Add to the friends list
        </button>
    )
}