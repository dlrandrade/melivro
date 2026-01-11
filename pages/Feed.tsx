import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_ACTIVITIES } from '../constants';
import { Activity, BookStatus, ActivityType, Book, NotablePerson, Citation } from '../types';
import MetaTags from '../components/MetaTags';

interface FeedProps {
  allCitations: Citation[];
  allBooks: Book[];
  allPeople: NotablePerson[];
}

const getStatusText = (status: BookStatus) => {
  switch (status) {
    case BookStatus.READ: return 'terminou de ler';
    case BookStatus.READING: return 'começou a ler';
    case BookStatus.WANT_TO_READ: return 'adicionou à sua lista';
    default: return 'marcou';
  }
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  const { user, type, payload, timestamp, likes, comments } = activity;

  const renderContent = () => {
    if (type === ActivityType.GOAL_SET && payload.goal) {
      return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-lg text-center">
          <p className="text-lg">
            <Link to={`/profile/${user.username}`} className="font-bold hover:underline">{user.name}</Link>
            {' '} definiu a meta de ler
          </p>
          <p className="font-serif text-5xl font-bold my-4">{payload.goal.count} livros</p>
          <p className="text-gray-400">em {payload.goal.year}.</p>
        </div>
      );
    }

    if (type === ActivityType.STATUS_UPDATE && payload.book && payload.status) {
      return (
        <div>
          <p className="text-gray-800 leading-relaxed mb-4">
            <Link to={`/profile/${user.username}`} className="font-bold hover:underline">{user.name}</Link>
            {' '}{getStatusText(payload.status)}{' '}
            <Link to={`/b/${payload.book.slug}`} className="font-bold text-black hover:underline">{payload.book.title}</Link>.
          </p>
          <div className="bg-gray-50/50 border border-[var(--border-color)] p-4 rounded-lg flex gap-4">
            <img src={payload.book.coverUrl} alt={payload.book.title} className="w-20 h-auto object-contain flex-shrink-0 rounded" />
            <div>
              <h4 className="font-bold text-black">{payload.book.title}</h4>
              <p className="text-sm text-gray-500 mb-2">{payload.book.authors}</p>
              <p className="text-sm text-gray-600 line-clamp-2">{payload.book.synopsis}</p>
            </div>
          </div>
          {payload.person && (
            <div className="text-xs text-gray-500 mt-3">
              Inspirado por <Link to={`/p/${payload.person.slug}`} className="font-semibold text-gray-700 hover:text-black">{payload.person.name}</Link>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-[var(--border-color)]">
      <div className="flex gap-4">
        <Link to={`/profile/${user.username}`}>
          <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
        </Link>
        <div className="w-full">
          {renderContent()}
          <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                {likes}
              </button>
              <button className="flex items-center gap-2 hover:text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                {comments}
              </button>
            </div>
            <p className="text-xs font-semibold">{timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


const Feed: React.FC<FeedProps> = ({ allCitations, allBooks, allPeople }) => {
  const combinedActivities = useMemo(() => {
    // Convert real citations into activity-like objects
    const citationActivities: Activity[] = allCitations.map(cit => {
      const book = allBooks.find(b => b.id === cit.bookId);
      const person = allPeople.find(p => p.id === cit.personId);

      return {
        id: cit.id,
        user: {
          id: person?.id || 'system',
          name: person?.name || 'Curador',
          username: person?.slug || 'curador',
          avatarUrl: person?.imageUrl || 'https://i.pravatar.cc/48'
        },
        type: ActivityType.STATUS_UPDATE,
        timestamp: `${cit.citedYear}`,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 20),
        payload: {
          book,
          status: BookStatus.READ,
          person: person // In this case, the person IS the one who read it
        }
      };
    });

    return [...citationActivities, ...MOCK_ACTIVITIES].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [allCitations, allBooks, allPeople]);

  return (
    <>
      <MetaTags
        title="Feed da Comunidade | meLivro.me"
        description="Veja o que os outros estão lendo e definindo como meta na comunidade meLivro.me."
      />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-black tracking-tighter">Feed da Comunidade</h1>
          <p className="text-lg text-gray-500 mt-2">Veja o que os outros estão lendo e as recomendações dos curadores.</p>
        </div>
        <div className="space-y-8">
          {combinedActivities.map(act => <ActivityCard key={act.id} activity={act} />)}
        </div>
      </div>
    </>
  );
};

export default Feed;