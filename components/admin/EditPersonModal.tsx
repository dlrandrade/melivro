import React, { useState, useEffect } from 'react';
import { NotablePerson } from '../../types';
import ImageUpload from './ImageUpload';

interface EditPersonModalProps {
    personToEdit?: NotablePerson;
    onClose: () => void;
    onAddPerson: (person: Omit<NotablePerson, 'id'>) => void;
    onUpdatePerson: (person: NotablePerson) => void;
}

const EditPersonModal: React.FC<EditPersonModalProps> = ({ personToEdit, onClose, onAddPerson, onUpdatePerson }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        bio: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (personToEdit) {
            setFormData(personToEdit);
        } else {
            setFormData({ name: '', slug: '', bio: '', imageUrl: '' });
        }
    }, [personToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUploadComplete = (url: string) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            slug: (formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')),
            country: personToEdit?.country || 'N/A',
            tags: personToEdit?.tags || []
        };

        if (personToEdit) {
            onUpdatePerson({ ...personToEdit, ...finalData });
        } else {
            onAddPerson(finalData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative border border-[var(--border-color)]">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors text-2xl font-light">&times;</button>
                <form onSubmit={handleSubmit} className="p-10">
                    <h2 className="font-serif text-3xl font-bold mb-8 tracking-tighter">{personToEdit ? 'Editar' : 'Adicionar'} Personalidade</h2>

                    <div className="space-y-6">
                        <ImageUpload
                            label="Foto da Personalidade"
                            folder="people"
                            onUploadComplete={handleUploadComplete}
                            initialUrl={formData.imageUrl}
                        />

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ex: Bill Gates"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-[var(--border-color)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Biografia Curta</label>
                                <textarea
                                    name="bio"
                                    placeholder="Uma breve descrição sobre a pessoa..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full border border-[var(--border-color)] rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-black/5"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL)</label>
                                <input
                                    type="text"
                                    name="slug"
                                    placeholder="Ex: bill-gates"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="w-full border border-[var(--border-color)] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black/5 text-gray-500 bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors">Cancelar</button>
                        <button type="submit" className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all">
                            {personToEdit ? 'Salvar Alterações' : 'Criar Personalidade'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPersonModal;
