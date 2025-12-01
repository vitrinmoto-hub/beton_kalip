'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Upload, ExternalLink } from 'lucide-react';
import { getSlides, createSlide, updateSlide, deleteSlide } from '@/actions/slider-actions';
import { useRouter } from 'next/navigation';

type HeroSlide = {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    ctaText: string | null;
    ctaLink: string | null;
    order: number;
    isActive: boolean;
};

export default function SliderPage() {
    const router = useRouter();
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        image: '',
        ctaText: '',
        ctaLink: '',
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        loadSlides();
    }, []);

    const loadSlides = async () => {
        setIsLoading(true);
        const result = await getSlides();
        if (result.success && result.data) {
            setSlides(result.data as HeroSlide[]);
        }
        setIsLoading(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        setError('');

        try {
            const fd = new FormData();
            fd.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: fd,
            });

            const data = await response.json();

            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.url }));
            } else {
                setError(data.error || 'Görsel yüklenirken hata oluştu');
            }
        } catch (error) {
            setError('Görsel yüklenirken bir hata oluştu');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!formData.image) {
            setError('Lütfen bir görsel yükleyin');
            setIsSubmitting(false);
            return;
        }

        const result = editingId
            ? await updateSlide(editingId, formData)
            : await createSlide(formData);

        if (result.success) {
            setFormData({ title: '', subtitle: '', image: '', ctaText: '', ctaLink: '', order: 0, isActive: true });
            setEditingId(null);
            loadSlides();
            router.refresh();
        } else {
            setError(result.error || 'Bir hata oluştu');
        }
        setIsSubmitting(false);
    };

    const handleEdit = (slide: HeroSlide) => {
        setEditingId(slide.id);
        setFormData({
            title: slide.title,
            subtitle: slide.subtitle || '',
            image: slide.image,
            ctaText: slide.ctaText || '',
            ctaLink: slide.ctaLink || '',
            order: slide.order,
            isActive: slide.isActive,
        });
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', subtitle: '', image: '', ctaText: '', ctaLink: '', order: 0, isActive: true });
        setError('');
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu slaytı silmek istediğinizden emin misiniz?')) {
            return;
        }

        const result = await deleteSlide(id);
        if (result.success) {
            loadSlides();
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Slider Yönetimi</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Slides List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-[var(--color-dark)]">
                                Mevcut Slaytlar ({slides.length})
                            </h3>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
                        ) : slides.length === 0 ? (
                            <div className="p-12 text-center">
                                <ImageIcon className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-500">Henüz slayt eklenmemiş</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {slides.map((slide) => (
                                    <div
                                        key={slide.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!slide.isActive ? 'opacity-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-32 h-20 flex-shrink-0 bg-gray-100 rounded border border-gray-200 overflow-hidden relative">
                                                <img
                                                    src={slide.image}
                                                    alt={slide.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-[var(--color-dark)] mb-1 flex items-center gap-2">
                                                            {slide.title}
                                                            {!slide.isActive && (
                                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                                                    Pasif
                                                                </span>
                                                            )}
                                                        </h4>
                                                        {slide.subtitle && (
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {slide.subtitle}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>Sıra: {slide.order}</span>
                                                            {slide.ctaLink && (
                                                                <a
                                                                    href={slide.ctaLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                                                >
                                                                    <ExternalLink size={12} />
                                                                    Link: {slide.ctaText || 'Tıkla'}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleEdit(slide)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Düzenle"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(slide.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Sil"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
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
                                {editingId ? 'Slaytı Düzenle' : 'Yeni Slayt'}
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
                                    Başlık *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Ana başlık"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alt Başlık
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Kısa açıklama..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Arkaplan Görseli *
                                </label>
                                {formData.image && (
                                    <div className="mb-2 p-2 border border-gray-200 rounded bg-gray-50">
                                        <img src={formData.image} alt="Preview" className="w-full h-32 object-cover rounded" />
                                    </div>
                                )}
                                <label className="cursor-pointer block">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--color-primary)] transition-colors">
                                        <Upload className="mx-auto mb-1 text-gray-400" size={24} />
                                        <p className="text-xs text-gray-600">
                                            {isUploadingImage ? 'Yükleniyor...' : 'Görsel Seç'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            1920x1080px önerilir
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploadingImage}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Buton Metni
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ctaText}
                                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        placeholder="Örn: İncele"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Buton Linki
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ctaLink}
                                        onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                        placeholder="/products"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sıra
                                </label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-4 h-4 text-[var(--color-primary)] border-gray-300 rounded focus:ring-[var(--color-primary)]"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                                </label>
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
                                        : 'Slayt Ekle'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
