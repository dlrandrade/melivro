import React, { useState } from 'react';

interface ImageUploadProps {
    label: string;
    folder: 'covers' | 'people';
    onUploadComplete: (url: string) => void;
    initialUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ label, folder, onUploadComplete, initialUrl }) => {
    const [preview, setPreview] = useState(initialUrl || '');
    const [inputUrl, setInputUrl] = useState(initialUrl || '');

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setInputUrl(url);
        setPreview(url);
        onUploadComplete(url);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">{label}</label>
            <div className="flex items-center gap-4">
                {preview && (
                    <img
                        src={preview}
                        alt="Preview"
                        className={`object-cover border border-[var(--border-color)] ${folder === 'people' ? 'w-16 h-16 rounded-full' : 'w-12 h-18 rounded'}`}
                        onError={() => setPreview('')}
                    />
                )}
                <input
                    type="text"
                    value={inputUrl}
                    onChange={handleUrlChange}
                    placeholder="Cole a URL da imagem..."
                    className="flex-1 px-4 py-3 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm"
                />
            </div>
        </div>
    );
};

export default ImageUpload;
