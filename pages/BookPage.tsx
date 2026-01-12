import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Book, NotablePerson, Citation } from '../types';
import { AFFILIATE_TAG } from '../constants';
import { getAmazonSearchUrl, appendAffiliateTag } from '../src/utils/amazonUtils';
import MetaTags from '../components/MetaTags';
import BookCard from '../components/BookCard';

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

  // Get the first person who cited this book (for "Other books by this curator")
  const primaryCurator = useMemo(() => {
    if (citationsWithPeople.length === 0) return null;
    return citationsWithPeople[0].person;
  }, [citationsWithPeople]);

  // Get other books recommended by the same curator
  const otherBooksByCurator = useMemo(() => {
    if (!primaryCurator || !book) return [];
    const curatorBookIds = allCitations
      .filter(c => c.personId === primaryCurator.id && c.bookId !== book.id)
      .map(c => c.bookId);

    return allBooks
      .filter(b => curatorBookIds.includes(b.id))
      .slice(0, 4);
  }, [primaryCurator, book, allCitations, allBooks]);

  // Get related books (same category or similar)
  const relatedBooks = useMemo(() => {
    if (!book) return [];

    // Get books from the same categories
    const bookCategories = book.categories || [];

    // Find books that share categories or have similar authors
    const related = allBooks
      .filter(b => b.id !== book.id)
      .map(b => {
        let score = 0;
        // Check category overlap
        const bCategories = b.categories || [];
        const sharedCategories = bookCategories.filter(cat => bCategories.includes(cat));
        score += sharedCategories.length * 2;

        // Check if same author
        if (b.authors === book.authors) score += 3;

        return { book: b, score };
      })
      .filter(item => item.score > 0 || Math.random() > 0.7) // Include some random books if no matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.book);

    // If no related books found, just return random popular books
    if (related.length === 0) {
      return allBooks
        .filter(b => b.id !== book.id)
        .slice(0, 4);
    }

    return related;
  }, [book, allBooks]);

  const amazonUrl = useMemo(() => {
    if (!book) return '';
    const id = book.isbn13 || book.title;
    return getAmazonSearchUrl(id);
  }, [book]);

  if (!book) return (
    <>
      <MetaTags title="Livro não encontrado | MeLivro" description="O livro que você está procurando não foi encontrado." />
      <div className="p-20 text-center font-bold">Livro não encontrado.</div>
    </>
  );

  const truncatedSynopsis = book.synopsis && book.synopsis.length > 155 ? book.synopsis.substring(0, 155) + '...' : book.synopsis || '';

  return (
    <>
      <MetaTags
        title={`${book.title} por ${book.authors} | MeLivro`}
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
                {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="w-full h-full object-contain" />}
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
                          <a href={appendAffiliateTag(cit.sourceUrl)} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:underline">{cit.sourceTitle} ({cit.citedYear})</a>
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

        {/* Seção: Outros livros deste curador */}
        {primaryCurator && otherBooksByCurator.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8 border-t border-[var(--border-color)] pt-12">
              <h2 className="font-serif text-2xl font-bold tracking-tighter">
                Outros livros indicados por {primaryCurator.name}
              </h2>
              <Link to={`/p/${primaryCurator.slug}`} className="text-sm font-semibold hover:text-black">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
              {otherBooksByCurator.map(b => (
                <BookCard key={b.id} book={b} citationSource={`Citado por ${primaryCurator.name}`} />
              ))}
            </div>
          </section>
        )}

        {/* Seção: Livros relacionados */}
        {relatedBooks.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center justify-between mb-8 border-t border-[var(--border-color)] pt-12">
              <h2 className="font-serif text-2xl font-bold tracking-tighter">
                Livros relacionados
              </h2>
              <Link to="/livros" className="text-sm font-semibold hover:text-black">
                Ver todos →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
              {relatedBooks.map(b => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default BookPage;