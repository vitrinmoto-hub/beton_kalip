import { Package, FileText, Layers, MessageSquare } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

// Force dynamic rendering to avoid database connection during build
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const [
        productCount,
        postCount,
        categoryCount,
        unreadMessageCount,
        recentProducts
    ] = await Promise.all([
        prisma.product.count(),
        prisma.post.count(),
        prisma.category.count(),
        prisma.contactForm.count({ where: { isRead: false } }),
        prisma.product.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        })
    ]);

    return (
        <div>
            <h2 className="text-3xl font-bold text-[var(--color-dark)] mb-8">Genel Bakış</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Toplam Ürün</h3>
                        <div className="p-2 bg-orange-100 text-[var(--color-primary)] rounded-lg">
                            <Package size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-dark)]">{productCount}</p>
                    <span className="text-gray-400 text-sm font-medium">Sistemdeki ürünler</span>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Blog Yazıları</h3>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <FileText size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-dark)]">{postCount}</p>
                    <span className="text-gray-400 text-sm font-medium">Yayınlanan yazılar</span>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Kategoriler</h3>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Layers size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-dark)]">{categoryCount}</p>
                    <span className="text-gray-400 text-sm font-medium">Aktif kategori</span>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-500 font-medium">Yeni Mesajlar</h3>
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <MessageSquare size={24} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold text-[var(--color-dark)]">{unreadMessageCount}</p>
                    <span className="text-gray-400 text-sm font-medium">Okunmamış</span>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-[var(--color-dark)] mb-6">Son Eklenen Ürünler</h3>
                <div className="space-y-4">
                    {recentProducts.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Henüz aktivite yok.</p>
                    ) : (
                        recentProducts.map((product: { id: string; name: string; createdAt: Date }) => (
                            <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="font-medium text-[var(--color-dark)]">Yeni ürün eklendi: "{product.name}"</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDistanceToNow(new Date(product.createdAt), { addSuffix: true, locale: tr })}
                                        </p>
                                    </div>
                                </div>
                                <Link href={`/admin/products/${product.id}/edit`} className="text-sm text-[var(--color-primary)] font-medium hover:underline">
                                    Düzenle
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
