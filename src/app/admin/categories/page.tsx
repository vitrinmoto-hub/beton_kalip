'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Package, X, Upload } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/actions/category-actions';
import { useRouter } from 'next/navigation';

type Category = {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    slug: string;
    _count: {
        products: number;
    };
};

export default function CategoriesPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setIsLoading(true);
        const result = await getCategories();
        if (result.success && result.data) {
            setCategories(result.data as Category[]);
        }
        setIsLoading(false);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setImageUrl(data.url);
            } else {
                setUploadError(data.error || 'Yükleme başarısız');
            }
        } catch (error) {
            setUploadError('Dosya yüklenirken bir hata oluştu');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const data = {
            ...formData,
            image: imageUrl || null,
        };

        const result = editingId
            ? await updateCategory(editingId, data)
            : await createCategory(data);

        if (result.success) {
            setFormData({ name: '', description: '' });
            setImageUrl('');
            setEditingId(null);
            loadCategories();
            router.refresh();
        } else {
            setError(result.error || 'Bir hata oluştu');
        }
        setIsSubmitting(false);
    };

    const handleEdit = (category: Category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            description: category.description || '',
        });
        setImageUrl(category.image || '');
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '' });
        setImageUrl('');
        setError('');
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" kategorisini silmek istediğinizden emin misiniz?`)) {
            return;
        }

        const result = await deleteCategory(id);
        if (result.success) {
            loadCategories();
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Kategoriler</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-[var(--color-dark)]">
                                Mevcut Kategoriler ({categories.length})
                            </h3>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
                        ) : categories.length === 0 ? (
                            <div className="p-12 text-center">
                                <Package className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-500">Henüz kategori eklenmemiş</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4 flex-1">
                                                {category.image && (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-[var(--color-dark)] mb-1">
                                                        {category.name}
                                                    </h4>
                                                    {category.description && (
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {category.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Package size={14} />
                                                            {category._count.products} ürün
                                                        </span>
                                                        <span className="text-gray-400">
                                                            /{category.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Düzenle"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
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
                                {editingId ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
                            </h3>
                            {editingId && (
                                <button
                                    onClick={handleCancelEdit}
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
                                    Kategori Adı *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Örn: Duvar Kalıpları"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Kategori hakkında kısa açıklama..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kapak Görseli
                                </label>
                                <div className="space-y-3">
                                    <label className="cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--color-primary)] transition-colors">
                                            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                                            <p className="text-sm text-gray-600 font-medium">
                                                {isUploading ? 'Yükleniyor...' : 'Görsel Seç'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                PNG, JPG, WebP (Max 5MB)<br />
                                                Önerilen: 800x600px
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={isUploading}
                                            className="hidden"
                                        />
                                    </label>

                                    {uploadError && (
                                        <p className="text-sm text-red-600">{uploadError}</p>
                                    )}

                                    {imageUrl && (
                                        <div className="relative">
                                            <img
                                                src={imageUrl}
                                                alt="Kategori görseli"
                                                className="w-full h-32 object-cover rounded-md border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImageUrl('')}
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
                                        : 'Kategori Ekle'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
