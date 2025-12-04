import Link from 'next/link';
import { Plus, Edit, Eye, Search, Filter } from 'lucide-react';
import { getPosts } from '@/actions/blog-actions';
import { DeletePostButton } from './DeletePostButton';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Force dynamic rendering to avoid database connection during build
export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
    const result = await getPosts();
    const posts = (result.success && result.data) ? result.data : [];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Blog Yönetimi</h2>
                <Link
                    href="/admin/blog/new"
                    className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Yazı Ekle
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Yazı ara..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 text-gray-600 hover:bg-gray-50">
                    <Filter size={20} />
                    Filtrele
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Başlık</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Kategori</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Yazar</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Tarih</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Durum</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    Henüz blog yazısı eklenmemiş.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post: { id: string; title: string; slug: string; createdAt: Date; published: boolean; authorId: string | null; category: { id: string; name: string } | null }) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-[var(--color-dark)]">{post.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{post.category?.name || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{post.authorId || 'Admin'}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {format(new Date(post.createdAt), 'd MMMM yyyy', { locale: tr })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {post.published ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/blog/${post.slug}`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors" title="Önizle" target="_blank">
                                                <Eye size={18} />
                                            </Link>
                                            <Link href={`/admin/blog/${post.id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Düzenle">
                                                <Edit size={18} />
                                            </Link>
                                            <DeletePostButton postId={post.id} postTitle={post.title} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
