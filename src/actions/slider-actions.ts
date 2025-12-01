'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Get all hero slides (admin)
 */
export async function getSlides() {
    try {
        const slides = await prisma.heroSlide.findMany({
            orderBy: { order: 'asc' },
        });
        return { success: true, data: slides };
    } catch (error) {
        console.error('Error fetching slides:', error);
        return { success: false, error: 'Slide\'lar yüklenirken hata oluştu' };
    }
}

/**
 * Get active hero slides (frontend)
 */
export async function getActiveSlides() {
    try {
        const slides = await prisma.heroSlide.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });
        return { success: true, data: slides };
    } catch (error) {
        console.error('Error fetching active slides:', error);
        return { success: false, error: 'Slide\'lar yüklenirken hata oluştu' };
    }
}

/**
 * Create a new hero slide
 */
export async function createSlide(data: {
    title: string;
    subtitle?: string;
    image: string;
    ctaText?: string;
    ctaLink?: string;
    order?: number;
    isActive?: boolean;
}) {
    try {
        const slide = await prisma.heroSlide.create({
            data: {
                title: data.title,
                subtitle: data.subtitle,
                image: data.image,
                ctaText: data.ctaText,
                ctaLink: data.ctaLink,
                order: data.order || 0,
                isActive: data.isActive !== false,
            },
        });

        revalidatePath('/');
        revalidatePath('/admin/slider');

        return { success: true, data: slide };
    } catch (error) {
        console.error('Error creating slide:', error);
        return { success: false, error: 'Slide oluşturulurken hata oluştu' };
    }
}

/**
 * Update a hero slide
 */
export async function updateSlide(
    id: string,
    data: {
        title?: string;
        subtitle?: string;
        image?: string;
        ctaText?: string;
        ctaLink?: string;
        order?: number;
        isActive?: boolean;
    }
) {
    try {
        const slide = await prisma.heroSlide.update({
            where: { id },
            data,
        });

        revalidatePath('/');
        revalidatePath('/admin/slider');

        return { success: true, data: slide };
    } catch (error) {
        console.error('Error updating slide:', error);
        return { success: false, error: 'Slide güncellenirken hata oluştu' };
    }
}

/**
 * Delete a hero slide
 */
export async function deleteSlide(id: string) {
    try {
        await prisma.heroSlide.delete({
            where: { id },
        });

        revalidatePath('/');
        revalidatePath('/admin/slider');

        return { success: true };
    } catch (error) {
        console.error('Error deleting slide:', error);
        return { success: false, error: 'Slide silinirken hata oluştu' };
    }
}
