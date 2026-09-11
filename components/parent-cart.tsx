'use client';

import Link from 'next/link';
import React from 'react';
import { BriefcaseIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Participant {
  _id: string;
}

interface UnreadConversation {
  participantParent: Participant;
  participantSon: Participant;
}

interface ParentCartProps {
  parentId: string;
  parentFullName: string;
  parentCity: string;
  parentJob: string;
  showChat?: (parentId: string) => void;
  unreadConversations?: UnreadConversation[];
}

export default function ParentCart({
  parentId,
  parentFullName,
  parentCity,
  parentJob,
  showChat,
  unreadConversations
}: ParentCartProps) {
  const isUnreadConversation = unreadConversations?.some(
    (u) => u.participantSon._id === parentId || u.participantParent._id === parentId
  );

  return (
    <Link
      href={`/parents/${parentId}`}
      aria-current="false"
    >
      <div className="border-3 text-lg m-2">
        <h2 className="mt-2 ml-2 font-bold">
          {parentFullName}
        </h2>
        <h3 className="ml-2 border-b border-gray-900/10">{parentCity}</h3>
        <h3 className="flex items-center ml-1">
          <BriefcaseIcon className="size-8" />
          {parentJob}
        </h3>
        {showChat && (
          <div
            className={`flex items-center justify-between border-t border-gray-900/10 font-bold py-3 px-1 cursor-pointer ${
              isUnreadConversation ? 'text-cahir-blood' : 'px-4'
            }`}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              console.log('clicked');
              e.preventDefault();  // Prevents Next.js Link navigation
              e.stopPropagation(); // Stops the event from reaching the parent Link element
              showChat(parentId);
            }}
          >
            <ChatBubbleLeftRightIcon className="size-5" />
            <h4>Otwórz czat</h4>
            {isUnreadConversation && (
              <div className="border-2 px-1 rounded-lg">
                1
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}