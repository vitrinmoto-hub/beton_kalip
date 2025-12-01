'use server';

import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

/**
 * Helper to delete image file
 */
function deleteImageFile(imageUrl: string) {
    try {
        if (!imageUrl) return;

        // Remove leading slash if present
        const relativePath = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
        const fullPath = path.join(process.cwd(), 'public', relativePath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error('Error deleting image file:', error);
    }
}

/**
 * Get all categories
 */
export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
        return { success: true, data: categories };
    } catch (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: 'Kategoriler yüklenirken hata oluştu' };
    }
}

/**
 * Create a new category
 */
export async function createCategory(data: {
    name: string;
    description?: string;
    image?: string | null;
}) {
    try {
        const slug = generateSlug(data.name);

        const existingCategory = await prisma.category.findUnique({
            where: { slug },
        });

        if (existingCategory) {
            return { success: false, error: 'Bu isimde bir kategori zaten mevcut' };
        }

        const category = await prisma.category.create({
            data: {
                ...data,
                slug,
            },
        });

        revalidatePath('/admin/products');

        return { success: true, data: category };
    } catch (error) {
        console.error('Error creating category:', error);
        return { success: false, error: 'Kategori oluşturulurken hata oluştu' };
    }
}

/**
 * Update a category
 */
export async function updateCategory(
    id: string,
    data: {
        name: string;
        description?: string;
        image?: string | null;
    }
) {
    try {
        const currentCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!currentCategory) {
            return { success: false, error: 'Kategori bulunamadı' };
        }

        // Handle image deletion if image changed
        if (currentCategory.image && data.image !== undefined && currentCategory.image !== data.image) {
            deleteImageFile(currentCategory.image);
        }

        let slug = currentCategory.slug;
        if (data.name !== currentCategory.name) {
            slug = generateSlug(data.name);

            const existingCategory = await prisma.category.findUnique({
                where: { slug },
            });

            if (existingCategory && existingCategory.id !== id) {
                return { success: false, error: 'Bu isimde başka bir kategori zaten mevcut' };
            }
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...data,
                slug,
            },
        });

        revalidatePath('/admin/products');
        revalidatePath('/admin/categories');

        return { success: true, data: category };
    } catch (error) {
        console.error('Error updating category:', error);
        return { success: false, error: 'Kategori güncellenirken hata oluştu' };
    }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
    try {
        // Check if category has products
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });

        if (!category) {
            return { success: false, error: 'Kategori bulunamadı' };
        }

        if (category._count.products > 0) {
            return {
                success: false,
                error: `Bu kategori ${category._count.products} ürün tarafından kullanılıyor. Önce ürünleri başka kategoriye taşıyın.`,
            };
        }

        // Delete image file if exists
        if (category.image) {
            deleteImageFile(category.image);
        }

        await prisma.category.delete({
            where: { id },
        });

        revalidatePath('/admin/products');
        revalidatePath('/admin/categories');

        return { success: true };
    } catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: 'Kategori silinirken hata oluştu' };
    }
}
