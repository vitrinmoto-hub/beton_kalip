'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Get all references (admin)
 */
export async function getReferences() {
    try {
        const references = await prisma.reference.findMany({
            orderBy: { order: 'asc' },
        });
        return { success: true, data: references };
    } catch (error) {
        console.error('Error fetching references:', error);
        return { success: false, error: 'Referanslar yüklenirken hata oluştu' };
    }
}

/**
 * Get active references (frontend)
 */
export async function getActiveReferences() {
    try {
        const references = await prisma.reference.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
        });
        return { success: true, data: references };
    } catch (error) {
        console.error('Error fetching active references:', error);
        return { success: false, error: 'Referanslar yüklenirken hata oluştu' };
    }
}

/**
 * Create a new reference
 */
export async function createReference(data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    order?: number;
    isActive?: boolean;
}) {
    try {
        const reference = await prisma.reference.create({
            data: {
                name: data.name,
                description: data.description,
                logo: data.logo,
                website: data.website,
                order: data.order || 0,
                isActive: data.isActive !== false,
            },
        });

        revalidatePath('/references');
        revalidatePath('/admin/references');

        return { success: true, data: reference };
    } catch (error) {
        console.error('Error creating reference:', error);
        return { success: false, error: 'Referans oluşturulurken hata oluştu' };
    }
}

/**
 * Update a reference
 */
export async function updateReference(
    id: string,
    data: {
        name?: string;
        description?: string;
        logo?: string;
        website?: string;
        order?: number;
        isActive?: boolean;
    }
) {
    try {
        const reference = await prisma.reference.update({
            where: { id },
            data,
        });

        revalidatePath('/references');
        revalidatePath('/admin/references');

        return { success: true, data: reference };
    } catch (error) {
        console.error('Error updating reference:', error);
        return { success: false, error: 'Referans güncellenirken hata oluştu' };
    }
}

/**
 * Delete a reference
 */
export async function deleteReference(id: string) {
    try {
        await prisma.reference.delete({
            where: { id },
        });

        revalidatePath('/references');
        revalidatePath('/admin/references');

        return { success: true };
    } catch (error) {
        console.error('Error deleting reference:', error);
        return { success: false, error: 'Referans silinirken hata oluştu' };
    }
}
