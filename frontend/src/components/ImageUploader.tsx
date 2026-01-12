/**
 * @file    : ImageUploader.tsx
 * @purpose : 圖片上傳組件 - 拖放與點擊上傳
 */

'use client';

import { useState, useCallback, DragEvent, ChangeEvent } from 'react';

interface ImageUploaderProps {
    onImageSelect: (base64: string, mimeType: string) => void;
    isLoading?: boolean;
}

export default function ImageUploader({ onImageSelect, isLoading }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const processFile = useCallback((file: File) => {
        // 驗證檔案類型
        const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('不支援的檔案類型，請上傳 PNG、JPEG 或 WebP');
            return;
        }

        // 驗證檔案大小 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('檔案過大，請上傳小於 5MB 的圖片');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setPreview(dataUrl);

            // 提取 Base64 (移除 data:image/xxx;base64, 前綴)
            const base64 = dataUrl.split(',')[1];
            onImageSelect(base64, file.type);
        };
        reader.readAsDataURL(file);
    }, [onImageSelect]);

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleClear = () => {
        setPreview(null);
    };

    return (
        <div className="w-full">
            {!preview ? (
                <label
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
            flex flex-col items-center justify-center
            w-full h-64 cursor-pointer
            border-2 border-dashed rounded-lg
            transition-all duration-300
            ${isDragging
                            ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10'
                            : 'border-[var(--neon-purple)]/50 hover:border-[var(--neon-purple)]'
                        }
          `}
                >
                    <div className="flex flex-col items-center gap-4 p-6">
                        <svg
                            className={`w-16 h-16 ${isDragging ? 'text-[var(--neon-cyan)]' : 'text-[var(--neon-purple)]'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <div className="text-center">
                            <p className="text-lg text-[var(--text-primary)]">
                                拖放圖片至此處
                            </p>
                            <p className="text-sm text-[var(--text-muted)] mt-1">
                                或點擊選擇檔案 (PNG, JPEG, WebP)
                            </p>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            ) : (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-lg neon-border"
                    />
                    {!isLoading && (
                        <button
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-2 bg-[var(--bg-dark)]/80 rounded-full hover:bg-[var(--neon-magenta)]/20 transition-colors"
                        >
                            <svg className="w-5 h-5 text-[var(--neon-magenta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-void)]/70 rounded-lg">
                            <div className="w-12 h-12 border-4 border-[var(--neon-cyan)] border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
