
import React, { useState } from 'react';
import { Book } from '../../types';
import EditBookModal from './EditBookModal';

interface ManageBooksProps {
    allBooks: Book[];
    onAddBook: (book: Omit<Book, 'id' | 'citationCount'>) => void;
    onUpdateBook: (book: Book) => void;
    onDeleteBook: (bookId: string) => void;
}

const ManageBooks: React.FC<ManageBooksProps> = ({ allBooks, onAddBook, onUpdateBook, onDeleteBook }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookToEdit, setBookToEdit] = useState<Book | undefined>(undefined);

    const handleOpenModalForEdit = (book: Book) => {
        setBookToEdit(book);
        setIsModalOpen(true);
    };
    
    const handleOpenModalForNew = () => {
        setBookToEdit(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = (bookId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este livro?')) {
            onDeleteBook(bookId);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">Gerenciar Livros</h2>
                <button 
                    onClick={handleOpenModalForNew} 
                    className="bg-black text-white font-bold text-sm px-4 py-2 rounded-md hover:bg-gray-800"
                >
                    Adicionar Novo Livro
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Título</th>
                            <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Autor</th>
                            <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {allBooks.map(book => (
                            <tr key={book.id}>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-contain"/>
                                    <span className="font-bold">{book.title}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{book.authors}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleOpenModalForEdit(book)} className="font-bold text-black hover:underline mr-4">Editar</button>
                                    <button onClick={() => handleDelete(book.id)} className="font-bold text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {isModalOpen && (
                <EditBookModal
                    bookToEdit={bookToEdit}
                    onClose={() => setIsModalOpen(false)}
                    onUpdateBook={onUpdateBook}
                    onAddBook={onAddBook}
                />
            )}
        </div>
    );
};

export default ManageBooks;