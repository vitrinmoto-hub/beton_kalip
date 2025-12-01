import Link from "next/link";
import { getPosts } from "@/actions/blog-actions";
import { Calendar, ArrowRight } from "lucide-react";

export default async function LatestPosts() {
    const result = await getPosts({ status: 'Yayında', take: 3 });
    const posts = (result.success && result.data) ? result.data : [];

    if (posts.length === 0) return null;

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-dark)]">
                        Blog & Haberler
                    </h2>
                    <p className="text-white font-bold text-lg">
                        Sektörden haberler ve güncel gelişmeler
                    </p>
                </div>
                <Link
                    href="/blog"
                    className="hidden md:flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:underline"
                >
                    Tümünü Gör
                    <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >
                        <div className="h-48 overflow-hidden bg-gray-100">
                            {post.image ? (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Görsel Yok
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Calendar size={14} />
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('tr-TR')}
                                {post.category && (
                                    <>
                                        <span>•</span>
                                        <span className="text-[var(--color-primary)]">{post.category.name}</span>
                                    </>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-[var(--color-dark)] mb-3 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                {post.title}
                            </h3>
                            <p className="text-gray-600 line-clamp-3 mb-4">
                                {post.excerpt}
                            </p>
                            <span className="text-[var(--color-primary)] font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                Devamını Oku <ArrowRight size={14} />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 text-center md:hidden">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-[var(--color-primary)] font-semibold hover:underline"
                >
                    Tümünü Gör
                    <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}
