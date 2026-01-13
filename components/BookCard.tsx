
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
        <div className="flex items-center gap-1.5 mt-1 mb-1">
          {book.rating && (
            <div className="flex text-amber-400 text-[10px]">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(book.rating || 0) ? 'fill-current' : 'text-gray-200'}>★</span>
              ))}
            </div>
          )}
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate">{book.authors}</p>
        </div>
        {citationSource && <p className="text-[10px] text-gray-400 italic mt-1 line-clamp-1">{citationSource}</p>}
      </Link>
    </div>
  );
};

export default BookCard;
