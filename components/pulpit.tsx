'use client'

import { useState, useRef, useEffect } from 'react'
import {
    Dialog,
    DialogPanel
} from '@headlessui/react'
import {
    XMarkIcon,
    PencilSquareIcon,
    ChatBubbleLeftRightIcon,
    EnvelopeOpenIcon,
    EnvelopeIcon,
    BookmarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline'

import EditUserProfile from "./edit-user-profile";
import SonParentFriends from "./son-parent-friends";
import SonParentRequests from "./son-parent-requests";
import SonParentSaved from "./son-parent-saved";
import SonParentWaiting from "./son-parent-waiting";
import Chat from "./chat";

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' ? process.env.NEXT_PUBLIC_DEV_API_URL : process.env.NEXT_PUBLIC_PROD_API_URL;

type PanelStatus = 'edit-profile' | 'friends-list' | 'friends-requests-received' | 'friends-requests-sent' | 'candidates-saved';

export default function Pulpit({
    profileId,
    role
}: {
    profileId: string,
    role: 'son' | 'parent'
}) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [panel, setPanel] = useState<PanelStatus>('friends-list');
    const [selectedChat, setSelectedChat] = useState('');
    const [conversations, setConversations] = useState([]);
    const [conversationsNotRead, setConversationsNotRead] = useState([]);
    function selectChat(friend: string) {
        if (selectedChat.length > 0) {
            setSelectedChat('');
        } else {
            const conversationWithFriend = conversations.find(c => c.participantParent._id === friend || c.participantSon._id === friend);
            setSelectedChat(conversationWithFriend._id);
        }
    }
    function panelToRender(panel: PanelStatus) {
        switch (panel) {
            case 'edit-profile':
                return <EditUserProfile profileId={profileId} role={role} />;
            case 'friends-list':
                return <SonParentFriends profileId={profileId} role={role} showChat={selectChat} unreadConversations={conversationsNotRead}/>
            case 'friends-requests-received':
                return <SonParentRequests profileId={profileId} role={role} />
            case 'friends-requests-sent':
                return <SonParentWaiting profileId={profileId} role={role} />
            case 'candidates-saved':
                return <SonParentSaved profileId={profileId} role={role} />
        }
    }

    // Inside your component:
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setShowLeftArrow(el.scrollLeft > 5);
        setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    useEffect(() => {
            let ignore = false;
            async function fetchUserConversations() {
                const userConversationsResponse = await fetch(`${url}/conversations`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const userConversationsJSON = await userConversationsResponse.json();
                if (!ignore && userConversationsJSON && Array.isArray(userConversationsJSON.conversations) && userConversationsJSON.conversations.length > 0) {
                    setConversations(userConversationsJSON.conversations);
                    console.log(userConversationsJSON.conversations);
                    const ownerId = userConversationsJSON.conversations[0].participantParent._id === profileId ? userConversationsJSON.conversations[0].participantParent.owner : userConversationsJSON.conversations[0].participantSon.owner;
                    const conversationsNotRead = userConversationsJSON.conversations.filter(c => !c.lastMessage.readBy.includes(ownerId));
                    setConversationsNotRead(conversationsNotRead);
                }
            }
            fetchUserConversations();
            return () => {
                ignore = true;
            }
        }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 200;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <div className="relative min-h-screen">
            <header className="bg-white">
                <nav aria-label="Global" className="relative mx-auto max-w-7xl items-center lg:px-8 my-5">
                    {/* Left Arrow */}
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            aria-label="Scroll Left"
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-gradient-to-r from-white via-white/80 to-transparent pr-4 pl-1 py-2 text-gray-700 hover:text-black cursor-pointer"
                        >
                            <ChevronLeftIcon className="size-6" />
                        </button>
                    )}

                    {/* Scrollable Container */}
                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex w-full overflow-x-auto whitespace-nowrap scrollbar-none py-2 scroll-smooth"
                    >
                        <div className="shrink-0">
                            <button
                                onClick={() => setPanel('edit-profile')}
                                className={`cursor-pointer text-sm/6 px-4 pt-2 grid grid-flow-row justify-items-center ${panel === 'edit-profile' ? 'font-semibold border-2 border-cahir-blood text-cahir-blood rounded-lg' : ''}`}
                            >
                                <PencilSquareIcon className="size-6" />
                                Edit Profile
                            </button>
                        </div>
                        <div className="shrink-0">
                            <button
                                onClick={() => setPanel('friends-list')}
                                className={`cursor-pointer text-sm/6 px-4 pt-2 grid grid-flow-row justify-items-center ${panel === 'friends-list' ? 'font-semibold border-2 border-cahir-blood text-cahir-blood rounded-lg' : ''}`}
                            >
                                <ChatBubbleLeftRightIcon className="size-6" />
                                Friends
                            </button>
                        </div>
                        <div className="shrink-0">
                            <button
                                onClick={() => setPanel('friends-requests-received')}
                                className={`cursor-pointer text-sm/6 px-4 pt-2 grid grid-flow-row justify-items-center ${panel === 'friends-requests-received' ? 'font-semibold border-2 border-cahir-blood text-cahir-blood rounded-lg' : ''}`}
                            >
                                <EnvelopeOpenIcon className="size-6" />
                                Requests Received
                            </button>
                        </div>
                        <div className="shrink-0">
                            <button
                                onClick={() => setPanel('friends-requests-sent')}
                                className={`cursor-pointer text-sm/6 px-4 pt-2 grid grid-flow-row justify-items-center ${panel === 'friends-requests-sent' ? 'font-semibold border-2 border-cahir-blood text-cahir-blood rounded-lg' : ''}`}
                            >
                                <EnvelopeIcon className="size-6" />
                                Requests Sent
                            </button>
                        </div>
                        <div className="shrink-0">
                            <button
                                onClick={() => setPanel('candidates-saved')}
                                className={`cursor-pointer text-sm/6 px-4 pt-2 grid grid-flow-row justify-items-center ${panel === 'candidates-saved' ? 'font-semibold border-2 border-cahir-blood text-cahir-blood rounded-lg' : ''}`}
                            >
                                <BookmarkIcon className="size-6" />
                                Candidates Saved
                            </button>
                        </div>
                    </div>

                    {/* Right Arrow */}
                    {showRightArrow && (
                        <button
                            onClick={() => scroll('right')}
                            aria-label="Scroll Right"
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center bg-gradient-to-l from-white via-white/80 to-transparent pl-4 pr-1 py-2 text-gray-700 hover:text-black cursor-pointer"
                        >
                            <ChevronRightIcon className="size-6" />
                        </button>
                    )}
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

            {/* Bottom Right Floating Chat Component */}
            {selectedChat.length > 0 &&
                <div className="fixed bottom-1 right-1 z-40">
                    <Chat selectedChat={selectedChat} user={profileId} onClose={selectChat}/>
                </div>
            }
        </div>
    )
}