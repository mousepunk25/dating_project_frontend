import CandidateCart from './candidate-cart';

export interface SonCandidate {
  _id: string;
  image: {
    url: string;
  };
  fullName: string;
  dateOfBirth: string; // Updated from string | number | Date
  address: {
    city: string;
  };
  job: string | { position: string };
}

interface Participant {
  _id: string;
  owner: string;
  fullName: string;
}

interface LastMessage {
  _id: string;
  sender: string;
  text: string;
  readBy: string[];
  createdAt: string;
}

interface ChatConversation {
  _id: string;
  participantParent: Participant;
  participantSon: Participant;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastMessage?: LastMessage; // Made optional for brand-new conversations
}

interface SonsListProps {
  sons: SonCandidate[];
  showChat?: Function;
  unreadConversations?: ChatConversation
}

export default function SonsList({ sons, showChat, unreadConversations }: SonsListProps){
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-2 my-6'>
      {Array.isArray(sons) && sons.map(candidate => {
        return (
          <CandidateCart 
            key={candidate._id}
            candidateId={candidate._id}
            candidateImage={candidate.image.url}
            candidateFullName={candidate.fullName}
            candidateAge={candidate.dateOfBirth}
            candidateCity={candidate.address.city}
            candidateJob={typeof candidate.job !== 'string' ? candidate.job.position : candidate.job}
            showChat={showChat}
            unreadConversations={unreadConversations}
          />
        );
      })}
    </div>
  );
}