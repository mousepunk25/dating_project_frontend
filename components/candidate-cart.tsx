'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { BriefcaseIcon, ChatBubbleLeftRightIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  parentProfileId?: string;
  showChat?: (candidateId: string) => void;
  onDeleteSuccess?: (candidateId: string) => void;
  unreadConversations?: UnreadConversation[];
  addedStatus?: 'friend' | 'request-received' | 'saved' | 'request-sent';
}

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
  ? process.env.NEXT_PUBLIC_DEV_API_URL 
  : process.env.NEXT_PUBLIC_PROD_API_URL;

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
  parentProfileId,
  showChat,
  onDeleteSuccess,
  unreadConversations,
  addedStatus
}: CandidateCartProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const age = calculateAge(candidateAge);

  const isUnreadConversation = unreadConversations?.some(
    (u) => u.participantParent._id === candidateId || u.participantSon._id === candidateId
  );

  const getDeleteEndpoint = () => {
    if (!parentProfileId) return null;

    switch (addedStatus) {
      case 'friend':
        return `${url}/parents/${parentProfileId}/sonsfriends/${candidateId}`;
      case 'request-received':
        return `${url}/parents/${parentProfileId}/sonswhowanttobeadded/${candidateId}`;
      case 'request-sent':
        return `${url}/parents/${parentProfileId}/sonswithrequestsent/${candidateId}`;
      case 'saved':
        return `${url}/parents/${parentProfileId}/sonssaved/${candidateId}`;
      default:
        return null;
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Stop event propagation before Next.js Link captures it
    e.preventDefault();
    e.stopPropagation();

    const endpoint = getDeleteEndpoint();
    if (!endpoint || isDeleting) {
      console.warn('Missing endpoint or delete in progress:', { endpoint, parentProfileId });
      return;
    }
    if (!confirm('Czy na pewno chcesz usunąć tę pozycję?')) return;

    try {
      setIsDeleting(true);
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.ok) {
        if (onDeleteSuccess) {
          onDeleteSuccess(candidateId);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Delete request failed:', response.status, errorData);
      }
    } catch (err) {
      console.error('Network error during delete:', err);
    } finally {
      setIsDeleting(false);
      window.location.reload();
    }
  };

  return (
    // Outer relative container isolates absolute action elements from Link routing
    <div className="relative border-3 text-lg group">
      
      {/* Absolute action button isolated outside Next.js Link tag */}
      {addedStatus && (
        <button
          type="button"
          disabled={isDeleting}
          onClick={handleDelete}
          className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-600 hover:text-white text-gray-700 rounded-full transition-colors shadow-md z-30 cursor-pointer pointer-events-auto disabled:opacity-50"
          title="Usuń"
        >
          <TrashIcon className="size-5 pointer-events-none" />
        </button>
      )}

      {/* Main card link wrapping card body */}
      <Link href={`/sons/${candidateId}`} className="block">
        <Image
          src={candidateImage}
          width={500}
          height={500}
          alt="Zdjęcie kandydata"
        />
        
        <h2 className="mt-2 ml-2 font-bold">
          {candidateFullName}
          <span className="font-normal">, wiek: <span className="font-bold">{age}</span></span>
        </h2>
        
        <h3 className="ml-2 border-b border-gray-900/10">{candidateCity}</h3>
        
        <h3 className="flex items-center ml-1">
          <BriefcaseIcon className="size-8" />
          {candidateJob}
        </h3>
      </Link>

      {/* Bottom Chat bar outside Link tag */}
      {showChat && (
        <div
          className={`flex items-center justify-between border-t border-gray-900/10 font-bold py-3 px-1 cursor-pointer ${
            isUnreadConversation ? 'text-cahir-blood' : 'px-4'
          }`}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            showChat(candidateId);
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
  );
}