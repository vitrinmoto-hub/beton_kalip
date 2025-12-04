import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { getPosts } from '@/actions/blog-actions';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Force dynamic rendering to avoid database connection during build
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    const { data: posts } = await getPosts({ status: 'Yayında' });

    return (
        <div className="pb-20 dark:bg-[var(--color-dark)]">
            {/* Page Header */}
            <div className="bg-[var(--color-dark)] text-white py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Sektörden haberler, ipuçları ve teknik bilgiler.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts && posts.length > 0 ? (
                        posts.map((post: { id: string; title: string; slug: string; excerpt: string | null; image: string | null; publishedAt: Date | null; createdAt: Date; authorId: string | null }) => (
                            <article key={post.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                    {post.image ? (
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                    ) : (
                                        'Görsel'
                                    )}
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>
                                                {post.publishedAt
                                                    ? format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: tr })
                                                    : format(new Date(post.createdAt), 'd MMMM yyyy', { locale: tr })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User size={14} />
                                            <span>{post.authorId || 'Admin'}</span>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 text-[var(--color-dark)] dark:text-white hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary)] transition-colors">
                                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="mt-auto text-[var(--color-primary)] font-semibold hover:underline inline-block"
                                    >
                                        Devamını Oku &rarr;
                                    </Link>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                            Henüz blog yazısı eklenmemiş.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
