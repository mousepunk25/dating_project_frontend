'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { BriefcaseIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface Participant {
  _id: string;
}

interface UnreadConversation {
  participantParent: Participant;
  participantSon: Participant;
}

interface CandidateCartProps {
  candidateId: string;
  candidateImage: string;
  candidateFullName: string;
  candidateAge: string;
  candidateCity: string;
  candidateJob: string;
  showChat?: (candidateId: string) => void;
  unreadConversations?: UnreadConversation[];
}

function calculateAge(birthDateString: string): number {
  if (!birthDateString) return 0;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function CandidateCart({
  candidateId,
  candidateImage,
  candidateFullName,
  candidateAge,
  candidateCity,
  candidateJob,
  showChat,
  unreadConversations
}: CandidateCartProps) {
  // Calculate exact age from ISO string
  const age = calculateAge(candidateAge);
  
  const isUnreadConversation = unreadConversations?.some(
    (u) => u.participantParent._id === candidateId || u.participantSon._id === candidateId
  );

  return (
    <Link
      href={`/sons/${candidateId}`}
      aria-current="false"
    >
      <div className="border-3 text-lg">
        <Image
          src={candidateImage}
          width={500}
          height={500}
          alt="Picture of the candidate"
        />
        <h2 className="mt-2 ml-2 font-bold">
          {candidateFullName}
          <span className="font-normal">, age: <span className="font-bold">{age}</span></span>
        </h2>
        <h3 className="ml-2 border-b border-gray-900/10">{candidateCity}</h3>
        <h3 className="flex items-center ml-1">
          <BriefcaseIcon className="size-8" />
          {candidateJob}
        </h3>
        {showChat && (
          <div
            className={`flex items-center justify-between border-t border-gray-900/10 font-bold py-3 px-1 cursor-pointer ${
              isUnreadConversation ? 'text-cahir-blood' : 'px-4'
            }`}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.preventDefault();  // Prevents Next.js Link navigation
              e.stopPropagation(); // Stops event from bubbling to parent Link
              showChat(candidateId);
            }}
          >
            <ChatBubbleLeftRightIcon className="size-5" />
            <h4>Open chat</h4>
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