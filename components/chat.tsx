'use client'

import { useEffect, useState, useRef, FormEvent } from "react";
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;

function Spinner({ className = "size-5" }: { className?: string }) {
    return (
        <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
    );
}

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
    user: string;
    onClose: () => void;
}

export default function Chat({ selectedChat, user, onClose }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [text, setText] = useState<string>('');
    const [isSending, setIsSending] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true); // 1. Initial load state
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversationId = typeof selectedChat === 'object'
        ? selectedChat?.conversation
        : selectedChat;

    const partnerName = conversation
        ? (conversation.participantParent._id === user
            ? conversation.participantSon.fullName
            : conversation.participantParent.fullName)
        : null;

    const profileId = conversation
        ? (conversation.participantParent._id === user
            ? conversation.participantParent.owner
            : conversation.participantSon.owner)
        : null;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        let ignore = false;

        async function fetchConversation(isInitial = false) {
            if (!conversationId) return;
            if (isInitial) setIsLoading(true);

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
            } finally {
                if (!ignore && isInitial) {
                    setIsLoading(false);
                }
            }
        }

        fetchConversation(true);

        const intervalId = setInterval(() => {
            fetchConversation(false);
        }, 10000);

        return () => {
            ignore = true;
            clearInterval(intervalId);
        };
    }, [conversationId]);

    useEffect(() => {
        if (!isLoading) {
            scrollToBottom();
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const trimmedText = text.trim();
        if (!trimmedText || !conversationId || isSending) return;

        try {
            setIsSending(true);

            const response = await fetch(`${url}/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ text: trimmedText })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessages((prev) => [...prev, data.message]);
                setText('');
            } else {
                console.error("Failed to send message:", data.message);
            }
        } catch (error) {
            console.error("Error submitting message:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col justify-between border-2 border-solid h-140 w-xs bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header displaying Partner Name or Skeleton */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 font-bold text-gray-700">
                {isLoading || !partnerName ? (
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                ) : (
                    <span>{partnerName}</span>
                )}
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
                {isLoading ? (
                    /* 2. Initial Loading State */
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                        <Spinner className="size-6 text-cahir-blood" />
                        <span className="text-xs">Ładowanie wiadomości...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-xs text-gray-400">
                        Brak wiadomości. Napisz pierwszą wiadomość!
                    </div>
                ) : (
                    messages.map((msg) => {
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
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input Footer */}
            <form onSubmit={handleSendMessage} className="flex items-center border-t pr-3 bg-white">
                <input
                    id="message"
                    name="message"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Wyślij wiadomość..."
                    disabled={isSending || isLoading}
                    className="flex-1 bg-white py-3 pl-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={!text.trim() || isSending || isLoading}
                    aria-label="Send message"
                    className="text-cahir-blood hover:opacity-80 transition-opacity cursor-pointer p-1 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    {/* 3. Send Button Loading Spinner */}
                    {isSending ? (
                        <Spinner className="size-6 text-cahir-blood" />
                    ) : (
                        <PaperAirplaneIcon className="size-7" />
                    )}
                </button>
            </form>
        </div>
    );
}