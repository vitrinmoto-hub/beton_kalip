import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getPostById } from '@/actions/blog-actions';
import { BlogPostForm } from '../../BlogPostForm';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getPostById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const post = result.data;

    return (
        <div>
            <BlogPostForm post={post} />
        </div>
    );
}
