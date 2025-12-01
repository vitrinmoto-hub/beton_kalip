'use server';

import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export type ProductFormData = {
    name: string;
    description?: string;
    content?: string;
    categoryId: string;
    dimensions?: string;
    weight?: string;
    material?: string;
    metaTitle?: string;
    metaDescription?: string;
    isFeatured?: boolean;
    images?: string[];
    videoUrl?: string;
};

/**
 * Get all products with optional filters
 */
export async function getProducts(filters?: {
    categoryId?: string;
    isFeatured?: boolean;
}) {
    try {
        const products = await prisma.product.findMany({
            where: {
                ...(filters?.categoryId && { categoryId: filters.categoryId }),
                ...(filters?.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
            },
            include: {
                category: true,
                images: true,
            },
            orderBy: [
                { isFeatured: 'desc' },
                { order: 'asc' },
                { createdAt: 'desc' },
            ],
        });
        return { success: true, data: products };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, error: 'Ürünler yüklenirken hata oluştu' };
    }
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(limit = 3) {
    try {
        const products = await prisma.product.findMany({
            where: { isFeatured: true },
            include: {
                category: true,
                images: true,
            },
            take: limit,
            orderBy: { order: 'asc' },
        });
        return { success: true, data: products };
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return { success: false, error: 'Öne çıkan ürünler yüklenirken hata oluştu' };
    }
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
                images: true,
            },
        });

        if (!product) {
            return { success: false, error: 'Ürün bulunamadı' };
        }

        return { success: true, data: product };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, error: 'Ürün yüklenirken hata oluştu' };
    }
}

/**
 * Get product by ID (for admin)
 */
export async function getProductById(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: true,
            },
        });

        if (!product) {
            return { success: false, error: 'Ürün bulunamadı' };
        }

        return { success: true, data: product };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { success: false, error: 'Ürün yüklenirken hata oluştu' };
    }
}

/**
 * Create a new product
 */
export async function createProduct(data: ProductFormData) {
    try {
        const slug = generateSlug(data.name);

        // Check if slug already exists
        const existingProduct = await prisma.product.findUnique({
            where: { slug },
        });

        if (existingProduct) {
            return { success: false, error: 'Bu isimde bir ürün zaten mevcut' };
        }

        const { images, ...productData } = data;

        const product = await prisma.product.create({
            data: {
                ...productData,
                slug,
                images: {
                    create: images?.map((url) => ({ url })) || [],
                },
            },
            include: {
                images: true,
                category: true,
            },
        });

        revalidatePath('/products');
        revalidatePath('/admin/products');
        revalidatePath('/');

        return { success: true, data: product };
    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: 'Ürün oluşturulurken hata oluştu' };
    }
}

/**
 * Update a product
 */
export async function updateProduct(id: string, data: ProductFormData) {
    try {
        // Generate new slug if name changed
        const currentProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!currentProduct) {
            return { success: false, error: 'Ürün bulunamadı' };
        }

        let slug = currentProduct.slug;
        if (data.name !== currentProduct.name) {
            slug = generateSlug(data.name);

            // Check if new slug already exists
            const existingProduct = await prisma.product.findUnique({
                where: { slug },
            });

            if (existingProduct && existingProduct.id !== id) {
                return { success: false, error: 'Bu isimde başka bir ürün zaten mevcut' };
            }
        }

        const { images, ...productData } = data;

        // Delete existing images and create new ones
        await prisma.productImage.deleteMany({
            where: { productId: id },
        });

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...productData,
                slug,
                images: {
                    create: images?.map((url) => ({ url })) || [],
                },
            },
            include: {
                images: true,
                category: true,
            },
        });

        revalidatePath('/products');
        revalidatePath(`/products/${slug}`);
        revalidatePath('/admin/products');
        revalidatePath('/');

        return { success: true, data: product };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: 'Ürün güncellenirken hata oluştu' };
    }
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        });

        revalidatePath('/products');
        revalidatePath('/admin/products');
        revalidatePath('/');

        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Ürün silinirken hata oluştu' };
    }
}
