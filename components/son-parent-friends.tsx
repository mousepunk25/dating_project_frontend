'use client';

import { useEffect, useState } from 'react';
import ParentCart from './parent-cart';
import SonsList from './sons-list';

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
  ? process.env.NEXT_PUBLIC_DEV_API_URL 
  : process.env.NEXT_PUBLIC_PROD_API_URL;

interface Candidate {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  image: {
    url: string;
  };
  address: {
    city: string;
  };
  job: { position: string } | string;
}

interface Participant {
  _id: string;
}

interface ChatConversation {
  _id: string;
  participantParent: Participant;
  participantSon: Participant;
  createdAt?: string;
  updatedAt?: string;
  lastMessage?: any;
}

interface SonParentFriendsProps {
  profileId: string;
  role: 'son' | 'parent';
  showChat: (candidateId: string) => void;
  unreadConversations?: ChatConversation[] | any;
}

export default function SonParentFriends({
  profileId,
  role,
  showChat,
  unreadConversations
}: SonParentFriendsProps) {
  const [userFriends, setUserFriends] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  const oppositeRole = role === 'son' ? 'parent' : 'son';

  useEffect(() => {
    let ignore = false;

    async function fetchUserFriends() {
      setIsLoading(true);
      setHasError(false);
      try {
        const userFriendsResponse = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}sfriends`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!userFriendsResponse.ok) {
          throw new Error('Failed to fetch friends');
        }

        const userFriendsJSON = await userFriendsResponse.json();

        if (!ignore && Array.isArray(userFriendsJSON)) {
          setUserFriends(userFriendsJSON);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        if (!ignore) setHasError(true);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    fetchUserFriends();
    return () => {
      ignore = true;
    };
  }, [profileId, role, oppositeRole]);

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cahir-armor border-t-transparent" />
        <p className="text-sm text-gray-500 font-medium">Ładowanie listy znajomych...</p>
      </div>
    );
  }

  // 2. Error State
  if (hasError) {
    return (
      <div className="mt-6 text-center text-red-600 font-medium">
        Nie udało się pobrać listy znajomych. Spróbuj odświeżyć stronę.
      </div>
    );
  }

  // 3. Empty State
  if (userFriends.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-600 font-serif text-lg">
        Wciąż nie masz dodanych znajomych :/ Wyślij komuś zaproszenie i zaczekaj aż zostanie zaakceptowane.
      </div>
    );
  }

  // 4. Data State
  if (role === 'parent') {
    return (
      <SonsList 
        sons={userFriends} 
        showChat={showChat} 
        unreadConversations={unreadConversations}
        addedStatus='friend'
        parentProfileId={profileId}
      />
    );
  }

  return (
    <div>
      {userFriends.map((parent) => {
        const jobTitle = typeof parent.job === 'string' 
          ? parent.job 
          : parent.job?.position || '';

        return (
          <ParentCart 
            key={parent._id}
            parentId={parent._id}
            parentFullName={parent.fullName}
            parentCity={parent.address?.city || ''}
            parentJob={jobTitle}
            showChat={showChat}
            unreadConversations={unreadConversations}
            addedStatus='friend'
          />
        );
      })}
    </div>
  );
}