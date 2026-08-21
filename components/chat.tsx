'use client'

import { useEffect, useState, useRef } from "react";
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;

export interface Message {
    _id: string;
    conversationId: string;
    sender: string;
    text: string;
    readBy: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface Participant {
    _id: string;
    owner: string;
    fullName: string;
}

export interface Conversation {
    _id: string;
    participantParent: Participant;
    participantSon: Participant;
    createdAt: string;
    updatedAt: string;
    __v: number;
    lastMessage?: string;
}

export interface ConversationApiResponse {
    success: boolean;
    conversation: Conversation;
    messages: Message[];
    page: number;
    hasMore: boolean;
}

interface ChatProps {
    selectedChat: { conversation: string } | string;
    user: string; // The owner ID of the current logged-in user
    onClose: () => void;
}

export default function Chat({ selectedChat, user, onClose }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversationId = typeof selectedChat === 'object'
        ? selectedChat?.conversation
        : selectedChat;

    const partnerName = conversation
        ? (conversation.participantParent._id === user
            ? conversation.participantSon.fullName
            : conversation.participantParent.fullName)
        : 'Chat';

    const profileId = conversation
        ? (conversation.participantParent._id === user
            ? conversation.participantParent.owner
            : conversation.participantParent.owner)
        : null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        let ignore = false;

        async function fetchConversation() {
            if (!conversationId) return;

            try {
                const response = await fetch(`${url}/conversations/${conversationId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const data: ConversationApiResponse = await response.json();

                if (!ignore && data.success) {
                    setMessages(data.messages || []);
                    setConversation(data.conversation || null);
                }
            } catch (error) {
                console.error("Failed to fetch conversation:", error);
            }
        }

        // Fetch immediately on initial render
        fetchConversation();

        // Set up polling interval every 10 seconds (10000ms)
        const intervalId = setInterval(() => {
            fetchConversation();
        }, 10000);

        // Cleanup interval on unmount or conversationId change
        return () => {
            ignore = true;
            clearInterval(intervalId);
        };
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col justify-between border-2 border-solid h-140 w-xs bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header displaying Partner Name */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 font-bold text-gray-700">
                <span>{partnerName}</span>
                <button
                    type="button"
                    onClick={() => onClose()}
                    aria-label="Close chat"
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-0.5 rounded-md hover:bg-gray-200/50"
                >
                    <XMarkIcon className="size-5 text-cahir-armor" />
                </button>
            </div>

            {/* Messages Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {Array.isArray(messages) && messages.map((msg) => {
                    const isSender = msg.sender === profileId;
                    return (
                        <div
                            key={msg._id}
                            className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-xs ${isSender
                                    ? 'bg-white text-cahir-blood rounded-br-none border-1 border-cahir-armor'
                                    : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Footer */}
            <form className="flex items-center border-t pr-3 bg-white">
                <input
                    id="message"
                    name="message"
                    type="text"
                    placeholder="Send a message"
                    className="flex-1 bg-white py-3 pl-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none"
                />
                <button
                    type="submit"
                    aria-label="Send message"
                    className="text-cahir-blood hover:opacity-80 transition-opacity cursor-pointer p-1"
                >
                    <PaperAirplaneIcon className="size-7" />
                </button>
            </form>
        </div>
    );
}