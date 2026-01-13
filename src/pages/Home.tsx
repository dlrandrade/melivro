import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import PersonCard from '../components/PersonCard';
import { Book, NotablePerson, Citation } from '../types';
import MetaTags from '../components/MetaTags';
import Slideshow from '../components/Slideshow';

interface HomeProps {
  allBooks: Book[];
  allPeople: NotablePerson[];
  allCitations: Citation[];
}

const Home: React.FC<HomeProps> = ({ allBooks, allPeople, allCitations }) => {
  const navigate = useNavigate();
  const featuredHeroPerson = allPeople.find(p => p.slug === 'bill-gates');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const mostCitedBooks = useMemo(() => {
    const citationCounts = allCitations.reduce((acc, cit) => {
      acc[cit.bookId] = (acc[cit.bookId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return allBooks
      .map(book => ({
        ...book,
        citationCount: citationCounts[book.id] || 0,
      }))
      .filter(book => book.citationCount > 0)
      .sort((a, b) => b.citationCount - a.citationCount)
      .slice(0, 4);
  }, [allBooks, allCitations]);

  const recentlyAddedBooks = useMemo(() => {
    return allBooks.slice(0, 4);
  }, [allBooks]);

  const featuredCurator = allPeople.find(p => p.slug === 'naval');
  const featuredCuratorBooks = allCitations.filter(c => c.personId === featuredCurator?.id)
    .map(c => allBooks.find(b => b.id === c.bookId))
    .filter((b): b is Book => b !== undefined)
    .slice(0, 2);

  return (
    <>
      <MetaTags
        title="MeLivro | Descubra o que mentes brilhantes estão lendo"
        description="Acompanhe as leituras e recomendações de Bill Gates, Naval Ravikant e outros pensadores influentes. Crie sua biblioteca e inspire-se."
        imageUrl="https://i.imgur.com/gSjY8OQ.png"
      />
      <div className="max-w-7xl mx-auto px-6">

        {/* Search Bar in Home */}
        <section className="mt-12 mb-8">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex gap-2">
            <input
              name="search"
              type="text"
              placeholder="Busque por livros, pessoas ou temas..."
              className="flex-1 px-4 py-3 rounded-md border border-[var(--border-color)] focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button type="submit" className="bg-black text-white px-6 py-3 rounded-md font-bold text-sm">Buscar</button>
          </form>
        </section>

        {/* Slideshow Header */}
        <Slideshow />


        {/* Notable People Section - DOUBLED */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl font-bold mb-8 text-center tracking-tighter">Explore por Personalidade</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-x-8 gap-y-12">
            {allPeople.slice(0, 12).map(person => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </section>

        {/* Recently Added Books Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-t border-[var(--border-color)] pt-12">
            <h2 className="font-serif text-3xl font-bold tracking-tighter">Adicionados Recentemente</h2>
            <Link to="/livros" className="font-semibold text-sm hover:text-black">Ver todos</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-16">
            {recentlyAddedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Featured & Stats Section */}
        <section className="mb-20 bg-white rounded-lg border border-[var(--border-color)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-color)]">

            {/* Col 1: Destaque (Featured) */}
            <div className="p-8 flex flex-col items-center text-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Em Destaque</h3>
              {(() => {
                const featured = allPeople.find(p => p.is_featured) || allPeople.find(p => p.slug === 'naval') || allPeople[0];
                if (!featured) return null;
                return (
                  <>
                    <Link to={`/p/${featured.slug}`} className="block group">
                      <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-100 group-hover:border-black transition-colors">
                        <img src={featured.imageUrl} alt={featured.name} className="w-full h-full object-cover" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold tracking-tighter mb-2 group-hover:underline">{featured.name}</h2>
                    </Link>
                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{featured.bio}</p>
                    <Link to={`/p/${featured.slug}`} className="text-sm font-bold border-b border-black pb-0.5 hover:text-gray-600 transition-colors">
                      Ver recomendações
                    </Link>
                  </>
                );
              })()}
            </div>

            {/* Col 2: Mais Visto (Most Viewed) */}
            <div className="p-8 flex flex-col items-center text-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Mais Visto</h3>
              {(() => {
                // Filter out the featured one to avoid duplication if possible, or just show top viewed
                const featuredId = allPeople.find(p => p.is_featured)?.id;
                const mostViewed = [...allPeople]
                  .filter(p => p.id !== featuredId)
                  .sort((a, b) => (b.views || 0) - (a.views || 0))[0];

                if (!mostViewed) return <p className="text-gray-400 text-sm">Dados insuficientes</p>;

                return (
                  <>
                    <Link to={`/p/${mostViewed.slug}`} className="block group">
                      <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-100 group-hover:border-black transition-colors relative">
                        <img src={mostViewed.imageUrl} alt={mostViewed.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] py-1 font-bold uppercase tracking-wider">Top #1</div>
                      </div>
                      <h2 className="font-serif text-2xl font-bold tracking-tighter mb-2 group-hover:underline">{mostViewed.name}</h2>
                    </Link>
                    <p className="text-gray-500 text-sm mb-4">
                      {mostViewed.views ? `${mostViewed.views} visualizações` : 'Tendência na comunidade'}
                    </p>
                    <Link to={`/p/${mostViewed.slug}`} className="text-sm font-bold border-b border-black pb-0.5 hover:text-gray-600 transition-colors">
                      Ver perfil
                    </Link>
                  </>
                );
              })()}
            </div>

            {/* Col 3: Indique uma Personalidade */}
            <div className="p-8 flex flex-col items-center text-center bg-gray-50/50">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Indique uma Personalidade</h3>
              <div className="w-full max-w-xs">
                <p className="text-gray-500 text-sm mb-6">Sente falta de alguém? Nos diga quem deveríamos adicionar.</p>
                <form
                  action="mailto:eusou@danielluzz.com.br"
                  method="get"
                  encType="text/plain"
                  className="space-y-3"
                  onSubmit={(e) => {
                    // Prevent default if we want to handle via JS, but mailto works as basic html form
                    // For better UX with default mail client:
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = formData.get('name');
                    window.location.href = `mailto:eusou@danielluzz.com.br?subject=Indicação de Personalidade: ${name}&body=Olá, gostaria de indicar a personalidade: ${name}`;
                  }}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome da Personalidade"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black text-sm bg-white"
                    required
                  />
                  <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                    Enviar Indicação
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>

        {/* Most Cited Books Section */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-t border-[var(--border-color)] pt-12">
            <h2 className="font-serif text-3xl font-bold tracking-tighter">Os Livros Mais Citados</h2>
            <Link to="/livros" className="font-semibold text-sm hover:text-black">Ver todos</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-16">
            {mostCitedBooks.map(book => (
              <BookCard key={book.id} book={book} citationSource={`${book.citationCount} citações`} />
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20 bg-white rounded-lg p-12 border border-[var(--border-color)]">
          <h2 className="font-serif text-3xl font-bold mb-10 text-center tracking-tighter">O Que Nossos Leitores Dizem</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-600 italic mb-4">Descobri 'Sapiens' através da indicação do Bill Gates aqui no MeLivro. Mudou completamente minha visão sobre a história da humanidade!</p>
              <p className="font-bold">— Maria S.</p>
              <p className="text-sm text-gray-400">São Paulo, SP</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-600 italic mb-4">Antes eu ficava perdido em livrarias. Agora sei exatamente o que ler baseado nas recomendações de pessoas que admiro.</p>
              <p className="font-bold">— Carlos R.</p>
              <p className="text-sm text-gray-400">Rio de Janeiro, RJ</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-600 italic mb-4">Ver o que Naval Ravikant recomenda me deu uma lista de leituras que está transformando minha forma de pensar sobre negócios.</p>
              <p className="font-bold">— Ana L.</p>
              <p className="text-sm text-gray-400">Curitiba, PR</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;