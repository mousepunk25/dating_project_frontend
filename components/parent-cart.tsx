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
  addedStatus?: 'friend' | 'request-received' | 'saved' | 'request-sent';
}

export default function ParentCart({
  parentId,
  parentFullName,
  parentCity,
  parentJob,
  showChat,
  unreadConversations,
  addedStatus,
}: ParentCartProps) {
  const isUnreadConversation = unreadConversations?.some(
    (u) => u.participantSon._id === parentId || u.participantParent._id === parentId
  );

  return (
    <div className="relative border-2 rounded-lg text-lg m-2 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Badge for added status */}
      {addedStatus && (
        <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700 capitalize">
          {addedStatus.replace('-', ' ')}
        </span>
      )}

      {/* Main card navigation container */}
      <Link href={`/parents/${parentId}`} className="block p-4">
        <h2 className="font-bold text-gray-900">{parentFullName}</h2>
        <h3 className="text-gray-600 border-b border-gray-900/10 pb-2 mb-2">
          {parentCity}
        </h3>
        <h3 className="flex items-center text-gray-700 gap-2">
          <BriefcaseIcon className="size-6 text-gray-500 shrink-0" />
          <span>{parentJob}</span>
        </h3>
      </Link>

      {/* Chat Action Button */}
      {showChat && (
        <button
          type="button"
          className={`w-full flex items-center justify-between border-t border-gray-900/10 font-bold py-3 px-4 transition-colors hover:bg-gray-50 rounded-b-lg ${
            isUnreadConversation ? 'text-cahir-blood' : 'text-gray-700'
          }`}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();
            showChat(parentId);
          }}
        >
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="size-5" />
            <span>Otwórz czat</span>
          </div>
          {isUnreadConversation && (
            <span className="border-2 border-current px-2 py-0.5 text-xs rounded-lg font-bold">
              1
            </span>
          )}
        </button>
      )}
    </div>
  );
}