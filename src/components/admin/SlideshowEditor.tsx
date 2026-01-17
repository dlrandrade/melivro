import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { ImageUpload } from './ImageUpload';

interface Slide {
    id?: string;
    image_url: string;
    title: string;
    subtitle: string;
    button_text: string;
    button_link: string;
    order: number;
}

const SlideshowEditor: React.FC = () => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSlideshowEnabled, setIsSlideshowEnabled] = useState(true);

    useEffect(() => {
        fetchSlides();
        fetchSettings();
    }, []);

    const fetchSlides = async () => {
        const { data, error } = await supabase
            .from('home_slides')
            .select('*')
            .order('order');
        if (!error && data) setSlides(data);
        setIsLoading(false);
    };

    const fetchSettings = async () => {
        const { data, error } = await supabase
            .from('site_settings')
            .select('value')
            .eq('key', 'slideshow_enabled')
            .single();
        
        if (!error && data) {
            setIsSlideshowEnabled(data.value === true);
        }
    };

    const toggleSlideshow = async () => {
        const newValue = !isSlideshowEnabled;
        const { error } = await supabase
            .from('site_settings')
            .upsert({ key: 'slideshow_enabled', value: newValue });
        
        if (!error) {
            setIsSlideshowEnabled(newValue);
        }
    };

    const handleSave = async (slide: Slide) => {
        if (slide.id) {
            await supabase.from('home_slides').update(slide).eq('id', slide.id);
        } else {
            await supabase.from('home_slides').insert([slide]);
        }
        setEditingSlide(null);
        fetchSlides();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Deseja realmente excluir este slide?')) {
            await supabase.from('home_slides').delete().eq('id', id);
            fetchSlides();
        }
    };

    if (isLoading) return <div className="p-4 text-gray-500">Carregando slides...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-[var(--border-color)]">
                <div>
                    <h3 className="text-xl font-bold">Configuração do Slideshow</h3>
                    <p className="text-sm text-gray-500">Ative ou desative o carrossel na página inicial</p>
                </div>
                <button
                    onClick={toggleSlideshow}
                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                        isSlideshowEnabled 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                >
                    {isSlideshowEnabled ? '● Slideshow Ativado' : '○ Slideshow Desativado'}
                </button>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Slides</h3>
                <button
                    onClick={() => setEditingSlide({ image_url: '', title: '', subtitle: '', button_text: '', button_link: '', order: slides.length + 1 })}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                    + Novo Slide
                </button>
            </div>

            {/* Lista de slides */}
            <div className="grid gap-4">
                {slides.map(slide => (
                    <div key={slide.id} className="bg-white border border-[var(--border-color)] rounded-lg p-4 flex gap-4 items-center">
                        <img src={slide.image_url} alt={slide.title} className="w-32 h-20 object-cover rounded" />
                        <div className="flex-1">
                            <h4 className="font-bold">{slide.title}</h4>
                            <p className="text-gray-500 text-sm">{slide.subtitle}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingSlide(slide)} className="text-blue-600 hover:underline text-sm">Editar</button>
                            <button onClick={() => handleDelete(slide.id!)} className="text-red-600 hover:underline text-sm">Excluir</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de edição */}
            {editingSlide && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-6">{editingSlide.id ? 'Editar' : 'Criar'} Slide</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(editingSlide); }} className="space-y-4">
                            <ImageUpload
                                label="Imagem de Fundo"
                                folder="covers"
                                onUploadComplete={(url) => setEditingSlide({ ...editingSlide, image_url: url })}
                                initialUrl={editingSlide.image_url}
                            />
                            <div>
                                <label className="block text-sm font-bold mb-1">Título</label>
                                <input
                                    type="text"
                                    value={editingSlide.title}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                                    className="w-full border rounded-lg p-3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Subtítulo</label>
                                <input
                                    type="text"
                                    value={editingSlide.subtitle}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                                    className="w-full border rounded-lg p-3"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Texto do Botão</label>
                                    <input
                                        type="text"
                                        value={editingSlide.button_text}
                                        onChange={(e) => setEditingSlide({ ...editingSlide, button_text: e.target.value })}
                                        className="w-full border rounded-lg p-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Link do Botão</label>
                                    <input
                                        type="text"
                                        value={editingSlide.button_link}
                                        onChange={(e) => setEditingSlide({ ...editingSlide, button_link: e.target.value })}
                                        className="w-full border rounded-lg p-3"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Ordem</label>
                                <input
                                    type="number"
                                    value={editingSlide.order}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, order: parseInt(e.target.value) })}
                                    className="w-24 border rounded-lg p-3"
                                />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setEditingSlide(null)} className="text-gray-500">Cancelar</button>
                                <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-bold">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlideshowEditor;
