
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  citationSource?: string;
}

const BookCard: React.FC<BookCardProps> = ({ book, citationSource }) => {
  return (
    <div className="group">
      <Link to={`/b/${book.slug}`} className="block">
        <div className="aspect-[3/4] bg-[var(--bg-card)] p-4 mb-4 flex items-center justify-center transition-colors group-hover:bg-gray-200/50">
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="w-full h-full object-contain shadow-md transition-transform group-hover:scale-105"
          />
        </div>
        <h4 className="font-bold text-sm text-black line-clamp-1">{book.title}</h4>
        {citationSource && <p className="text-xs text-gray-500">{citationSource}</p>}
        <p className="text-xs text-gray-500">{book.authors}</p>
      </Link>
    </div>
  );
};

export default BookCard;
