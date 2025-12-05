'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, X, Copy, Check } from 'lucide-react';
import { getUploadedFiles } from '@/actions/media-actions';

type MediaFile = {
    url: string;
    fileName: string;
};

export default function MediaPage() {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

    // Load existing media files
    useEffect(() => {
        loadMediaFiles();
    }, []);

    const loadMediaFiles = async () => {
        const result = await getUploadedFiles();
        if (result.success && result.data) {
            setMediaFiles(result.data);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        setUploadError('');

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();
                if (data.success) {
                    return { url: data.url, fileName: data.fileName };
                } else {
                    throw new Error(data.error || 'Yükleme başarısız');
                }
            });

            const uploadedFiles = await Promise.all(uploadPromises);
            setMediaFiles([...uploadedFiles, ...mediaFiles]);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Dosya yüklenirken bir hata oluştu');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCopyUrl = (url: string) => {
        const fullUrl = `${window.location.origin}${url}`;

        // Try modern API first
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(fullUrl)
                .then(() => {
                    setCopiedUrl(url);
                    setTimeout(() => setCopiedUrl(null), 2000);
                })
                .catch((err) => {
                    console.error('Clipboard API failed', err);
                    fallbackCopy(fullUrl, url);
                });
        } else {
            // Fallback for HTTP
            fallbackCopy(fullUrl, url);
        }
    };

    const fallbackCopy = (text: string, urlKey: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Ensure it's not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopiedUrl(urlKey);
                setTimeout(() => setCopiedUrl(null), 2000);
            } else {
                alert('Kopyalama başarısız oldu. Lütfen manuel olarak kopyalayın: ' + text);
            }
        } catch (err) {
            console.error('Fallback copy failed', err);
            alert('Kopyalama başarısız oldu. Lütfen manuel olarak kopyalayın: ' + text);
        }

        document.body.removeChild(textArea);
    };

    const handleDelete = (url: string) => {
        if (confirm('Bu görseli silmek istediğinizden emin misiniz?')) {
            setMediaFiles(mediaFiles.filter(file => file.url !== url));
            // In a real implementation, this would also delete from server
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Medya Galeri</h2>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">Yeni Görsel Yükle</h3>
                <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-[var(--color-primary)] transition-colors">
                        <Upload className="mx-auto mb-3 text-gray-400" size={48} />
                        <p className="text-lg text-gray-600 font-medium mb-1">
                            {isUploading ? 'Yükleniyor...' : 'Görsel Seç'}
                        </p>
                        <p className="text-sm text-gray-400">
                            Birden fazla görsel seçebilirsiniz
                        </p>
                        <p className="text-sm text-gray-400">
                            PNG, JPG, WebP, GIF (Max 5MB)
                        </p>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                    />
                </label>

                {uploadError && (
                    <p className="text-sm text-red-600 mt-4">{uploadError}</p>
                )}
            </div>

            {/* Media Grid */}
            {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaFiles.map((file, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group"
                        >
                            <div className="relative aspect-square bg-gray-100">
                                <img
                                    src={file.url}
                                    alt={file.fileName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => handleCopyUrl(file.url)}
                                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                        title="URL'yi Kopyala"
                                    >
                                        {copiedUrl === file.url ? (
                                            <Check size={18} className="text-green-600" />
                                        ) : (
                                            <Copy size={18} className="text-gray-700" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(file.url)}
                                        className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                                        title="Sil"
                                    >
                                        <X size={18} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-xs text-gray-600 truncate">{file.fileName}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                        <ImageIcon size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--color-dark)] mb-2">Henüz Görsel Yok</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Yukarıdaki yükleme alanını kullanarak görsel yükleyebilirsiniz.
                    </p>
                </div>
            )}
        </div>
    );
}
