'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { BriefcaseIcon, ChatBubbleLeftRightIcon, TrashIcon } from '@heroicons/react/24/outline';

// Define a simple Spinner component locally or import it.
function SpinnerIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

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
    // Polish translation for confirm
    if (!confirm('Czy na pewno chcesz usunąć tę pozycję z listy?')) return;

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
      // NOTE: Standard practice is to NOT reload the entire page after deletion.
      // Optimistically remove the card using onDeleteSuccess and use React state updates.
      // But keeping this as requested by your original logic.
      setIsDeleting(false);
      window.location.reload();
    }
  };

  return (
    // Outer relative container isolates absolute action elements from Link routing
    // Desktop optimization: Added border, rounded corners, shadow, and transition
    <div className="relative group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden">

      {/* Absolute action button isolated outside Next.js Link tag */}
      {addedStatus && (
        <button
          type="button"
          disabled={isDeleting}
          onClick={handleDelete}
          // Added disabled styling, transition, and pointer interaction feedback
          className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-red-600 hover:text-white text-gray-700 rounded-full transition-colors duration-200 shadow z-30 cursor-pointer pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          title={isDeleting ? 'Trwa usuwanie...' : 'Usuń'}
        >
          {isDeleting ? (
            // 1. ADDED LOADING SPIN ICON (Targeted Feedback)
            <SpinnerIcon className="size-5" />
          ) : (
            <TrashIcon className="size-5 pointer-events-none" />
          )}
        </button>
      )}

      {/* Main card link wrapping card body */}
      <Link href={`/sons/${candidateId}`} className="block relative">
        {/* 
          2. ADDED LOADING OVERLAY ON ENTIRE CARD (Contextual Feedback)
          While isDeleting is true, this overlay blurs the card image/body 
          and prevents clicks on the main body.
        */}
        {isDeleting && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 rounded-2xl">
            <SpinnerIcon className="size-10 text-red-600" />
            <span className="text-sm font-semibold text-gray-700">Trwa usuwanie...</span>
          </div>
        )}

        {/* Updated photo container with rounded top corners */}
        <div className="relative w-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <Image
            src={candidateImage}
            width={500}
            height={500}
            alt={`Zdjęcie kandydata - ${candidateFullName}`}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Card Text Content with padding and modern spacing */}
        <div className="p-2 sm:p-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            {candidateFullName}
            <span className="font-normal text-gray-700">, {age} lat</span>
          </h2>

          <h3 className="text-lg text-gray-600 pb-2 border-b border-gray-100">{candidateCity}</h3>

          <h3 className="flex items-center gap-3 pt-2 text-lg text-gray-700">
            <BriefcaseIcon className="size-7 text-gray-400" />
            <span>{candidateJob || 'Brak informacji o pracy'}</span>
          </h3>
        </div>
      </Link>

      {/* Bottom Chat bar outside Link tag with modern border and padding */}
      {showChat && (
        <div
          className={`flex items-center justify-between border-t border-gray-100 font-bold py-4 px-5 cursor-pointer transition-colors duration-200 hover:bg-gray-50/50 ${isUnreadConversation ? 'text-red-700' : 'text-gray-800'
            }`}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            showChat(candidateId);
          }}
        >
          <div className="flex items-center gap-3">
            <ChatBubbleLeftRightIcon className={`size-6 ${isUnreadConversation ? 'text-red-600' : 'text-gray-400'}`} />
            <h4 className="text-lg">Otwórz czat</h4>
          </div>
          {isUnreadConversation && (
            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              NOWE
            </div>
          )}
        </div>
      )}
    </div>
  );
}