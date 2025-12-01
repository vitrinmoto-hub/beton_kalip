'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, FileText, X, Upload, Eye } from 'lucide-react';
import { getCatalogs, createCatalog, updateCatalog, deleteCatalog } from '@/actions/catalog-actions';
import { useRouter } from 'next/navigation';

type Catalog = {
    id: string;
    name: string;
    fileUrl: string;
    coverImage: string | null;
    isActive: boolean;
};

export default function CatalogsPage() {
    const router = useRouter();
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    // Form states
    const [name, setName] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [isUploadingFile, setIsUploadingFile] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);

    useEffect(() => {
        loadCatalogs();
    }, []);

    const loadCatalogs = async () => {
        setIsLoading(true);
        const result = await getCatalogs();
        if (result.success && result.data) {
            setCatalogs(result.data as Catalog[]);
        }
        setIsLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (type === 'pdf') setIsUploadingFile(true);
        else setIsUploadingCover(true);
        setError(''); // Clear previous errors

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                if (type === 'pdf') {
                    setFileUrl(data.url);
                    console.log('PDF uploaded successfully:', data.url);
                } else {
                    setCoverImage(data.url);
                    console.log('Cover image uploaded successfully:', data.url);
                }
            } else {
                const errorMsg = data.error || 'Yükleme başarısız';
                setError(errorMsg);
                console.error('Upload failed:', errorMsg);
            }
        } catch (error) {
            const errorMsg = 'Dosya yüklenirken bir hata oluştu';
            setError(errorMsg);
            console.error('Upload error:', error);
        } finally {
            if (type === 'pdf') setIsUploadingFile(false);
            else setIsUploadingCover(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!fileUrl) {
            setError('Lütfen bir PDF dosyası yükleyin');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const data = {
            name,
            fileUrl,
            coverImage: coverImage || null,
            isActive: true,
        };

        const result = editingId
            ? await updateCatalog(editingId, data)
            : await createCatalog(data);

        if (result.success) {
            resetForm();
            loadCatalogs();
            router.refresh();
        } else {
            setError(result.error || 'Bir hata oluştu');
        }
        setIsSubmitting(false);
    };

    const handleEdit = (catalog: Catalog) => {
        setEditingId(catalog.id);
        setName(catalog.name);
        setFileUrl(catalog.fileUrl);
        setCoverImage(catalog.coverImage || '');
        setError('');
    };

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setFileUrl('');
        setCoverImage('');
        setError('');
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" kataloğunu silmek istediğinizden emin misiniz?`)) {
            return;
        }

        const result = await deleteCatalog(id);
        if (result.success) {
            loadCatalogs();
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Katalog Yönetimi</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Catalog List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-[var(--color-dark)]">
                                Mevcut Kataloglar ({catalogs.length})
                            </h3>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
                        ) : catalogs.length === 0 ? (
                            <div className="p-12 text-center">
                                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-500">Henüz katalog eklenmemiş</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {catalogs.map((catalog) => (
                                    <div
                                        key={catalog.id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4 flex-1">
                                                <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center shrink-0">
                                                    {catalog.coverImage ? (
                                                        <img
                                                            src={catalog.coverImage}
                                                            alt={catalog.name}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <FileText className="text-gray-400" size={24} />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-[var(--color-dark)] mb-1">
                                                        {catalog.name}
                                                    </h4>
                                                    <a
                                                        href={catalog.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                                    >
                                                        <Eye size={14} />
                                                        PDF'i Görüntüle
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleEdit(catalog)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(catalog.id, catalog.name)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Add/Edit Form */}
                <div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-[var(--color-dark)]">
                                {editingId ? 'Kataloğu Düzenle' : 'Yeni Katalog'}
                            </h3>
                            {editingId && (
                                <button
                                    onClick={resetForm}
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                    title="İptal"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Katalog Adı *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Örn: 2024 Ürün Kataloğu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    PDF Dosyası *
                                </label>
                                <div className="space-y-2">
                                    <label className="cursor-pointer block">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--color-primary)] transition-colors">
                                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                                            <p className="text-sm text-gray-600 font-medium">
                                                {isUploadingFile ? 'Yükleniyor...' : 'PDF Seç'}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept=".pdf,application/pdf"
                                            onChange={(e) => handleFileUpload(e, 'pdf')}
                                            disabled={isUploadingFile}
                                            className="hidden"
                                        />
                                    </label>
                                    {fileUrl && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                                            <FileText size={16} />
                                            <span className="truncate flex-1">Dosya yüklendi</span>
                                            <button
                                                type="button"
                                                onClick={() => setFileUrl('')}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kapak Görseli (Opsiyonel)
                                </label>
                                <div className="space-y-2">
                                    <label className="cursor-pointer block">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--color-primary)] transition-colors">
                                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                                            <p className="text-sm text-gray-600 font-medium">
                                                {isUploadingCover ? 'Yükleniyor...' : 'Görsel Seç'}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'image')}
                                            disabled={isUploadingCover}
                                            className="hidden"
                                        />
                                    </label>
                                    {coverImage && (
                                        <div className="relative">
                                            <img
                                                src={coverImage}
                                                alt="Kapak"
                                                className="w-full h-32 object-cover rounded-md border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setCoverImage('')}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Plus size={20} />
                                {isSubmitting
                                    ? 'Kaydediliyor...'
                                    : editingId
                                        ? 'Güncelle'
                                        : 'Katalog Ekle'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
