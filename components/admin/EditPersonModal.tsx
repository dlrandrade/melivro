
import React, { useState, useEffect } from 'react';
import { NotablePerson } from '../../types';

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
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (personToEdit) {
            setFormData(personToEdit);
            setImagePreview(personToEdit.imageUrl);
        } else {
            setFormData({ name: '', slug: '', bio: '', imageUrl: '' });
            setImagePreview(null);
        }
    }, [personToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            // In a real app, you'd upload the file and get back a URL.
            // For this mock, we'll just use the object URL.
            setFormData(prev => ({...prev, imageUrl: previewUrl}));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            country: 'N/A', // Default values
            tags: []
        };

        if (personToEdit) {
            onUpdatePerson({ ...personToEdit, ...finalData });
        } else {
            onAddPerson(finalData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">&times;</button>
                <form onSubmit={handleSubmit} className="p-8">
                    <h2 className="font-bold text-xl mb-6">{personToEdit ? 'Editar' : 'Adicionar'} Personalidade</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-gray-500">Foto</span>
                                )}
                            </div>
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-700 mb-2">
                                    Foto da Personalidade
                                </label>
                                <input id="imageUrl" name="imageUrl" type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                                <p className="text-xs text-gray-500 mt-1">Ou cole uma URL abaixo.</p>
                            </div>
                        </div>

                        <input type="text" name="imageUrl" placeholder="URL da Imagem" value={formData.imageUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 text-sm" />
                        <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2" required />
                        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 h-24" required />
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

export default EditPersonModal;
