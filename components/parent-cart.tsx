'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import {
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  TrashIcon,
  UserPlusIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

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

interface ParentCartProps {
  parentId: string;
  parentFullName: string;
  parentCity: string;
  parentJob: string;
  sonProfileId?: string; // ID of the currently logged-in son performing the actions
  showChat?: (parentId: string) => void;
  onAcceptSuccess?: (parentId: string) => void;
  onDeleteSuccess?: (parentId: string) => void;
  unreadConversations?: UnreadConversation[];
  addedStatus?: 'friend' | 'request-received' | 'saved' | 'request-sent';
}

const url =
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev'
    ? process.env.NEXT_PUBLIC_DEV_API_URL
    : process.env.NEXT_PUBLIC_PROD_API_URL;

export default function ParentCart({
  parentId,
  parentFullName,
  parentCity,
  parentJob,
  sonProfileId,
  showChat,
  onAcceptSuccess,
  onDeleteSuccess,
  unreadConversations,
  addedStatus,
}: ParentCartProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isUnreadConversation = unreadConversations?.some(
    (u) => u.participantSon._id === parentId || u.participantParent._id === parentId
  );

  const getDeleteEndpoint = () => {
    if (!sonProfileId) return null;

    switch (addedStatus) {
      case 'friend':
        return `${url}/sons/${sonProfileId}/parentsfriends/${parentId}`;
      case 'request-received':
        return `${url}/sons/${sonProfileId}/parentswhowanttobeadded/${parentId}`;
      case 'request-sent':
        return `${url}/sons/${sonProfileId}/parentswithrequestsent/${parentId}`;
      case 'saved':
        return `${url}/sons/${sonProfileId}/parentssaved/${parentId}`;
      default:
        return null;
    }
  };

  const handleAcceptRequest = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!sonProfileId || isAccepting || isAccepted) return;

    setErrorMessage(null);
    const acceptEndpoint = `${url}/sons/${sonProfileId}/parentswhowanttobeadded/${parentId}`;

    try {
      setIsAccepting(true);
      const response = await fetch(acceptEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setIsAccepted(true);
        if (onAcceptSuccess) {
          onAcceptSuccess(parentId);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Wystąpił błąd podczas akceptowania zaproszenia.');
      }
    } catch (err) {
      console.error('Network error during accept:', err);
      setErrorMessage('Błąd połączenia z serwerem. Spróbuj ponownie.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const endpoint = getDeleteEndpoint();
    if (!endpoint || isDeleting) {
      console.warn('Missing endpoint or delete in progress:', { endpoint, sonProfileId });
      return;
    }

    if (!confirm('Czy na pewno chcesz usunąć tę pozycję z listy?')) return;

    setErrorMessage(null);

    try {
      setIsDeleting(true);
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        if (onDeleteSuccess) {
          onDeleteSuccess(parentId);
        } else {
          // Refresh page if no custom callback is supplied
          window.location.reload();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || 'Wystąpił błąd podczas usuwania.');
      }
    } catch (err) {
      console.error('Network error during delete:', err);
      setErrorMessage('Błąd połączenia z serwerem. Spróbuj ponownie.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
      {/* Absolute Delete Button */}
      {addedStatus && (
        <button
          type="button"
          disabled={isDeleting || isAccepting}
          onClick={handleDelete}
          className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-red-600 hover:text-white text-gray-700 rounded-full transition-colors duration-200 shadow z-30 cursor-pointer pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          title={isDeleting ? 'Trwa usuwanie...' : 'Usuń'}
        >
          {isDeleting ? (
            <SpinnerIcon className="size-5" />
          ) : (
            <TrashIcon className="size-5 pointer-events-none" />
          )}
        </button>
      )}

      {/* Main card link wrapping card body */}
      <Link href={`/parents/${parentId}`} className="block relative p-5">
        {isDeleting && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 rounded-2xl">
            <SpinnerIcon className="size-10 text-red-600" />
            <span className="text-sm font-semibold text-gray-700">Trwa usuwanie...</span>
          </div>
        )}

        <div className="pr-10">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950">
            {parentFullName}
          </h2>

          <h3 className="text-lg text-gray-600 pb-2 border-b border-gray-100">{parentCity}</h3>

          <h3 className="flex items-center gap-3 pt-2 text-lg text-gray-700">
            <BriefcaseIcon className="size-7 text-gray-400 shrink-0" />
            <span>{parentJob || 'Brak informacji o pracy'}</span>
          </h3>
        </div>
      </Link>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 bg-red-50 border-t border-red-200 text-red-700 p-3 text-sm font-medium">
          <ExclamationTriangleIcon className="size-5 text-red-500 shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setErrorMessage(null);
            }}
            className="text-red-500 hover:text-red-800 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Accept Invitation Bar */}
      {addedStatus === 'request-received' && (
        <div
          className={`flex items-center justify-between border-t border-gray-100 font-bold py-4 px-5 transition-colors duration-200 ${isAccepted
              ? 'bg-green-50 text-green-700 cursor-default'
              : 'cursor-pointer hover:bg-gray-50/50 text-gray-800'
            }`}
          onClick={handleAcceptRequest}
        >
          <div className="flex items-center gap-3">
            {isAccepting ? (
              <SpinnerIcon className="size-6 text-blue-600" />
            ) : isAccepted ? (
              <CheckIcon className="size-6 text-green-600" />
            ) : (
              <UserPlusIcon className="size-6 text-gray-400" />
            )}

            <h4 className={`text-lg ${isAccepted ? 'text-green-700' : 'text-blue-700'}`}>
              {isAccepting
                ? 'Akceptowanie...'
                : isAccepted
                  ? 'Zaproszenie zaakceptowane'
                  : 'Zaakceptuj zaproszenie'}
            </h4>
          </div>
        </div>
      )}

      {/* Bottom Chat bar */}
      {showChat && (
        <div
          className={`flex items-center justify-between border-t border-gray-100 font-bold py-4 px-5 cursor-pointer transition-colors duration-200 hover:bg-gray-50/50 ${isUnreadConversation ? 'text-red-700' : 'text-gray-800'
            }`}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            showChat(parentId);
          }}
        >
          <div className="flex items-center gap-3">
            <ChatBubbleLeftRightIcon
              className={`size-6 ${isUnreadConversation ? 'text-red-600' : 'text-gray-400'}`}
            />
            <h4 className="text-lg text-green-700">Otwórz czat</h4>
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