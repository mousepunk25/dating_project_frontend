'use client';

import { useEffect, useState } from 'react';
import ParentCart from './parent-cart';
import SonsList from './sons-list';

const url = process.env.NEXT_PUBLIC_ENVIRONMENT === 'dev' 
  ? process.env.NEXT_PUBLIC_DEV_API_URL 
  : process.env.NEXT_PUBLIC_PROD_API_URL;

// Match SonCandidate strictly by requiring job, address, and image
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
  const oppositeRole = role === 'son' ? 'parent' : 'son';

  useEffect(() => {
    let ignore = false;
    async function fetchUserFriends() {
      try {
        const userFriendsResponse = await fetch(`${url}/${role}s/${profileId}/${oppositeRole}sfriends`, {
          method: 'GET',
          credentials: 'include'
        });
        const userFriendsJSON = await userFriendsResponse.json();
        if (!ignore && Array.isArray(userFriendsJSON)) {
          setUserFriends(userFriendsJSON);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    }
    fetchUserFriends();
    return () => {
      ignore = true;
    };
  }, [profileId, role, oppositeRole]);

  // Handle empty state
  if (Array.isArray(userFriends) && userFriends.length === 0) {
    return (
      <div className="mt-6 text-center text-gray-600 font-serif text-lg">
        Wciąż nie masz dodanych znajomych :/ Wyślij do kogoś zaproszenie i zaczekaj aż zostanie zaakceptowane.
      </div>
    );
  }

  if (userFriends && role === 'parent') {
    return (
      <SonsList 
        sons={userFriends} 
        showChat={showChat} 
        unreadConversations={unreadConversations}
      />
    );
  } else if (userFriends && role === 'son') {
    return (
      <div>
        {Array.isArray(userFriends) && userFriends.map((parent) => {
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
            />
          );
        })}
      </div>
    );
  }
}