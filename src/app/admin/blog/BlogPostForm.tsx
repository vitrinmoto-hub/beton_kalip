'use client';

import { useState, FormEvent } from 'react';
import { Save, Upload, Calendar, ArrowLeft, X } from 'lucide-react';
import { createPost, updatePost, type PostFormData } from '@/actions/blog-actions';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { RichTextEditor } from '@/components/RichTextEditor';

type Post = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    image: string | null;
    published: boolean;
    publishedAt: Date | null;
    metaTitle: string | null;
    metaDescription: string | null;
    categoryId: string | null;
};

interface BlogPostFormProps {
    post?: Post;
}

export function BlogPostForm({ post }: BlogPostFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUrl, setImageUrl] = useState(post?.image || '');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [content, setContent] = useState(post?.content || '');

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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const status = formData.get('status') as 'Yayında' | 'Taslak' | 'Arşiv';

        const data: PostFormData = {
            title: formData.get('title') as string,
            excerpt: formData.get('excerpt') as string,
            content: content, // Use state value instead of form data
            categoryId: formData.get('categoryId') as string,
            image: imageUrl,
            status: status,
            publishedAt: formData.get('publishedAt') as string,
            metaTitle: formData.get('metaTitle') as string,
            metaDescription: formData.get('metaDescription') as string,
        };

        const result = post
            ? await updatePost(post.id, data)
            : await createPost(data);

        if (result.success) {
            router.push('/admin/blog');
            router.refresh();
        } else {
            alert(result.error || 'Bir hata oluştu');
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-3xl font-bold text-[var(--color-dark)]">
                        {post ? 'Yazıyı Düzenle' : 'Yeni Yazı Ekle'}
                    </h2>
                </div>
                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    defaultValue={post?.title}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-lg font-medium"
                                    placeholder="Yazı başlığını girin..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kısa Özet (Excerpt)</label>
                                <textarea
                                    name="excerpt"
                                    rows={3}
                                    defaultValue={post?.excerpt || ''}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    placeholder="Liste görünümünde çıkacak kısa açıklama..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Yazı içeriğini oluşturun..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">Yayın Ayarları</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Durum</label>
                                <select
                                    name="status"
                                    defaultValue={post ? (post.published ? 'Yayında' : 'Taslak') : 'Yayında'}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                >
                                    <option value="Yayında">Yayında</option>
                                    <option value="Taslak">Taslak</option>
                                    <option value="Arşiv">Arşiv</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Yayın Tarihi</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="date"
                                        name="publishedAt"
                                        defaultValue={post?.publishedAt ? format(new Date(post.publishedAt), 'yyyy-MM-dd') : ''}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                            </div>
                            {/* Categories would go here if we had a separate category fetch */}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">Kapak Görseli</h3>
                        <div className="space-y-3">
                            <div className="flex flex-col gap-3">
                                <label className="cursor-pointer">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--color-primary)] transition-colors">
                                        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                                        <p className="text-sm text-gray-600 font-medium">
                                            {isUploading ? 'Yükleniyor...' : 'Görsel Seç'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            PNG, JPG, WebP (Max 5MB)
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
                            </div>

                            {imageUrl && (
                                <div className="space-y-2">
                                    <div className="relative aspect-video bg-gray-100 rounded-md border border-gray-200 overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt="Kapak"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl('')}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">SEO Ayarları</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Başlık</label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    defaultValue={post?.metaTitle || ''}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meta Açıklama</label>
                                <textarea
                                    name="metaDescription"
                                    rows={3}
                                    defaultValue={post?.metaDescription || ''}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
