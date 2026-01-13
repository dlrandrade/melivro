import React, { useState, useRef } from 'react';
import { supabase } from '../../supabase';

interface ImageUploadProps {
    label: string;
    folder: 'covers' | 'people';
    onUploadComplete: (url: string) => void;
    initialUrl?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, folder, onUploadComplete, initialUrl }) => {
    const [preview, setPreview] = useState(initialUrl || '');
    const [inputUrl, setInputUrl] = useState(initialUrl || '');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setInputUrl(url);
        setPreview(url);
        onUploadComplete(url);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);
        setIsUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images') // Ensure you have a bucket named 'images'
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            setInputUrl(publicUrl);
            setPreview(publicUrl);
            onUploadComplete(publicUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Falha no upload da imagem. Verifique se o bucket "images" existe no Supabase.');
        } finally {
            setIsUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">{label}</label>
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    {preview && (
                        <div className="relative group">
                            <img
                                src={preview}
                                alt="Preview"
                                className={`object-cover border border-[var(--border-color)] ${folder === 'people' ? 'w-20 h-20 rounded-full' : 'w-16 h-24 rounded'}`}
                                onError={() => setPreview('')}
                            />
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                disabled={isUploading}
                                className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                {isUploading ? 'Enviando...' : 'Upload Arquivo'}
                            </button>
                            <span className="text-gray-400 text-xs self-center">ou</span>
                        </div>
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={handleUrlChange}
                            placeholder="Cole a URL da imagem..."
                            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm bg-white"
                        />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
};

export default ImageUpload;
