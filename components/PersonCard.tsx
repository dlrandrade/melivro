
import React from 'react';
import { Link } from 'react-router-dom';
import { NotablePerson } from '../types';

interface PersonCardProps {
  person: NotablePerson;
}

const PersonCard: React.FC<PersonCardProps> = ({ person }) => {
  return (
    <div className="group text-center">
      <Link to={`/p/${person.slug}`} className="block">
        <div className="aspect-square bg-gray-100 mb-2 rounded-full overflow-hidden shadow-md transition-shadow group-hover:shadow-lg">
          <img 
            src={person.imageUrl} 
            alt={person.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{person.name}</h4>
        {person.tags && person.tags.length > 0 && <p className="text-xs text-gray-500 line-clamp-1">{person.tags[0]}</p>}
      </Link>
    </div>
  );
};

export default PersonCard;
