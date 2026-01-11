
import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { fetchBookDetailsFromAmazonUrl } from '../../src/services/openRouterService';
import { fetchBookDetailsFromGoogleBooksByISBN } from '../../services/googleBooksService';

interface EditBookModalProps {
    bookToEdit?: Book;
    onClose: () => void;
    onUpdateBook: (book: Book) => void;
    onAddBook: (book: Omit<Book, 'id' | 'citationCount'>) => void;
}

const getInitialFormData = (): Book => ({
    id: `new-${Date.now()}`, // temp id
    title: '',
    slug: '',
    authors: '',
    coverUrl: 'https://via.placeholder.com/150x220.png?text=Capa',
    synopsis: '',
    language: 'PT',
    categories: [],
    citationCount: 0,
});

const EditBookModal: React.FC<EditBookModalProps> = ({ bookToEdit, onClose, onUpdateBook, onAddBook }) => {
    const [formData, setFormData] = useState<Book>(bookToEdit || getInitialFormData());
    const [amazonUrl, setAmazonUrl] = useState('');
    const [isFetchingAmazon, setIsFetchingAmazon] = useState(false);
    const [isbnToSearch, setIsbnToSearch] = useState('');
    const [isFetchingGoogle, setIsFetchingGoogle] = useState(false);
    const [isbnForCover, setIsbnForCover] = useState('');

    const isCreating = !bookToEdit;

    useEffect(() => {
        setFormData(bookToEdit || getInitialFormData());
    }, [bookToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFetchFromAmazon = async () => {
        if (!amazonUrl) return;
        setIsFetchingAmazon(true);
        const details = await fetchBookDetailsFromAmazonUrl(amazonUrl);
        if (details) {
            setFormData(prev => ({
                ...prev,
                title: details.title || prev.title,
                authors: details.authors || prev.authors,
                synopsis: details.synopsis || prev.synopsis,
                coverUrl: details.coverUrl || prev.coverUrl,
                isbn13: details.isbn13 || prev.isbn13,
                slug: amazonUrl.split('/dp/')[1]?.split('/')[0] || prev.slug,
            }));
        } else {
            alert('Não foi possível buscar os dados da Amazon. Verifique a URL.');
        }
        setIsFetchingAmazon(false);
    };

    const handleFetchFromGoogleBooks = async () => {
        if (!isbnToSearch.trim()) return;
        setIsFetchingGoogle(true);
        const details = await fetchBookDetailsFromGoogleBooksByISBN(isbnToSearch);
        if (details) {
            setFormData(prev => ({
                ...prev,
                title: details.title || prev.title,
                authors: details.authors || prev.authors,
                synopsis: details.synopsis || prev.synopsis,
                coverUrl: details.coverUrl || prev.coverUrl,
                isbn13: details.isbn13 || prev.isbn13,
                slug: details.title ? details.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : prev.slug
            }));
        } else {
            alert('Não foi possível buscar os dados do Google Books. Verifique o ISBN e se a chave da API está configurada.');
        }
        setIsFetchingGoogle(false);
    };

    const handleFetchFromOpenLibrary = () => {
        const isbn = isbnForCover.trim() || formData.isbn13?.trim();
        if (!isbn) {
            alert('Por favor, insira um ISBN no campo de busca ou no campo ISBN13 do formulário.');
            return;
        }
        const coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

        const img = new Image();
        img.src = coverUrl;
        img.onload = () => {
            setFormData(prev => ({ ...prev, coverUrl }));
            alert('Capa encontrada e atualizada!');
        };
        img.onerror = () => {
            alert('Nenhuma capa encontrada no Open Library para este ISBN. A imagem pode não existir ou o ISBN está incorreto.');
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCreating) {
            const { id, citationCount, ...newBookData } = formData;
            onAddBook(newBookData);
        } else {
            onUpdateBook(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative my-8">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">&times;</button>
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="font-bold text-xl mb-6">{isCreating ? 'Adicionar Novo Livro' : 'Editar Livro'}</h2>

                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-4">
                        <label className="font-bold text-sm mb-2 block">Importar da Amazon (URL)</label>
                        <div className="flex gap-2">
                            <input
                                type="url"
                                placeholder="Cole o link do produto aqui"
                                value={amazonUrl}
                                onChange={(e) => setAmazonUrl(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleFetchFromAmazon}
                                disabled={isFetchingAmazon}
                                className="bg-gray-800 text-white font-bold px-4 py-2 rounded-md hover:bg-black disabled:bg-gray-300"
                            >
                                {isFetchingAmazon ? '...' : 'Puxar'}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-4">
                        <label className="font-bold text-sm mb-2 block">Puxar dados via ISBN (Google Books)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="ISBN13 do livro"
                                value={isbnToSearch}
                                onChange={(e) => setIsbnToSearch(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleFetchFromGoogleBooks}
                                disabled={isFetchingGoogle}
                                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                            >
                                {isFetchingGoogle ? '...' : 'Buscar'}
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mb-6">
                        <label className="font-bold text-sm mb-2 block">Puxar capa via ISBN (Open Library)</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="ISBN13 do livro"
                                value={isbnForCover}
                                onChange={(e) => setIsbnForCover(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleFetchFromOpenLibrary}
                                className="bg-green-600 text-white font-bold px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300"
                            >
                                Buscar Capa
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <img src={formData.coverUrl} alt={formData.title} className="w-24 h-auto mx-auto mb-4 border" />
                        <input type="text" name="title" placeholder="Título" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
                        <input type="text" name="authors" placeholder="Autor(es)" value={formData.authors} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
                        <textarea name="synopsis" placeholder="Sinopse" value={formData.synopsis} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 h-24" required />
                        <input type="text" name="slug" placeholder="Slug (ex: nome-do-livro)" value={formData.slug} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                        <input type="text" name="isbn13" placeholder="ISBN13" value={formData.isbn13 || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-black font-bold px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-black text-white font-bold px-4 py-2 rounded-md hover:bg-gray-800">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookModal;
