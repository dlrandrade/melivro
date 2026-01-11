
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MOCK_BOOKS, MOCK_PEOPLE } from '../constants';
import BookCard from '../components/BookCard';
import PersonCard from '../components/PersonCard';

const Search: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const q = queryParams.get('q')?.toLowerCase() || '';

  const filteredBooks = useMemo(() => 
    MOCK_BOOKS.filter(b => b.title.toLowerCase().includes(q) || b.authors.toLowerCase().includes(q)), [q]
  );

  const filteredPeople = useMemo(() => 
    MOCK_PEOPLE.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q))), [q]
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-black">Resultados para: "{q}"</h1>
        <p className="text-gray-500 mt-2">{filteredBooks.length + filteredPeople.length} resultados encontrados.</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-lg border border-[var(--border-color)]">
        {filteredPeople.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 border-b border-[var(--border-color)] pb-4">Pessoas ({filteredPeople.length})</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-x-8 gap-y-12">
              {filteredPeople.map(p => <PersonCard key={p.id} person={p} />)}
            </div>
          </section>
        )}

        {filteredBooks.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8 border-b border-[var(--border-color)] pb-4">Livros ({filteredBooks.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-16">
              {filteredBooks.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}

        {filteredBooks.length === 0 && filteredPeople.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 font-semibold">Nenhum resultado encontrado para sua busca.</p>
            <button className="mt-4 text-black hover:underline font-bold" onClick={() => window.history.back()}>Voltar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;