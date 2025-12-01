'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Plus, Edit2, Trash2, Building2, X, Upload, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { getReferences, createReference, updateReference, deleteReference } from '@/actions/reference-actions';
import { useRouter } from 'next/navigation';

type Reference = {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    website: string | null;
    order: number;
    isActive: boolean;
};

export default function ReferencesPage() {
    const router = useRouter();
    const [references, setReferences] = useState<Reference[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo: '',
        website: '',
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        loadReferences();
    }, []);

    const loadReferences = async () => {
        setIsLoading(true);
        const result = await getReferences();
        if (result.success && result.data) {
            setReferences(result.data as Reference[]);
        }
        setIsLoading(false);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLogo(true);
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
                setFormData(prev => ({ ...prev, logo: data.url }));
            } else {
                setError(data.error || 'Logo yüklenirken hata oluştu');
            }
        } catch (error) {
            setError('Logo yüklenirken bir hata oluştu');
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const result = editingId
            ? await updateReference(editingId, formData)
            : await createReference(formData);

        if (result.success) {
            setFormData({ name: '', description: '', logo: '', website: '', order: 0, isActive: true });
            setEditingId(null);
            loadReferences();
            router.refresh();
        } else {
            setError(result.error || 'Bir hata oluştu');
        }
        setIsSubmitting(false);
    };

    const handleEdit = (reference: Reference) => {
        setEditingId(reference.id);
        setFormData({
            name: reference.name,
            description: reference.description || '',
            logo: reference.logo || '',
            website: reference.website || '',
            order: reference.order,
            isActive: reference.isActive,
        });
        setError('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', logo: '', website: '', order: 0, isActive: true });
        setError('');
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" referansını silmek istediğinizden emin misiniz?`)) {
            return;
        }

        const result = await deleteReference(id);
        if (result.success) {
            loadReferences();
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Referanslar</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* References List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold text-[var(--color-dark)]">
                                Mevcut Referanslar ({references.length})
                            </h3>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center text-gray-500">Yükleniyor...</div>
                        ) : references.length === 0 ? (
                            <div className="p-12 text-center">
                                <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-500">Henüz referans eklenmemiş</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {references.map((reference) => (
                                    <div
                                        key={reference.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!reference.isActive ? 'opacity-50' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {reference.logo ? (
                                                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                                                    <img
                                                        src={reference.logo}
                                                        alt={reference.name}
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                                    <Building2 size={32} className="text-gray-400" />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-[var(--color-dark)] mb-1 flex items-center gap-2">
                                                            {reference.name}
                                                            {!reference.isActive && (
                                                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                                                    Pasif
                                                                </span>
                                                            )}
                                                        </h4>
                                                        {reference.description && (
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {reference.description}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>Sıra: {reference.order}</span>
                                                            {reference.website && (
                                                                <a
                                                                    href={reference.website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                                                >
                                                                    <ExternalLink size={12} />
                                                                    Web Sitesi
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <button
                                                            onClick={() => handleEdit(reference)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                            title="Düzenle"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(reference.id, reference.name)}
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
                                {editingId ? 'Referansı Düzenle' : 'Yeni Referans'}
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
                                    Şirket/Proje Adı *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Örn: ABC İnşaat"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Açıklama
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Kısa açıklama..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Logo
                                </label>
                                {formData.logo && (
                                    <div className="mb-2 p-2 border border-gray-200 rounded bg-gray-50 inline-block">
                                        <img src={formData.logo} alt="Logo" className="h-16 object-contain" />
                                    </div>
                                )}
                                <label className="cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[var(--color-primary)] transition-colors">
                                        <Upload className="mx-auto mb-1 text-gray-400" size={24} />
                                        <p className="text-xs text-gray-600">
                                            {isUploadingLogo ? 'Yükleniyor...' : 'Logo Yükle'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            💡 İdeal ölçüler: 150x150px veya 200x200px
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        disabled={isUploadingLogo}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Web Sitesi
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="https://..."
                                />
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
                                        : 'Referans Ekle'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
