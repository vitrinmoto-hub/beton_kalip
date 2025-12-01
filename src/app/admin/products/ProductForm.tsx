'use client';

import { useState, FormEvent } from 'react';
import { Save, Upload, X } from 'lucide-react';
import { createProduct, updateProduct, type ProductFormData } from '@/actions/product-actions';
import { useRouter } from 'next/navigation';

type Category = {
    id: string;
    name: string;
};

type Product = {
    id: string;
    name: string;
    description: string | null;
    content: string | null;
    categoryId: string;
    dimensions: string | null;
    weight: string | null;
    material: string | null;
    videoUrl: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    isFeatured: boolean;
    images: { url: string }[];
};

interface ProductFormProps {
    categories: Category[];
    product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>(
        product?.images.map((img) => img.url) || []
    );
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

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
                    return data.url;
                } else {
                    throw new Error(data.error || 'Yükleme başarısız');
                }
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            setImageUrls([...imageUrls, ...uploadedUrls]);
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : 'Dosya yüklenirken bir hata oluştu');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setImageUrls(imageUrls.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data: ProductFormData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            content: formData.get('content') as string,
            categoryId: formData.get('categoryId') as string,
            dimensions: formData.get('dimensions') as string,
            weight: formData.get('weight') as string,
            material: formData.get('material') as string,
            videoUrl: formData.get('videoUrl') as string,
            metaTitle: formData.get('metaTitle') as string,
            metaDescription: formData.get('metaDescription') as string,
            isFeatured: formData.get('isFeatured') === 'on',
            images: imageUrls,
        };

        const result = product
            ? await updateProduct(product.id, data)
            : await createProduct(data);

        if (result.success) {
            router.push('/admin/products');
            router.refresh();
        } else {
            alert(result.error || 'Bir hata oluştu');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-end mb-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <Save size={20} />
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                            Temel Bilgiler
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ürün Adı *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    defaultValue={product?.name}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kısa Açıklama
                                </label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={product?.description || ''}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Detaylı İçerik
                                </label>
                                <textarea
                                    name="content"
                                    rows={8}
                                    defaultValue={product?.content || ''}
                                    placeholder="Ürün hakkında detaylı bilgi..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                            Teknik Özellikler
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ölçüler
                                </label>
                                <input
                                    type="text"
                                    name="dimensions"
                                    defaultValue={product?.dimensions || ''}
                                    placeholder="Örn: 200x100 cm"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ağırlık
                                </label>
                                <input
                                    type="text"
                                    name="weight"
                                    defaultValue={product?.weight || ''}
                                    placeholder="Örn: 50 kg"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Malzeme
                                </label>
                                <input
                                    type="text"
                                    name="material"
                                    defaultValue={product?.material || ''}
                                    placeholder="Örn: Çelik + Kompozit"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    YouTube Video URL
                                </label>
                                <input
                                    type="text"
                                    name="videoUrl"
                                    defaultValue={product?.videoUrl || ''}
                                    placeholder="Örn: https://www.youtube.com/watch?v=..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">SEO</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Başlık
                                </label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    defaultValue={product?.metaTitle || ''}
                                    placeholder="SEO için özel başlık (boş bırakılırsa ürün adı kullanılır)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Açıklama
                                </label>
                                <textarea
                                    name="metaDescription"
                                    rows={3}
                                    defaultValue={product?.metaDescription || ''}
                                    placeholder="SEO için özel açıklama (boş bırakılırsa kısa açıklama kullanılır)"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-prim ary)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                            Durum & Kategori
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategori *
                                </label>
                                <select
                                    name="categoryId"
                                    required
                                    defaultValue={product?.categoryId}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                >
                                    <option value="">Kategori Seçin</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        defaultChecked={product?.isFeatured}
                                        className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)]"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Öne Çıkan Ürün
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 mt-1 ml-6">
                                    Ana sayfada gösterilir
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                            Görseller
                        </h3>

                        <div className="space-y-4 mb-4">
                            <label className="cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--color-primary)] transition-colors">
                                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                                    <p className="text-sm text-gray-600 font-medium">
                                        {isUploading ? 'Yükleniyor...' : 'Görsel Seç'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Birden fazla görsel seçebilirsiniz
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        PNG, JPG, WebP (Max 5MB)
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
                                <p className="text-sm text-red-600">{uploadError}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {imageUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className="relative aspect-square bg-gray-100 rounded-md border border-gray-200 overflow-hidden group"
                                >
                                    <img
                                        src={url}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {imageUrls.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                Henüz görsel eklenmedi
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
