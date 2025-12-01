import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '@/actions/blog-actions';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import 'react-quill-new/dist/quill.snow.css';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: post } = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="pb-20 dark:bg-[var(--color-dark)]">
            <div className="container mx-auto px-4 py-8">
                <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-[var(--color-primary)] mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    Blog'a Dön
                </Link>

                <article className="max-w-4xl mx-auto">
                    <div className="h-[400px] bg-gray-200 dark:bg-gray-800 rounded-lg mb-8 flex items-center justify-center text-gray-400 dark:text-gray-500 text-xl overflow-hidden">
                        {post.image ? (
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        ) : (
                            'Kapak Görseli'
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>
                                {post.publishedAt
                                    ? format(new Date(post.publishedAt), 'd MMMM yyyy', { locale: tr })
                                    : format(new Date(post.createdAt), 'd MMMM yyyy', { locale: tr })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{post.authorId || 'Admin'}</span>
                        </div>
                        {post.category && (
                            <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full font-medium">
                                {post.category.name}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold mb-8 text-[var(--color-dark)] dark:text-white leading-tight">
                        {post.title}
                    </h1>

                    <div
                        className="ql-editor prose prose-lg max-w-none text-gray-700 dark:text-gray-300 dark:prose-headings:text-white dark:prose-strong:text-white"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    ></div>
                </article>
            </div>
        </div>
    );
}
