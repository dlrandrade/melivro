import React from 'react';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import MetaTags from '../components/MetaTags';

interface BooksProps {
  allBooks: Book[];
}

const Books: React.FC<BooksProps> = ({ allBooks }) => {
  return (
    <>
      <MetaTags 
        title="Explore Nosso Acervo de Livros | MeLivro"
        description="Navegue por todos os livros recomendados por personalidades influentes em um só lugar. Encontre sua próxima leitura."
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-black tracking-tighter">Explore Nosso Acervo</h1>
          <p className="text-lg text-gray-500 mt-2">Todos os livros recomendados em um só lugar.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-8 gap-y-16">
          {allBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Books;