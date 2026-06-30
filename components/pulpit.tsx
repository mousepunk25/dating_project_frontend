'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogPanel,
    PopoverGroup,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

import EditSonProfile from "./edit-son-profile";
import SonParentFriends from "./son-parent-friends";
import SonParentRequests from "./son-parent-requests";
import SonParentSaved from "./son-parent-saved";
import SonParentWaiting from "./son-parent-waiting";

type PanelStatus = 'edit-profile' | 'friends-list' | 'friends-requests-received' | 'friends-requests-sent' | 'candidates-saved';

export default function Pulpit({
    profileId,
    role
}: {
    profileId: string | undefined,
    role: 'son' | 'parent' | undefined
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [panel, setPanel] = useState<PanelStatus>('friends-list');
    function panelToRender(panel: PanelStatus) {
        switch(panel) {
            case 'edit-profile':
                return <EditSonProfile profileId={profileId}/>;
            case 'friends-list':
                return <SonParentFriends/>
            case 'friends-requests-received':
                return <SonParentRequests/>
            case 'friends-requests-sent':
                return <SonParentWaiting/>
            case 'candidates-saved':
                return <SonParentSaved/>
        }
    }
    return (
        <div>
            <header className="bg-white">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                        <button onClick={() => setPanel('edit-profile')} className={`cursor-pointer text-sm/6 ${panel === 'edit-profile' && 'font-semibold'}`}>
                            Edit Profile
                        </button>
                        <button onClick={() => setPanel('friends-list')} className={`cursor-pointer text-sm/6 ${panel === 'friends-list' && 'font-semibold'}`}>
                            Friends
                        </button>
                        <button onClick={() => setPanel('friends-requests-received')} className={`cursor-pointer text-sm/6 ${panel === 'friends-requests-received' && 'font-semibold'}`}>
                            Friends Requests Received
                        </button>
                        <button onClick={() => setPanel('friends-requests-sent')} className={`cursor-pointer text-sm/6 ${panel === 'friends-requests-sent' && 'font-semibold'}`}>
                            Friends Requests Sent
                        </button>
                        <button onClick={() => setPanel('candidates-saved')} className={`cursor-pointer text-sm/6 ${panel === 'candidates-saved' && 'font-semibold'}`}>
                            Candidates Saved
                        </button>
                    </PopoverGroup>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    <button
                                        onClick={() => setPanel('edit-profile')}
                                        className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-gray-50 ${panel === 'edit-profile' && 'font-semibold'}`}
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setPanel('friends-list')}
                                        className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-gray-50 ${panel === 'friends-list' && 'font-semibold'}`}
                                    >
                                        Friends
                                    </button>
                                    <button
                                        onClick={() => setPanel('friends-requests-received')}
                                        className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-gray-50 ${panel === 'friends-requests-received' && 'font-semibold'}`}
                                    >
                                        Friends Requests Received
                                    </button>
                                    <button
                                        onClick={() => setPanel('friends-requests-sent')}
                                        className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-gray-50 ${panel === 'friends-requests-sent' && 'font-semibold'}`}
                                    >
                                        Friends Requests Sent
                                    </button>
                                    <button
                                        onClick={() => setPanel('candidates-saved')}
                                        className={`-mx-3 block rounded-lg px-3 py-2 text-base/7 hover:bg-gray-50 ${panel === 'candidates-saved' && 'font-semibold'}`}
                                    >
                                        Candidates Saved
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
            <div>
            {panelToRender(panel)}
            </div>
        </div>
    )
    // if (role === 'son') {
    //     return (
    //         <EditSonProfile profileId={profileId} />
    //     )
    // }
    // return (
    //     <h1>Edit Parent Profile</h1>
    // )
}