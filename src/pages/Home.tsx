import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import PersonCard from '../components/PersonCard';
import { Book, NotablePerson, Citation } from '../types';
import MetaTags from '../components/MetaTags';


interface HomeProps {
  allBooks: Book[];
  allPeople: NotablePerson[];
  allCitations: Citation[];
}

// SVG Icons (inline to avoid external dependencies)
const CheckIcon = () => (
  <svg className="w-5 h-5 comparison-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 comparison-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const BookIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const Home: React.FC<HomeProps> = ({ allBooks, allPeople, allCitations }) => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  // FAQ Data
  const faqItems = [
    {
      question: "O MeLivro é gratuito?",
      answer: "Sim! O MeLivro é totalmente gratuito para explorar recomendações de livros e acompanhar as leituras de personalidades influentes. Você pode criar uma conta grátis para salvar seus favoritos e participar da comunidade."
    },
    {
      question: "Como vocês sabem quais livros as personalidades recomendam?",
      answer: "Fazemos uma curadoria rigorosa baseada em entrevistas públicas, podcasts, redes sociais, newsletters e listas de leitura oficiais. Cada recomendação vem com a fonte original para você verificar."
    },
    {
      question: "Posso indicar uma personalidade para ser adicionada?",
      answer: "Claro! Adoramos sugestões da comunidade. Use o formulário de indicação na página inicial ou entre em contato conosco. Priorizamos personalidades com histórico consistente de recomendações literárias."
    },
    {
      question: "As recomendações são de livros em português?",
      answer: "Listamos livros recomendados no idioma original e, quando disponível, indicamos as versões traduzidas para português. A maioria dos livros populares possui tradução brasileira."
    },
    {
      question: "Como posso contribuir com a comunidade?",
      answer: "Você pode criar uma conta gratuita e compartilhar suas próprias leituras no feed da comunidade. Também pode indicar novas personalidades, sugerir correções e interagir com outros leitores."
    }
  ];

  // Testimonials Data (enhanced)
  const testimonials = [
    {
      text: "Descobri 'Sapiens' através da indicação do Bill Gates aqui no MeLivro. Mudou completamente minha visão sobre a história da humanidade!",
      name: "Maria Santos",
      role: "Product Manager",
      location: "São Paulo, SP",
      avatar: "https://i.pravatar.cc/150?u=maria"
    },
    {
      text: "Antes eu ficava perdido em livrarias. Agora sei exatamente o que ler baseado nas recomendações de pessoas que admiro.",
      name: "Carlos Ribeiro",
      role: "Empreendedor",
      location: "Rio de Janeiro, RJ",
      avatar: "https://i.pravatar.cc/150?u=carlos"
    },
    {
      text: "Ver o que Naval Ravikant recomenda me deu uma lista de leituras que está transformando minha forma de pensar sobre negócios.",
      name: "Ana Lima",
      role: "Head de Vendas",
      location: "Curitiba, PR",
      avatar: "https://i.pravatar.cc/150?u=ana"
    },
    {
      text: "Finalmente uma plataforma que reúne as melhores indicações de livros em um só lugar. Uso diariamente para escolher minha próxima leitura.",
      name: "Pedro Costa",
      role: "Dev Lead",
      location: "Florianópolis, SC",
      avatar: "https://i.pravatar.cc/150?u=pedro"
    },
    {
      text: "O feed da comunidade é incrível. Descobri leitores com gostos parecidos e agora sigo suas recomendações também.",
      name: "Julia Ferreira",
      role: "Designer",
      location: "Belo Horizonte, MG",
      avatar: "https://i.pravatar.cc/150?u=julia"
    },
    {
      text: "A curadoria é impecável. Só livros de qualidade recomendados por quem realmente entende do assunto.",
      name: "Ricardo Alves",
      role: "Founder",
      location: "Porto Alegre, RS",
      avatar: "https://i.pravatar.cc/150?u=ricardo"
    }
  ];

  return (
    <>
      <MetaTags
        title="MeLivro | Descubra o que mentes brilhantes estão lendo"
        description="Acompanhe as leituras e recomendações de Bill Gates, Naval Ravikant e outros pensadores influentes. Crie sua biblioteca e inspire-se."
        imageUrl="https://i.imgur.com/gSjY8OQ.png"
      />

      {/* ============================================ */}
      {/* HERO SECTION - Full viewport impactante */}
      {/* ============================================ */}
      <section className="min-h-[90vh] relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="lp-container relative z-10 pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft"></span>
                +1.200 leitores ativos
              </div>

              <h1 className="lp-headline font-serif text-white mb-6">
                Descubra o que as <span className="text-orange-400">mentes mais brilhantes</span> estão lendo
              </h1>

              <p className="lp-subheadline text-gray-300 mb-10 max-w-lg">
                Explore as bibliotecas de Bill Gates, Naval Ravikant e outros pensadores influentes. Encontre sua próxima leitura transformadora.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/login"
                  className="btn-brutal rounded-lg text-center"
                  style={{ background: 'var(--accent-secondary)', borderColor: 'var(--accent-secondary)' }}
                >
                  Começar Gratuitamente
                </Link>
                <Link
                  to="/personalidades"
                  className="px-8 py-4 rounded-lg font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all text-center"
                >
                  Explorar Curadores
                </Link>
              </div>

              <p className="text-sm text-gray-400">✓ Sem cartão de crédito &nbsp; ✓ Acesso imediato &nbsp; ✓ 100% gratuito</p>
            </div>

            {/* Right: Product Mockup (Tangibilização em código) */}
            <div className="relative animate-float hidden lg:block">
              <div className="glass-card rounded-2xl p-6 shadow-2xl border border-white/20 bg-white/5 backdrop-blur-xl">
                {/* Simulated App Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-white/50 text-xs font-medium">melivro.me</span>
                </div>

                {/* Simulated Curator Card */}
                <div className="bg-white rounded-xl p-5 shadow-lg mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={allPeople.find(p => p.slug === 'bill-gates')?.imageUrl || 'https://via.placeholder.com/60'}
                      alt="Bill Gates"
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900">Bill Gates</h4>
                      <p className="text-sm text-gray-500">Filantropo & Fundador da Microsoft</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {allBooks.slice(0, 3).map((book, i) => (
                      <div key={i} className="w-16 h-24 rounded-md overflow-hidden shadow-md border border-gray-100 transition-transform hover:-translate-y-1">
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-16 h-24 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm border border-gray-200">
                      +12
                    </div>
                  </div>
                </div>

                {/* Simulated Activity */}
                <div className="bg-white/80 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600"></div>
                    <div>
                      <span className="font-semibold text-gray-800">Naval</span>
                      <span className="text-gray-500"> adicionou </span>
                      <span className="font-semibold text-gray-800">The Almanack</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Em tempo real ⚡
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SOCIAL PROOF BAR */}
      {/* ============================================ */}
      <section className="py-8 bg-white border-b border-[var(--border-color)]">
        <div className="lp-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-medium text-gray-500">Leitores de empresas como:</p>
            <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center">
              {['Google', 'Meta', 'Nubank', 'iFood', 'Uber'].map((company) => (
                <span key={company} className="grayscale-logo text-xl font-bold text-gray-400 tracking-tight">
                  {company}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/32?u=user${i}`} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
                ))}
              </div>
              <div className="flex items-center gap-1 text-orange-500">
                {[1, 2, 3, 4, 5].map(i => <StarIcon key={i} filled />)}
              </div>
              <span className="text-sm font-medium text-gray-600">4.9</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEARCH BAR */}
      {/* ============================================ */}
      <div className="lp-container">
        <section className="py-12">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-3">
            <input
              name="search"
              type="text"
              placeholder="Busque por livros, pessoas ou temas..."
              className="flex-1 px-6 py-4 rounded-xl border-2 border-[var(--border-color)] focus:outline-none focus:border-black transition-colors bg-white shadow-sm"
            />
            <button type="submit" className="btn-brutal rounded-xl px-8">
              Buscar
            </button>
          </form>
        </section>



        {/* ============================================ */}
        {/* COMPARISON SECTION (Nós vs. Eles) */}
        {/* ============================================ */}
        <section className="lp-section">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Por que escolher o MeLivro?
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Chega de listas genéricas. Descubra livros através de quem realmente os leu e os viveu.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Concorrente / Tradicional */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="font-bold text-lg text-gray-400 mb-6 uppercase tracking-wider">Listas Tradicionais</h3>
              <ul className="space-y-4">
                {[
                  'Recomendações genéricas de algoritmos',
                  'Sem contexto de quem recomendou',
                  'Baseado apenas em vendas',
                  'Informações desatualizadas',
                  'Difícil descobrir novos autores'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-500">
                    <XIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* MeLivro */}
            <div className="bg-white rounded-2xl p-8 border-2 border-black shadow-[var(--shadow-brutal)] relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </div>
              <h3 className="font-bold text-lg text-black mb-6 uppercase tracking-wider">MeLivro</h3>
              <ul className="space-y-4">
                {[
                  'Curadoria humana de especialistas',
                  'Fonte e contexto de cada indicação',
                  'Baseado em impacto real',
                  'Atualizado em tempo real',
                  'Descubra através de curadores'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-800 font-medium">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* EXPLORE BY PERSONALITY (mantido, melhorado) */}
        {/* ============================================ */}
        <section className="lp-section border-t border-[var(--border-color)]">
          <h2 className="font-serif text-4xl font-bold mb-4 text-center tracking-tighter">Explore por Personalidade</h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Conheça as bibliotecas de empreendedores, cientistas, artistas e pensadores que estão moldando o mundo.
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-x-8 gap-y-12">
            {allPeople.slice(0, 12).map(person => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/personalidades" className="inline-block px-8 py-3 border-2 border-black rounded-lg font-bold hover:bg-black hover:text-white transition-colors">
              Ver todos os curadores →
            </Link>
          </div>
        </section>

        {/* ============================================ */}
        {/* BENTO GRID - FEATURES / BENEFITS */}
        {/* ============================================ */}
        <section className="lp-section border-t border-[var(--border-color)]">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              Tudo que você precisa para ler melhor
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Recursos pensados para leitores sérios que valorizam seu tempo.
            </p>
          </div>

          <div className="bento-grid">
            {/* Large Card - Curadoria */}
            <div className="bento-large bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-6">
                  <SparklesIcon />
                </div>
                <h3 className="font-bold text-2xl mb-3">Curadoria Premium</h3>
                <p className="text-gray-600">
                  Cada recomendação é verificada e contextualizada. Você sabe exatamente onde e quando o curador mencionou o livro.
                </p>
              </div>
              <div className="mt-6 flex gap-2">
                {mostCitedBooks.slice(0, 3).map((book, i) => (
                  <img key={i} src={book.coverUrl} alt="" className="w-16 h-24 rounded-lg object-cover shadow-md" />
                ))}
              </div>
            </div>

            {/* Small Cards */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">Biblioteca Pessoal</h3>
              <p className="text-gray-500 text-sm">Salve seus favoritos e organize suas próximas leituras.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-shadow group">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UsersIcon />
              </div>
              <h3 className="font-bold text-lg mb-2">Comunidade Ativa</h3>
              <p className="text-gray-500 text-sm">Compartilhe leituras e descubra novos leitores.</p>
            </div>

            <div className="bento-wide bg-black text-white rounded-2xl p-8 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-2xl mb-2">Atualizações em Tempo Real</h3>
                <p className="text-gray-400">Seja notificado quando seus curadores favoritos adicionarem novos livros.</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <TrendingUpIcon />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* RECENTLY ADDED BOOKS (mantido) */}
        {/* ============================================ */}
        <section className="lp-section border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold tracking-tighter">Adicionados Recentemente</h2>
            <Link to="/livros" className="font-semibold text-sm hover:text-black">Ver todos</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-16">
            {recentlyAddedBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* FEATURED & STATS SECTION (mantido, melhorado) */}
        {/* ============================================ */}
        <section className="lp-section">
          <div className="bg-white rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-color)]">

              {/* Col 1: Destaque */}
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
                      <Link to={`/p/${featured.slug}`} className="text-sm font-bold border-b-2 border-black pb-0.5 hover:text-gray-600 transition-colors">
                        Ver recomendações
                      </Link>
                    </>
                  );
                })()}
              </div>

              {/* Col 2: Mais Visto */}
              <div className="p-8 flex flex-col items-center text-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Mais Visto</h3>
                {(() => {
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
                      <p className="text-gray-500 text-sm mb-1">
                        {mostViewed.views ? `${mostViewed.views} visualizações` : 'Tendência na comunidade'}
                      </p>
                      <p className="text-gray-400 text-xs line-clamp-1 mb-4">{mostViewed.bio}</p>
                      <Link to={`/p/${mostViewed.slug}`} className="text-sm font-bold border-b-2 border-black pb-0.5 hover:text-gray-600 transition-colors">
                        Ver perfil
                      </Link>
                    </>
                  );
                })()}
              </div>

              {/* Col 3: Indique */}
              <div className="p-8 flex flex-col items-center text-center bg-gray-50/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Indique uma Personalidade</h3>
                <div className="w-full max-w-xs">
                  <img src="/community-faces.png" alt="Comunidade" className="w-full h-auto object-contain mb-4 opacity-80 mix-blend-multiply" />
                  <p className="text-gray-500 text-sm mb-6">Sente falta de alguém? Nos diga quem deveríamos adicionar.</p>
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
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
                    <button type="submit" className="w-full btn-brutal rounded-lg text-sm">
                      Enviar Indicação
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* MOST CITED BOOKS (mantido) */}
        {/* ============================================ */}
        <section className="lp-section border-t border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold tracking-tighter">Os Livros Mais Citados</h2>
            <Link to="/livros" className="font-semibold text-sm hover:text-black">Ver todos</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-16">
            {mostCitedBooks.map(book => (
              <BookCard key={book.id} book={book} citationSource={`${book.citationCount} citações`} />
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* TESTIMONIALS - WALL OF LOVE */}
        {/* ============================================ */}
        <section className="lp-section border-t border-[var(--border-color)]">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              O que nossos leitores dizem
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Milhares de leitores já transformaram sua forma de escolher livros.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-[var(--border-color)] hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-1 text-orange-500 mb-4">
                  {[1, 2, 3, 4, 5].map(j => <StarIcon key={j} filled />)}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================ */}
        {/* FAQ SECTION */}
        {/* ============================================ */}
        <section className="lp-section border-t border-[var(--border-color)]">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tighter mb-4">
                Perguntas Frequentes
              </h2>
              <p className="text-lg text-gray-500">
                Tudo o que você precisa saber para começar.
              </p>
            </div>

            <div className="space-y-4">
              {faqItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[var(--border-color)] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>{item.question}</span>
                    <span className={`transform transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed animate-slide-up">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FINAL CTA */}
        {/* ============================================ */}
        <section className="lp-section">
          <div className="bg-black rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tighter mb-6">
                Pronto para descobrir sua<br />próxima leitura transformadora?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Junte-se a milhares de leitores que já descobriram o poder de ler os livros certos.
              </p>
              <Link
                to="/login"
                className="inline-block px-10 py-5 rounded-xl font-bold text-lg text-black transition-all hover:scale-105"
                style={{ background: 'var(--accent-secondary)' }}
              >
                Começar Gratuitamente →
              </Link>
              <p className="text-sm text-gray-400 mt-6">Sem cartão de crédito. Sem compromisso.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;