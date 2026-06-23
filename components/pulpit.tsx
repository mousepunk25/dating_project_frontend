'use client'

import EditSonProfile from "./edit-son-profile";
import SonParentFriends from "./son-parent-friends";
import SonParentRequests from "./son-parent-requests";
import SonParentSaved from "./son-parent-saved";
import SonParentWaiting from "./son-parent-waiting";

export default function Puplit({profileId}: {profileId: string | undefined}) {
    return (
        <EditSonProfile profileId={profileId}/>
    )
}