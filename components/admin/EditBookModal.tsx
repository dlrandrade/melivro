import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { fetchBookDetailsFromAmazonUrl } from '../../src/services/openRouterService';
import { fetchBookDetailsFromGoogleBooksByISBN } from '../../services/googleBooksService';
import ImageUpload from './ImageUpload';

interface EditBookModalProps {
    bookToEdit?: Book;
    onClose: () => void;
    onUpdateBook: (book: Book) => void;
    onAddBook: (book: Omit<Book, 'id' | 'citationCount'>) => void;
}

const getInitialFormData = (): Book => ({
    id: `new-${Date.now()}`,
    title: '',
    slug: '',
    authors: '',
    coverUrl: '',
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

    const isCreating = !bookToEdit;

    useEffect(() => {
        setFormData(bookToEdit || getInitialFormData());
    }, [bookToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadComplete = (url: string) => {
        setFormData(prev => ({ ...prev, coverUrl: url }));
    };

    const handleFetchFromAmazon = async () => {
        if (!amazonUrl) return;
        setIsFetchingAmazon(true);
        try {
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
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsFetchingAmazon(false);
        }
    };

    const handleFetchFromGoogleBooks = async () => {
        if (!isbnToSearch.trim()) return;
        setIsFetchingGoogle(true);
        try {
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
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsFetchingGoogle(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
        };
        if (isCreating) {
            const { id, citationCount, ...newBookData } = finalData;
            onAddBook(newBookData);
        } else {
            onUpdateBook(finalData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative border border-[var(--border-color)] my-8">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors text-2xl font-light">&times;</button>
                <form onSubmit={handleSubmit} className="p-10">
                    <h2 className="font-serif text-3xl font-bold mb-8 tracking-tighter">{isCreating ? 'Adicionar Novo Livro' : 'Editar Livro'}</h2>

                    <div className="space-y-6">
                        {/* Import Tools */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 bg-gray-50 rounded-xl border border-[var(--border-color)]">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Importar da Amazon</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        placeholder="Link do produto..."
                                        value={amazonUrl}
                                        onChange={(e) => setAmazonUrl(e.target.value)}
                                        className="flex-1 bg-transparent border-b border-gray-300 focus:border-black outline-none py-1 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleFetchFromAmazon}
                                        disabled={isFetchingAmazon}
                                        className="bg-black text-white text-xs font-bold px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-50 transition-all"
                                    >
                                        {isFetchingAmazon ? '...' : 'Puxar'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-[var(--border-color)]">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 block">Buscar por ISBN</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="ISBN13..."
                                        value={isbnToSearch}
                                        onChange={(e) => setIsbnToSearch(e.target.value)}
                                        className="flex-1 bg-transparent border-b border-gray-300 focus:border-black outline-none py-1 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleFetchFromGoogleBooks}
                                        disabled={isFetchingGoogle}
                                        className="bg-black text-white text-xs font-bold px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-50 transition-all"
                                    >
                                        {isFetchingGoogle ? '...' : 'Puxar'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="pt-4 border-t border-[var(--border-color)]">
                            <ImageUpload
                                label="Capa do Livro"
                                folder="covers"
                                onUploadComplete={handleUploadComplete}
                                initialUrl={formData.coverUrl}
                            />
                        </div>

                        {/* Core Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Título</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full border border-[var(--border-color)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Autor(es)</label>
                                <input
                                    type="text"
                                    name="authors"
                                    value={formData.authors}
                                    onChange={handleChange}
                                    className="w-full border border-[var(--border-color)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Sinopse</label>
                                <textarea
                                    name="synopsis"
                                    value={formData.synopsis}
                                    onChange={handleChange}
                                    className="w-full border border-[var(--border-color)] rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="w-full border border-[var(--border-color)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black/5 text-gray-500 bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">ISBN13</label>
                                    <input
                                        type="text"
                                        name="isbn13"
                                        value={formData.isbn13 || ''}
                                        onChange={handleChange}
                                        className="w-full border border-[var(--border-color)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors">Cancelar</button>
                        <button type="submit" className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all">
                            {isCreating ? 'Adicionar Livro' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookModal;
