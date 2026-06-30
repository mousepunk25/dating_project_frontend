'use client'

export default function SaveButton({ profileId }) {
    async function saveFriend() {
        const response = await fetch(`${url}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            // Automatically converted to "username=example&password=password"
            body: new URLSearchParams({ username: username, password: password }),
        });
        const profileId = await response.json() as { profileId: string };
    }
    return (
        <button onClick={saveFriend} className="rounded-md bg-indigo-600 px-3 py-2 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-2 mt-6">
            Save but don't add to the friends list
        </button>
    )
}