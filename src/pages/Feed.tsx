import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { MOCK_ACTIVITIES } from '../constants';
import { Activity, BookStatus, ActivityType, Book, NotablePerson, Citation } from '../types';
import MetaTags from '../components/MetaTags';

interface FeedProps {
  allCitations: Citation[];
  allBooks: Book[];
  allPeople: NotablePerson[];
  databaseActivities: Activity[];
  onRefreshFeed: () => void;
  user: any;
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

    if (type === ActivityType.TEXT_POST && payload.text) {
      return (
        <div className="py-2">
          <p className="text-gray-900 text-lg leading-relaxed whitespace-pre-wrap">
            {payload.text}
          </p>
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

    if (type === ActivityType.BATCH_RECOMMENDATION && payload.books && payload.count) {
      return (
        <div>
          <p className="text-gray-800 leading-relaxed mb-4">
            <Link to={`/p/${user.username}`} className="font-bold hover:underline">{user.name}</Link>
            {' '}adicionou {payload.count} novos livros à sua lista de recomendações.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {payload.books.slice(0, 3).map(book => (
              <Link key={book.id} to={`/b/${book.slug}`} className="block group">
                <div className="aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden border border-[var(--border-color)]">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
              </Link>
            ))}
            {payload.count > 3 && (
              <div className="flex items-center justify-center bg-gray-100 rounded-lg border border-[var(--border-color)] text-gray-500 font-bold text-lg">
                +{payload.count - 3}
              </div>
            )}
          </div>
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
            <p className="text-xs font-semibold">
              {timestamp.includes('-') && timestamp.includes(':')
                ? new Date(timestamp).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : timestamp}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


const Feed: React.FC<FeedProps> = ({ allCitations, allBooks, allPeople, databaseActivities, onRefreshFeed, user }) => {
  const [postText, setPostText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('activities')
        .insert([{
          user_id: user.id,
          activity_type: 'text_post',
          payload: { text: postText.trim() }
        }]);

      if (error) throw error;
      setPostText('');
      onRefreshFeed();
    } catch (err) {
      console.error('Error posting:', err);
      alert('Erro ao postar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };



  const combinedActivities = useMemo(() => {
    // Group citations by personId
    const citationsByPerson: Record<string, Citation[]> = {};
    allCitations.forEach(cit => {
      // Clean up citations with no valid book
      if (!allBooks.find(b => b.id === cit.bookId)) return;
      if (!citationsByPerson[cit.personId]) citationsByPerson[cit.personId] = [];
      citationsByPerson[cit.personId].push(cit);
    });

    const citationActivities: Activity[] = [];

    Object.entries(citationsByPerson).forEach(([personId, citations]) => {
      const person = allPeople.find(p => p.id === personId);
      if (!person) return;

      if (citations.length > 1) {
        // Create a batch activity
        // Sort specifically by year to get the "latest" year for timestamp
        citations.sort((a, b) => b.citedYear - a.citedYear);
        const books = citations.map(c => allBooks.find(b => b.id === c.bookId)!).filter(Boolean);

        citationActivities.push({
          id: `batch-${personId}-${citations[0].citedYear}`,
          user: {
            id: person.id,
            name: person.name,
            username: person.slug,
            avatarUrl: person.imageUrl
          },
          type: ActivityType.BATCH_RECOMMENDATION,
          timestamp: `${citations[0].citedYear}`, // Using the latest year
          likes: Math.floor(Math.random() * 200),
          comments: Math.floor(Math.random() * 50),
          payload: {
            books: books,
            count: books.length,
            person: person
          }
        });
      } else {
        // Single activity status update
        const cit = citations[0];
        const book = allBooks.find(b => b.id === cit.bookId);
        if (book) {
          citationActivities.push({
            id: cit.id,
            user: {
              id: person.id,
              name: person.name,
              username: person.slug,
              avatarUrl: person.imageUrl
            },
            type: ActivityType.STATUS_UPDATE,
            timestamp: `${cit.citedYear}`,
            likes: Math.floor(Math.random() * 50),
            comments: Math.floor(Math.random() * 10),
            payload: {
              book,
              status: BookStatus.READ,
              person: person
            }
          });
        }
      }
    });

    return [...citationActivities, ...databaseActivities, ...MOCK_ACTIVITIES].sort((a, b) => {
      // Comparison logic for timestamps (handling both strings like "2 horas atrás" and ISO dates)
      // For simplicity, we'll try to parse dates or put strings at the end
      // Treat year strings "2024" as dates
      const getDate = (ts: string) => {
        if (/^\d{4}$/.test(ts)) return new Date(parseInt(ts), 0, 1).getTime();
        return new Date(ts).getTime() || 0;
      };

      const dateA = getDate(a.timestamp);
      const dateB = getDate(b.timestamp);
      return dateB - dateA;
    });
  }, [allCitations, allBooks, allPeople, databaseActivities]);

  return (
    <>
      <MetaTags
        title="Feed da Comunidade | MeLivro"
        description="Veja o que os outros estão lendo e definindo como meta na comunidade MeLivro."
      />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-black tracking-tighter">Feed da Comunidade</h1>
          <p className="text-lg text-gray-500 mt-2">Veja o que os outros estão lendo e as recomendações dos curadores.</p>
        </div>

        {/* Post Input */}
        {user && (
          <div className="mb-12 bg-white p-6 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <form onSubmit={handleSubmitPost}>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="O que você está lendo... Compartilhe sua leitura atual!"
                className="w-full border-none focus:ring-0 text-lg resize-none mb-4 min-h-[100px]"
                maxLength={500}
              />
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-xs text-gray-400">{postText.length}/500</span>
                <button
                  type="submit"
                  disabled={isSubmitting || !postText.trim()}
                  className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? 'Postando...' : 'Postar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-8">
          {combinedActivities.map(act => <ActivityCard key={act.id} activity={act} />)}
        </div>
      </div>
    </>
  );
};

export default Feed;