
import React, { useState } from 'react';
import { NotablePerson } from '../../types';

interface HomepageEditorProps {
    allPeople: NotablePerson[];
}

const HomepageEditor: React.FC<HomepageEditorProps> = ({ allPeople }) => {
    const [selectedPersonId, setSelectedPersonId] = useState(allPeople[0]?.id || '');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');

    const handleSave = () => {
        const selectedPerson = allPeople.find(p => p.id === selectedPersonId);
        if (!selectedPerson) return;

        const settings = {
            personId: selectedPersonId,
            title: title || `Leia como ${selectedPerson.name}`,
            subtitle: subtitle || selectedPerson.bio
        };
        // In a real app, you'd save this to a config file or database
        console.log('Saving Homepage Settings:', settings);
        alert('Configurações da página inicial salvas! (Ver console para detalhes)');
    };
    
    return (
        <div className="bg-white p-8 rounded-lg border border-[var(--border-color)] max-w-2xl mx-auto">
            <h2 className="font-bold text-xl mb-6">Editar Header da Página Inicial</h2>
            <div className="space-y-6">
                <div>
                    <label htmlFor="person-select" className="block text-sm font-bold text-gray-700 mb-2">
                        Personalidade em Destaque
                    </label>
                    <select
                        id="person-select"
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={selectedPersonId}
                        onChange={(e) => setSelectedPersonId(e.target.value)}
                    >
                        {allPeople.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="title-override" className="block text-sm font-bold text-gray-700 mb-2">
                        Título Customizado (Opcional)
                    </label>
                    <input
                        type="text"
                        id="title-override"
                        placeholder="Ex: Leia como..."
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="subtitle-override" className="block text-sm font-bold text-gray-700 mb-2">
                        Subtítulo Customizado (Opcional)
                    </label>
                    <textarea
                        id="subtitle-override"
                        placeholder="Bio curta..."
                        className="w-full border border-gray-300 rounded-md p-2 h-24"
                        value={subtitle}
                        onChange={(e) => setSubtitle(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors"
                >
                    Salvar Alterações
                </button>
            </div>
        </div>
    );
};

export default HomepageEditor;