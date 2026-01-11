import React from 'react';
import { NotablePerson } from '../types';
import PersonCard from '../components/PersonCard';
import MetaTags from '../components/MetaTags';

interface PeopleProps {
  allPeople: NotablePerson[];
}

const People: React.FC<PeopleProps> = ({ allPeople }) => {
  return (
    <>
      <MetaTags
        title="Nossos Curadores | meLivro.me"
        description="Descubra recomendações de livros através das mentes que você admira. Explore perfis de Bill Gates, Naval Ravikant e mais."
      />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-black tracking-tighter">Nossos Curadores</h1>
          <p className="text-lg text-gray-500 mt-2">Descubra recomendações através das mentes que você admira.</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
          {allPeople.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    </>
  );
};

export default People;