'use server';

import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export type PostFormData = {
    title: string;
    excerpt?: string;
    content: string;
    categoryId?: string;
    image?: string;
    status: 'Yayında' | 'Taslak' | 'Arşiv';
    publishedAt?: string;
    metaTitle?: string;
    metaDescription?: string;
    authorId?: string; // Optional for now
};

/**
 * Get all posts with optional filters
 */
export async function getPosts(filters?: {
    status?: string;
    categoryId?: string;
    take?: number;
}) {
    try {
        const posts = await prisma.post.findMany({
            where: {
                ...(filters?.status === 'Yayında' && { published: true }),
                ...(filters?.status === 'Taslak' && { published: false }),
                ...(filters?.categoryId && { categoryId: filters.categoryId }),
            },
            include: {
                category: true,
            },
            orderBy: { createdAt: 'desc' },
            ...(filters?.take && { take: filters.take }),
        });
        return { success: true, data: posts };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return { success: false, error: 'Yazılar yüklenirken hata oluştu' };
    }
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                category: true,
            },
        });

        if (!post) {
            return { success: false, error: 'Yazı bulunamadı' };
        }

        return { success: true, data: post };
    } catch (error) {
        console.error('Error fetching post:', error);
        return { success: false, error: 'Yazı yüklenirken hata oluştu' };
    }
}

/**
 * Get post by ID (for admin)
 */
export async function getPostById(id: string) {
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });

        if (!post) {
            return { success: false, error: 'Yazı bulunamadı' };
        }

        return { success: true, data: post };
    } catch (error) {
        console.error('Error fetching post:', error);
        return { success: false, error: 'Yazı yüklenirken hata oluştu' };
    }
}

/**
 * Create a new post
 */
export async function createPost(data: PostFormData) {
    try {
        const slug = generateSlug(data.title);

        // Check if slug already exists
        const existingPost = await prisma.post.findUnique({
            where: { slug },
        });

        if (existingPost) {
            return { success: false, error: 'Bu başlıkta bir yazı zaten mevcut' };
        }

        const post = await prisma.post.create({
            data: {
                title: data.title,
                slug,
                excerpt: data.excerpt,
                content: data.content,
                image: data.image,
                published: data.status === 'Yayında',
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.status === 'Yayında' ? new Date() : null),
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                categoryId: data.categoryId || null,
                authorId: data.authorId || 'Admin', // Default to Admin for now
            },
        });

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        revalidatePath('/');

        return { success: true, data: post };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: 'Yazı oluşturulurken hata oluştu' };
    }
}

/**
 * Update a post
 */
export async function updatePost(id: string, data: PostFormData) {
    try {
        // Generate new slug if title changed
        const currentPost = await prisma.post.findUnique({
            where: { id },
        });

        if (!currentPost) {
            return { success: false, error: 'Yazı bulunamadı' };
        }

        let slug = currentPost.slug;
        if (data.title !== currentPost.title) {
            slug = generateSlug(data.title);

            // Check if new slug already exists
            const existingPost = await prisma.post.findUnique({
                where: { slug },
            });

            if (existingPost && existingPost.id !== id) {
                return { success: false, error: 'Bu başlıkta başka bir yazı zaten mevcut' };
            }
        }

        const post = await prisma.post.update({
            where: { id },
            data: {
                title: data.title,
                slug,
                excerpt: data.excerpt,
                content: data.content,
                image: data.image,
                published: data.status === 'Yayında',
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : currentPost.publishedAt,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                categoryId: data.categoryId || null,
            },
        });

        revalidatePath('/blog');
        revalidatePath(`/blog/${slug}`);
        revalidatePath('/admin/blog');
        revalidatePath('/');

        return { success: true, data: post };
    } catch (error) {
        console.error('Error updating post:', error);
        return { success: false, error: 'Yazı güncellenirken hata oluştu' };
    }
}

/**
 * Delete a post
 */
export async function deletePost(id: string) {
    try {
        await prisma.post.delete({
            where: { id },
        });

        revalidatePath('/blog');
        revalidatePath('/admin/blog');
        revalidatePath('/');

        return { success: true };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: 'Yazı silinirken hata oluştu' };
    }
}
