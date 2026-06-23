'use client'

import Pulpit from './pulpit';
import Login from './login';

export default function Dashboard({profileId}: {profileId: string | undefined}) {
    if (profileId) {
        return (
            <Pulpit profileId={profileId}/>
        )
    }
    return (
        <Login />
    )
}
