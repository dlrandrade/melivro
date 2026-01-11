import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, NotablePerson, Citation } from '../types';
import MetaTags from '../components/MetaTags';

const AFFILIATE_TAG = 'livrme-20';

interface BookPageProps {
  allBooks: Book[];
  allCitations: Citation[];
  allPeople: NotablePerson[];
}

const BookPage: React.FC<BookPageProps> = ({ allBooks, allCitations, allPeople }) => {
  const { slug } = useParams<{ slug: string }>();

  const book = useMemo(() =>
    allBooks.find(b => b.slug === slug), [allBooks, slug]
  );

  const citationsWithPeople = useMemo(() => {
    if (!book) return [];
    return allCitations
      .filter(c => c.bookId === book.id)
      .map(c => ({
        ...c,
        person: allPeople.find(p => p.id === c.personId)
      }));
  }, [book, allCitations, allPeople]);

  const amazonUrl = useMemo(() => {
    if (!book) return '';
    const id = book.isbn13 || book.title;
    return `https://www.amazon.com.br/s?k=${encodeURIComponent(id)}&tag=${AFFILIATE_TAG}`;
  }, [book]);

  if (!book) return (
    <>
      <MetaTags title="Livro não encontrado | meLivro.me" description="O livro que você está procurando não foi encontrado." />
      <div className="p-20 text-center font-bold">Livro não encontrado.</div>
    </>
  );

  const truncatedSynopsis = book.synopsis.length > 155 ? book.synopsis.substring(0, 155) + '...' : book.synopsis;

  return (
    <>
      <MetaTags
        title={`${book.title} por ${book.authors} | meLivro.me`}
        description={`Veja quem recomendou "${book.title}". Sinopse: ${truncatedSynopsis}`}
        imageUrl={book.coverUrl}
        type="book"
      />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
          {/* Sidebar: Capa e Ações */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-28">
              <div className="w-full aspect-[2/3] bg-white p-4 rounded-sm shadow-sm border border-[var(--border-color)] overflow-hidden mb-8">
                <img src={book.coverUrl} alt={book.title} className="w-full h-full object-contain" />
              </div>
              <a href={amazonUrl} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3 bg-black text-white rounded-md font-bold text-sm hover:bg-gray-800 transition-all">
                Comprar na Amazon
              </a>
            </div>
          </div>

          {/* Conteúdo Principal em um card */}
          <div className="flex-1 bg-white p-8 md:p-12 rounded-lg border border-[var(--border-color)]">
            <div className="max-w-3xl">
              <div className="mb-12">
                <h1 className="font-serif text-4xl md:text-6xl font-bold text-gray-900 mb-2 leading-tight tracking-tighter">{book.title}</h1>
                <p className="text-xl font-medium text-gray-500 mb-8">por {book.authors}</p>

                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  <p>{book.synopsis}</p>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-[var(--border-color)]">
                <h2 className="font-serif text-3xl font-bold mb-10 text-gray-900 tracking-tighter">Recomendado por</h2>
                <div className="space-y-12">
                  {citationsWithPeople.length > 0 ? citationsWithPeople.map(cit => cit.person && (
                    <div key={cit.id} className="flex gap-6">
                      <Link to={`/p/${cit.person.slug}`} className="flex-shrink-0">
                        <img src={cit.person.imageUrl} alt={cit.person.name} className="w-14 h-14 rounded-full border-2 border-gray-200 object-cover" />
                      </Link>
                      <div className="flex-1">
                        <p className="text-lg text-gray-700 leading-relaxed mb-3">
                          "{cit.quoteExcerpt}"
                        </p>
                        <p className="font-semibold text-gray-800">
                          — <Link to={`/p/${cit.person.slug}`} className="hover:text-black">{cit.person.name}</Link>,{' '}
                          <a href={cit.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">{cit.sourceTitle} ({cit.citedYear})</a>
                        </p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500">Ainda não temos citações públicas indexadas para este livro.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookPage;