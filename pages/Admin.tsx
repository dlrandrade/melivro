import React, { useState } from 'react';
import { supabase } from '../src/supabase';
import { Book, NotablePerson, Citation } from '../types';
import ContentImporter from '../components/admin/ContentImporter';
import ManagePeople from '../components/admin/ManagePeople';
import HomepageEditor from '../components/admin/HomepageEditor';
import ManageBooks from '../components/admin/ManageBooks';

interface AdminProps {
  allPeople: NotablePerson[];
  allBooks: Book[];
  onAddPerson: (person: Omit<NotablePerson, 'id'>) => void;
  onUpdatePerson: (person: NotablePerson) => void;
  onDeletePerson: (personId: string) => void;
  onAddBook: (book: Omit<Book, 'id' | 'citationCount'>) => Promise<Book>;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onAddCitation: (citation: Omit<Citation, 'id'>) => void;
}

type AdminTab = 'home' | 'import' | 'people' | 'books';

const Admin: React.FC<AdminProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomepageEditor allPeople={props.allPeople} />;
      case 'import':
        return <ContentImporter
          onAddBook={props.onAddBook}
          allPeople={props.allPeople}
          onAddCitation={props.onAddCitation}
        />;
      case 'people':
        return <ManagePeople
          allPeople={props.allPeople}
          onAddPerson={props.onAddPerson}
          onUpdatePerson={props.onUpdatePerson}
          onDeletePerson={props.onDeletePerson}
        />;
      case 'books':
        return <ManageBooks
          allBooks={props.allBooks}
          onAddBook={props.onAddBook}
          onUpdateBook={props.onUpdateBook}
          onDeleteBook={props.onDeleteBook}
        />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tabName: AdminTab, label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 rounded-md font-bold text-sm transition-all ${activeTab === tabName ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-200'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2 tracking-tighter">Painel de Administração</h1>
        <p className="text-gray-500">Gerencie todo o conteúdo da plataforma MeLivro.</p>
      </div>

      <div className="flex items-center justify-between mb-8 pb-8 border-b border-[var(--border-color)]">
        <div className="flex gap-4">
          <TabButton tabName="home" label="Início" />
          <TabButton tabName="import" label="Importador de Conteúdo" />
          <TabButton tabName="people" label="Gerenciar Personalidades" />
          <TabButton tabName="books" label="Gerenciar Livros" />
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-widest"
        >
          Sair do Sistema
        </button>
      </div>

      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Admin;