'use server';

import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function getUploadedFiles() {
    try {
        const uploadsDir = join(process.cwd(), 'public', 'uploads');

        if (!existsSync(uploadsDir)) {
            return { success: true, data: [] };
        }

        const files = await readdir(uploadsDir);

        // Filter only image files
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const imageFiles = files
            .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
            .map(fileName => ({
                url: `/api/uploads/${fileName}`,
                fileName: fileName
            }))
            .sort((a, b) => {
                // Sort by timestamp in filename (newest first)
                const timestampA = parseInt(a.fileName.split('-')[0]) || 0;
                const timestampB = parseInt(b.fileName.split('-')[0]) || 0;
                return timestampB - timestampA;
            });

        return { success: true, data: imageFiles };
    } catch (error) {
        console.error('Error reading uploads folder:', error);
        return { success: false, error: 'Dosyalar yüklenirken hata oluştu', data: [] };
    }
}

export async function deleteUploadedFile(fileName: string) {
    try {
        // Security: Prevent directory traversal
        if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
            return { success: false, error: 'Geçersiz dosya adı' };
        }

        const filePath = join(process.cwd(), 'public', 'uploads', fileName);

        if (existsSync(filePath)) {
            await unlink(filePath);
            return { success: true };
        } else {
            return { success: false, error: 'Dosya bulunamadı' };
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        return { success: false, error: 'Dosya silinirken hata oluştu' };
    }
}
