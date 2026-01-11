import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import MetaTags from '../components/MetaTags';
import { Book, NotablePerson, Citation } from '../types';

interface PersonPageProps {
  allPeople: NotablePerson[];
  allBooks: Book[];
  allCitations: Citation[];
}

const PersonPage: React.FC<PersonPageProps> = ({ allPeople, allBooks, allCitations }) => {
  const { slug } = useParams<{ slug: string }>();

  const person = useMemo(() =>
    allPeople.find(p => p.slug === slug), [allPeople, slug]
  );

  const citationsWithBooks = useMemo(() => {
    if (!person) return [];
    return allCitations
      .filter(c => c.personId === person.id)
      .map(c => ({
        ...c,
        book: allBooks.find(b => b.id === c.bookId)
      })).filter(c => c.book);
  }, [person, allCitations, allBooks]);

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
          <img src={person.imageUrl} alt={person.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover" />
          <h1 className="font-serif text-5xl font-bold text-black tracking-tighter">{person.name}</h1>
          <p className="text-gray-500 max-w-2xl mx-auto mt-4">{person.bio}</p>
        </div>

        <div className="flex items-center justify-between mb-8 border-t border-[var(--border-color)] pt-6">
          <h2 className="font-bold text-lg">Livros Recomendados</h2>
          <p className="text-sm text-gray-500">{citationsWithBooks.length} itens</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-16">
          {citationsWithBooks.map(cit => cit.book && (
            <BookCard key={cit.id} book={cit.book} citationSource={`Citado em ${cit.citedYear}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PersonPage;