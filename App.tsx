
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PersonPage from './pages/PersonPage';
import BookPage from './pages/BookPage';
import Search from './pages/Search';
import Feed from './pages/Feed';
import Admin from './pages/Admin';
import About from './pages/About';
import Books from './pages/Books';
import People from './pages/People';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import { MOCK_BOOKS, MOCK_PEOPLE, MOCK_CITATIONS } from './constants';
import { Book, NotablePerson, Citation, CitationType } from './types';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold tracking-tighter text-black uppercase">
            livr.me
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <Link to="/livros" className="hover:text-black">Livros</Link>
            <Link to="/personalidades" className="hover:text-black">Personalidades</Link>
            <Link to="/feed" className="hover:text-black">Feed</Link>
            <Link to="/sobre" className="hover:text-black">Sobre</Link>
          </nav>

          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </button>
            <Link to="/dashboard" className="text-gray-500 hover:text-black">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="py-16 mt-20">
    <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} livr.me. Todos os direitos reservados.</p>
    </div>
  </footer>
);


function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(MOCK_BOOKS);
  const [people, setPeople] = useState<NotablePerson[]>(MOCK_PEOPLE);
  const [citations, setCitations] = useState<Citation[]>(MOCK_CITATIONS);

  const addBook = (book: Omit<Book, 'id' | 'citationCount'>): Book => {
    const newBook: Book = {
      ...book,
      id: `book-${Date.now()}`,
      citationCount: 0,
    };
    setBooks(prevBooks => [newBook, ...prevBooks]);
    return newBook;
  };

  const addPerson = (person: Omit<NotablePerson, 'id'>) => {
    const newPerson: NotablePerson = {
      ...person,
      id: `person-${Date.now()}`,
    };
    setPeople(prevPeople => [newPerson, ...prevPeople]);
  };

  const updatePerson = (updatedPerson: NotablePerson) => {
    setPeople(prevPeople => prevPeople.map(p => p.id === updatedPerson.id ? updatedPerson : p));
  };

  const deletePerson = (personId: string) => {
    setPeople(prevPeople => prevPeople.filter(p => p.id !== personId));
  };
  
  const updateBook = (updatedBook: Book) => {
      setBooks(prevBooks => prevBooks.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const deleteBook = (bookId: string) => {
      setBooks(prevBooks => prevBooks.filter(b => b.id !== bookId));
  };

  const addCitation = (citation: Omit<Citation, 'id'>) => {
      const newCitation: Citation = {
          ...citation,
          id: `cit-${Date.now()}`
      };
      setCitations(prev => [newCitation, ...prev]);
      // Also update citation count on the book
      setBooks(prev => prev.map(b => b.id === newCitation.bookId ? {...b, citationCount: b.citationCount + 1} : b));
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home allBooks={books} allPeople={people} />} />
            <Route path="/livros" element={<Books allBooks={books} />} />
            <Route path="/personalidades" element={<People allPeople={people} />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/p/:slug" element={<PersonPage />} />
            <Route path="/b/:slug" element={<BookPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/feed" element={<Feed />} />
            <Route 
              path="/admin" 
              element={
                <Admin 
                  allPeople={people}
                  allBooks={books}
                  onAddPerson={addPerson} 
                  onUpdatePerson={updatePerson}
                  onDeletePerson={deletePerson}
                  onAddBook={addBook}
                  onUpdateBook={updateBook}
                  onDeleteBook={deleteBook}
                  onAddCitation={addCitation}
                />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;