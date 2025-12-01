'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

/**
 * Helper to delete file
 */
function deleteFile(fileUrl: string) {
    try {
        if (!fileUrl) return;

        // Remove leading slash if present
        const relativePath = fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl;
        const fullPath = path.join(process.cwd(), 'public', relativePath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
}

/**
 * Get all catalogs
 */
export async function getCatalogs() {
    try {
        const catalogs = await prisma.catalog.findMany({
            orderBy: { order: 'asc' },
        });
        return { success: true, data: catalogs };
    } catch (error) {
        console.error('Error fetching catalogs:', error);
        return { success: false, error: 'Kataloglar yüklenirken hata oluştu' };
    }
}

/**
 * Create a new catalog
 */
export async function createCatalog(data: {
    name: string;
    fileUrl: string;
    coverImage?: string | null;
    isActive?: boolean;
}) {
    try {
        const catalog = await prisma.catalog.create({
            data: {
                name: data.name,
                fileUrl: data.fileUrl,
                coverImage: data.coverImage,
                isActive: data.isActive ?? true,
            },
        });

        revalidatePath('/');
        revalidatePath('/admin/catalogs');

        return { success: true, data: catalog };
    } catch (error) {
        console.error('Error creating catalog:', error);
        return { success: false, error: 'Katalog oluşturulurken hata oluştu' };
    }
}

/**
 * Update a catalog
 */
export async function updateCatalog(
    id: string,
    data: {
        name: string;
        fileUrl: string;
        coverImage?: string | null;
        isActive?: boolean;
    }
) {
    try {
        const currentCatalog = await prisma.catalog.findUnique({
            where: { id },
        });

        if (!currentCatalog) {
            return { success: false, error: 'Katalog bulunamadı' };
        }

        // Handle file deletion if changed
        if (currentCatalog.fileUrl !== data.fileUrl) {
            deleteFile(currentCatalog.fileUrl);
        }

        // Handle cover image deletion if changed
        if (currentCatalog.coverImage && data.coverImage !== undefined && currentCatalog.coverImage !== data.coverImage) {
            deleteFile(currentCatalog.coverImage);
        }

        const catalog = await prisma.catalog.update({
            where: { id },
            data: {
                name: data.name,
                fileUrl: data.fileUrl,
                coverImage: data.coverImage,
                isActive: data.isActive,
            },
        });

        revalidatePath('/');
        revalidatePath('/admin/catalogs');

        return { success: true, data: catalog };
    } catch (error) {
        console.error('Error updating catalog:', error);
        return { success: false, error: 'Katalog güncellenirken hata oluştu' };
    }
}

/**
 * Delete a catalog
 */
export async function deleteCatalog(id: string) {
    try {
        const catalog = await prisma.catalog.findUnique({
            where: { id },
        });

        if (!catalog) {
            return { success: false, error: 'Katalog bulunamadı' };
        }

        // Delete files
        deleteFile(catalog.fileUrl);
        if (catalog.coverImage) {
            deleteFile(catalog.coverImage);
        }

        await prisma.catalog.delete({
            where: { id },
        });

        revalidatePath('/');
        revalidatePath('/admin/catalogs');

        return { success: true };
    } catch (error) {
        console.error('Error deleting catalog:', error);
        return { success: false, error: 'Katalog silinirken hata oluştu' };
    }
}
