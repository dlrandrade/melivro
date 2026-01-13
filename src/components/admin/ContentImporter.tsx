import React, { useState } from 'react';
import { extractBooksFromUrl, extractBooksFromText, fetchBookDetailsFromTitleAndAuthor } from '../../services/openRouterService';
import { Book, Citation, CitationType, NotablePerson } from '../../types';

interface ContentImporterProps {
  onAddBook: (book: Omit<Book, 'id' | 'citationCount'>) => Promise<Book>;
  allPeople: NotablePerson[];
  onAddCitation: (citation: Omit<Citation, 'id'>) => void;
}

type SourceType = 'url' | 'text';

const ContentImporter: React.FC<ContentImporterProps> = ({ onAddBook, allPeople, onAddCitation }) => {
  const [sourceType, setSourceType] = useState<SourceType>('url');
  const [inputValue, setInputValue] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isConfirmingAll, setIsConfirmingAll] = useState(false);
  const [enrichingBook, setEnrichingBook] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<{ title: string; author: string; relevance?: string }[]>([]);
  const [booksToAssign, setBooksToAssign] = useState<(Book & { relevance?: string })[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<Record<string, string>>({});
  const [globalPersonId, setGlobalPersonId] = useState('');

  const handleExtract = async () => {
    if (!inputValue.trim()) return;
    setIsExtracting(true);
    setExtractedItems([]);

    let results = [];
    if (sourceType === 'url') {
      results = await extractBooksFromUrl(inputValue);
    } else {
      results = await extractBooksFromText(inputValue);
    }

    setExtractedItems(results);
    setIsExtracting(false);
  };

  const handleEnrichAndConfirm = async (title: string, author: string, relevance?: string) => {
    setEnrichingBook(title);
    const details = await fetchBookDetailsFromTitleAndAuthor(title, author);

    if (details) {
      const newBookData: Omit<Book, 'id' | 'citationCount'> = {
        title,
        authors: author,
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        coverUrl: details.coverUrl,
        synopsis: details.synopsis,
        isbn13: details.isbn13,
        language: 'PT',
        categories: [],
      };
      const addedBook = await onAddBook(newBookData);
      setBooksToAssign(prev => [{ ...addedBook, relevance }, ...prev]);
      setExtractedItems(prev => prev.filter(item => item.title !== title));
    } else {
      // Add book without details
      const newBookData: Omit<Book, 'id' | 'citationCount'> = {
        title,
        authors: author,
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        coverUrl: '',
        synopsis: '',
        isbn13: '',
        language: 'PT',
        categories: [],
      };
      const addedBook = await onAddBook(newBookData);
      setBooksToAssign(prev => [{ ...addedBook, relevance }, ...prev]);
      setExtractedItems(prev => prev.filter(item => item.title !== title));
    }
    setEnrichingBook(null);
  };

  // Batch confirm all extracted books
  const handleConfirmAll = async () => {
    if (extractedItems.length === 0) return;
    setIsConfirmingAll(true);

    for (const item of extractedItems) {
      await handleEnrichAndConfirm(item.title, item.author, item.relevance);
    }

    setIsConfirmingAll(false);
  };

  const handleAssign = (bookId: string, personId: string) => {
    if (!personId) {
      alert("Por favor, selecione uma personalidade.");
      return;
    }
    const bookToAssign = booksToAssign.find(b => b.id === bookId);
    const citation: Omit<Citation, 'id'> = {
      bookId,
      personId,
      citedYear: new Date().getFullYear(),
      citedType: CitationType.CITED,
      sourceUrl: sourceType === 'url' ? inputValue : '#',
      sourceTitle: 'Fonte Importada',
      quoteExcerpt: bookToAssign?.relevance || 'Citado durante importação de conteúdo.'
    };
    onAddCitation(citation);
    setBooksToAssign(prev => prev.filter(b => b.id !== bookId));
    setSelectedPeople(prev => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });
  };

  // Batch assign all books to selected person
  const handleAssignAll = () => {
    if (!globalPersonId) {
      alert("Por favor, selecione uma personalidade para atribuir todos os livros.");
      return;
    }

    for (const book of booksToAssign) {
      const citation: Omit<Citation, 'id'> = {
        bookId: book.id,
        personId: globalPersonId,
        citedYear: new Date().getFullYear(),
        citedType: CitationType.CITED,
        sourceUrl: sourceType === 'url' ? inputValue : '#',
        sourceTitle: 'Fonte Importada',
        quoteExcerpt: book.relevance || 'Citado durante importação de conteúdo.'
      };
      onAddCitation(citation);
    }

    setBooksToAssign([]);
    setSelectedPeople({});
    setGlobalPersonId('');
    alert(`${booksToAssign.length} livros atribuídos com sucesso!`);
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Coluna de Ações */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 border border-[var(--border-color)] rounded-lg">
            <h3 className="font-bold mb-4">Importar Conteúdo com IA</h3>
            <div className="flex gap-4 mb-4">
              <button onClick={() => setSourceType('url')} className={`text-sm font-bold ${sourceType === 'url' ? 'text-black' : 'text-gray-400'}`}>URL</button>
              <button onClick={() => setSourceType('text')} className={`text-sm font-bold ${sourceType === 'text' ? 'text-black' : 'text-gray-400'}`}>Texto</button>
            </div>
            {sourceType === 'url' ? (
              <input
                className="w-full bg-gray-50 border border-gray-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-black/20 outline-none mb-4"
                placeholder="Cole URL de artigo ou YouTube..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            ) : (
              <textarea
                className="w-full h-48 bg-gray-50 border border-gray-200 rounded-md p-3 text-sm focus:ring-2 focus:ring-black/20 outline-none resize-none mb-4"
                placeholder="Cole o texto de uma entrevista ou podcast aqui..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}
            <button
              onClick={handleExtract}
              disabled={isExtracting || !!enrichingBook || isConfirmingAll}
              className={`w-full py-3 rounded-md font-bold transition-all ${isExtracting || !!enrichingBook || isConfirmingAll ? 'bg-gray-300 text-gray-500' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {isExtracting ? 'Extraindo...' : 'Extrair Livros'}
            </button>
          </div>
        </div>

        {/* Coluna de Resultados */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[var(--border-color)] rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 border-b border-[var(--border-color)] flex justify-between items-center">
              <h2 className="font-bold">Itens para Revisão</h2>
              <div className="flex items-center gap-4">
                <span className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full font-bold">{extractedItems.length} pendentes</span>
                {extractedItems.length > 0 && (
                  <button
                    onClick={handleConfirmAll}
                    disabled={isConfirmingAll || !!enrichingBook}
                    className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300"
                  >
                    {isConfirmingAll ? 'Confirmando...' : 'Confirmar Todos'}
                  </button>
                )}
              </div>
            </div>
            {extractedItems.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Livro</th>
                    <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Autor</th>
                    <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Contexto</th>
                    <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {extractedItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 font-bold">{item.title}</td>
                      <td className="px-6 py-4 text-gray-600">{item.author}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs italic max-w-xs truncate" title={item.relevance}>"{item.relevance}"</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEnrichAndConfirm(item.title, item.author, item.relevance)}
                          disabled={isExtracting || !!enrichingBook || isConfirmingAll}
                          className="text-black font-bold hover:underline disabled:text-gray-400"
                        >
                          {enrichingBook === item.title ? 'Confirmando...' : 'Confirmar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-16 text-center text-gray-500">
                <p>Nenhum item para exibir. Use o importador para extrair livros.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seção de Atribuição */}
      {booksToAssign.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl">Livros Prontos para Atribuir</h2>
            <div className="flex items-center gap-4">
              <select
                value={globalPersonId}
                onChange={(e) => setGlobalPersonId(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="">Selecione para atribuir todos...</option>
                {allPeople.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button
                onClick={handleAssignAll}
                disabled={!globalPersonId}
                className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300"
              >
                Atribuir Todos ({booksToAssign.length})
              </button>
            </div>
          </div>
          <div className="bg-white border border-[var(--border-color)] rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Livro</th>
                  <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Atribuir a</th>
                  <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {booksToAssign.map(book => {
                  const selectedPerson = selectedPeople[book.id] || '';
                  const setSelectedPerson = (val: string) => setSelectedPeople(prev => ({ ...prev, [book.id]: val }));
                  return (
                    <tr key={book.id}>
                      <td className="px-6 py-4 flex items-center gap-4">
                        {book.coverUrl && <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-contain" />}
                        <div>
                          <p className="font-bold">{book.title}</p>
                          <p className="text-gray-500 text-xs">{book.authors}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select value={selectedPerson} onChange={(e) => setSelectedPerson(e.target.value)} className="border border-gray-300 rounded-md p-2">
                          <option value="">Selecione...</option>
                          {allPeople.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => handleAssign(book.id, selectedPerson)} className="bg-black text-white font-bold text-xs px-4 py-2 rounded-md hover:bg-gray-800">
                          Atribuir
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContentImporter;
