import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_PEOPLE, MOCK_BOOKS, MOCK_CITATIONS } from '../constants';
import BookCard from '../components/BookCard';
import MetaTags from '../components/MetaTags';

const PersonPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const person = useMemo(() => 
    MOCK_PEOPLE.find(p => p.slug === slug), [slug]
  );

  const citations = useMemo(() => {
    if (!person) return [];
    return MOCK_CITATIONS
      .filter(c => c.personId === person.id)
      .map(c => ({
        ...c,
        book: MOCK_BOOKS.find(b => b.id === c.bookId)
      })).filter(c => c.book);
  }, [person]);

  if (!person) return (
    <>
      <MetaTags title="Pessoa não encontrada | livr.me" description="A pessoa que você está procurando não foi encontrada." />
      <div className="p-20 text-center font-bold">Pessoa não encontrada.</div>
    </>
  );

  const truncatedBio = person.bio.length > 155 ? person.bio.substring(0, 155) + '...' : person.bio;

  return (
    <>
      <MetaTags 
        title={`${person.name} | Recomendações de Livros no livr.me`}
        description={`Explore todos os livros recomendados por ${person.name}. ${truncatedBio}`}
        imageUrl={person.imageUrl}
        type="profile"
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <img src={person.imageUrl} alt={person.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
          <h1 className="font-serif text-5xl font-bold text-black tracking-tighter">{person.name}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4">{person.bio}</p>
        </div>

        <div className="flex items-center justify-between mb-8 border-t border-[var(--border-color)] pt-6">
          <h2 className="font-bold text-lg">Livros Recomendados</h2>
          <p className="text-sm text-gray-500">{citations.length} itens</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-16">
          {citations.map(cit => cit.book && (
            <BookCard key={cit.id} book={cit.book} citationSource={`Citado em ${cit.citedYear}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PersonPage;