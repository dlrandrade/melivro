
import React, { useState } from 'react';
import { NotablePerson } from '../../types';
import EditPersonModal from './EditPersonModal';

interface ManagePeopleProps {
    allPeople: NotablePerson[];
    onAddPerson: (person: Omit<NotablePerson, 'id'>) => void;
    onUpdatePerson: (person: NotablePerson) => void;
    onDeletePerson: (personId: string) => void;
}

const ManagePeople: React.FC<ManagePeopleProps> = ({ allPeople, onAddPerson, onUpdatePerson, onDeletePerson }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [personToEdit, setPersonToEdit] = useState<NotablePerson | undefined>(undefined);

    const handleOpenModalForEdit = (person: NotablePerson) => {
        setPersonToEdit(person);
        setIsModalOpen(true);
    };

    const handleOpenModalForNew = () => {
        setPersonToEdit(undefined);
        setIsModalOpen(true);
    };

    const handleDelete = (personId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
            onDeletePerson(personId);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg border border-[var(--border-color)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl">Gerenciar Personalidades</h2>
                <button onClick={handleOpenModalForNew} className="bg-black text-white font-bold text-sm px-4 py-2 rounded-md hover:bg-gray-800">
                    Adicionar Nova
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Nome</th>
                            <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs">Bio</th>
                            <th className="px-6 py-3 font-bold text-gray-500 uppercase tracking-wider text-xs text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                        {allPeople.map(person => (
                            <tr key={person.id}>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <img src={person.imageUrl} alt={person.name} className="w-10 h-10 rounded-full object-cover"/>
                                    <span className="font-bold">{person.name}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 line-clamp-2">{person.bio}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleOpenModalForEdit(person)} className="font-bold text-black hover:underline mr-4">Editar</button>
                                    <button onClick={() => handleDelete(person.id)} className="font-bold text-red-600 hover:underline">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <EditPersonModal
                    personToEdit={personToEdit}
                    onClose={() => setIsModalOpen(false)}
                    onAddPerson={onAddPerson}
                    onUpdatePerson={onUpdatePerson}
                />
            )}
        </div>
    );
};

export default ManagePeople;
