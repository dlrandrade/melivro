import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
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
import Login from './pages/Login';
import { supabase } from './supabase';
import { Book, NotablePerson, Citation, User, Activity, ActivityType } from './types';

// Auth Guard Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const Header: React.FC<{ user: any; profile: any }> = ({ user, profile }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          <Link to="/" className="text-2xl font-extrabold tracking-tighter text-black uppercase">
            MeLivro
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
            <Link to={user ? (profile?.username ? `/profile/${profile.username}` : "/admin") : "/dashboard"} className="text-gray-500 hover:text-black">
              {user ? (
                profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              )}
            </Link>
            {user && profile?.role === 'admin' && (
              <Link to="/admin" className="text-gray-500 hover:text-black flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="py-16 mt-20">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} MeLivro. Todos os direitos reservados.</p>
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
  const [books, setBooks] = useState<Book[]>([]);
  const [people, setPeople] = useState<NotablePerson[]>([]);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch people
      const { data: peopleData, error: peopleError } = await supabase
        .from('notable_people')
        .select('*')
        .order('name');

      if (peopleError) throw peopleError;
      const formattedPeople = (peopleData || []).map(p => ({
        ...p,
        imageUrl: p.image_url
      }));
      setPeople(formattedPeople);

      // Fetch books with citation count from the view
      const { data: booksData, error: booksError } = await supabase
        .from('book_details')
        .select('*')
        .order('title');

      if (booksError) throw booksError;

      const formattedBooks = (booksData || []).map(b => ({
        ...b,
        coverUrl: b.cover_url,
        citationCount: b.citation_count,
        publicationDate: b.publication_date,
        reviewCount: b.review_count
      }));
      setBooks(formattedBooks);

      // Fetch citations
      const { data: citationsData, error: citationsError } = await supabase
        .from('citations')
        .select('*')
        .order('created_at', { ascending: false });

      if (citationsError) throw citationsError;

      const formattedCitations = (citationsData || []).map(c => ({
        ...c,
        personId: c.person_id,
        bookId: c.book_id,
        citedYear: c.cited_year,
        citedType: c.cited_type,
        sourceUrl: c.source_url,
        sourceTitle: c.source_title,
        sourceDate: c.source_date,
        quoteExcerpt: c.quote_excerpt
      }));
      setCitations(formattedCitations);

      // Fetch community activities
      const { data: actsData, error: actsError } = await supabase
        .from('activities')
        .select('*, profiles(*), books(*), notable_people(*)')
        .order('created_at', { ascending: false });

      if (actsError) throw actsError;

      const formattedActivities = (actsData || []).map(a => ({
        id: a.id,
        user: {
          id: a.profiles?.id,
          name: a.profiles?.full_name || a.profiles?.username || 'Usuário',
          username: a.profiles?.username,
          avatarUrl: a.profiles?.avatar_url || 'https://i.pravatar.cc/48'
        },
        type: a.activity_type as ActivityType,
        timestamp: a.created_at, // Pass ISO date for sorting
        likes: a.likes_count || 0,
        comments: a.comments_count || 0,
        payload: {
          ...a.payload,
          book: a.books ? {
            ...a.books,
            coverUrl: a.books.cover_url
          } : undefined,
          person: a.notable_people ? {
            ...a.notable_people,
            imageUrl: a.notable_people.image_url
          } : undefined,
        }
      }));
      setActivities(formattedActivities);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    fetchData();

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setUserProfile(data);
    }
  };

  const addBook = async (book: Omit<Book, 'id' | 'citationCount'>): Promise<Book> => {
    const { data, error } = await supabase
      .from('books')
      .insert([{
        title: book.title,
        slug: book.slug,
        authors: book.authors,
        isbn13: book.isbn13,
        cover_url: book.coverUrl,
        synopsis: book.synopsis,
        language: book.language,
        categories: book.categories,
        rating: book.rating,
        pages: book.pages,
        publication_date: book.publicationDate,
        review_count: book.reviewCount
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding book:', error);
      throw error;
    }

    const newBook = {
      ...data,
      coverUrl: data.cover_url,
      citationCount: 0
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  };

  const addPerson = async (person: Omit<NotablePerson, 'id'>) => {
    const { data, error } = await supabase
      .from('notable_people')
      .insert([{
        name: person.name,
        slug: person.slug,
        bio: person.bio,
        image_url: person.imageUrl,
        country: person.country,
        tags: person.tags
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding person:', error);
      throw error;
    }

    const newPerson = {
      ...data,
      imageUrl: data.image_url
    };
    setPeople(prev => [newPerson, ...prev]);
  };

  const updatePerson = async (updatedPerson: NotablePerson) => {
    const { error } = await supabase
      .from('notable_people')
      .update({
        name: updatedPerson.name,
        bio: updatedPerson.bio,
        image_url: updatedPerson.imageUrl,
        country: updatedPerson.country,
        tags: updatedPerson.tags
      })
      .eq('id', updatedPerson.id);

    if (error) {
      console.error('Error updating person:', error);
      throw error;
    }
    setPeople(prev => prev.map(p => p.id === updatedPerson.id ? updatedPerson : p));
  };

  const deletePerson = async (personId: string) => {
    const { error } = await supabase
      .from('notable_people')
      .delete()
      .eq('id', personId);

    if (error) {
      console.error('Error deleting person:', error);
      throw error;
    }
    setPeople(prev => prev.filter(p => p.id !== personId));
  };

  const updateBook = async (updatedBook: Book) => {
    const { error } = await supabase
      .from('books')
      .update({
        title: updatedBook.title,
        authors: updatedBook.authors,
        isbn13: updatedBook.isbn13,
        cover_url: updatedBook.coverUrl,
        synopsis: updatedBook.synopsis,
        language: updatedBook.language,
        categories: updatedBook.categories,
        rating: updatedBook.rating,
        pages: updatedBook.pages,
        publication_date: updatedBook.publicationDate
      })
      .eq('id', updatedBook.id);

    if (error) {
      console.error('Error updating book:', error);
      throw error;
    }
    setBooks(prev => prev.map(b => b.id === updatedBook.id ? updatedBook : b));
  };

  const deleteBook = async (bookId: string) => {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);

    if (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
    setBooks(prev => prev.filter(b => b.id !== bookId));
  };

  const addCitation = async (citation: Omit<Citation, 'id'>) => {
    const { data, error } = await supabase
      .from('citations')
      .insert([{
        person_id: citation.personId,
        book_id: citation.bookId,
        cited_year: citation.citedYear,
        cited_type: citation.citedType,
        source_url: citation.sourceUrl,
        source_title: citation.sourceTitle,
        source_date: citation.sourceDate,
        quote_excerpt: citation.quoteExcerpt
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding citation:', error);
      throw error;
    }

    const newCitation = {
      ...data,
      personId: data.person_id,
      bookId: data.book_id,
      citedYear: data.cited_year,
      citedType: data.cited_type,
      sourceUrl: data.source_url,
      sourceTitle: data.source_title,
      quoteExcerpt: data.quote_excerpt
    };

    setCitations(prev => [newCitation, ...prev]);
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Carregando MeLivro...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Header user={session?.user} profile={userProfile} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home allBooks={books} allPeople={people} allCitations={citations} />} />
            <Route path="/livros" element={<Books allBooks={books} />} />
            <Route path="/personalidades" element={<People allPeople={people} />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/p/:slug" element={<PersonPage allPeople={people} allBooks={books} allCitations={citations} />} />
            <Route path="/b/:slug" element={<BookPage allBooks={books} allCitations={citations} allPeople={people} />} />
            <Route path="/search" element={<Search allBooks={books} allPeople={people} />} />
            <Route path="/feed" element={<Feed allCitations={citations} allBooks={books} allPeople={people} databaseActivities={activities} onRefreshFeed={fetchData} user={session?.user} />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
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
                </PrivateRoute>
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