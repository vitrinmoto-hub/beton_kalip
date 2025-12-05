'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Get site settings
 */
export async function getSettings() {
    try {
        let settings = await prisma.settings.findUnique({
            where: { id: 'default' },
        });

        // Create default settings if not exists
        if (!settings) {
            settings = await prisma.settings.create({
                data: {
                    id: 'default',
                    siteName: 'Beton Kalıp Firması',
                },
            });
        }

        return { success: true, data: settings };
    } catch (error) {
        console.error('Error fetching settings:', error);
        return { success: false, error: 'Ayarlar yüklenirken hata oluştu' };
    }
}

/**
 * Update site settings
 */
export async function updateSettings(data: {
    siteName?: string;
    logo?: string;
    favicon?: string;
    phone?: string;
    email?: string;
    address?: string;
    whatsapp?: string;
    mapEmbedUrl?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    heroImage?: string;
    primaryColor?: string;
    secondaryColor?: string;
    aboutTitle?: string;
    aboutContent?: string;
    aboutImage?: string;
    missionTitle?: string;
    missionContent?: string;
    visionTitle?: string;
    visionContent?: string;
    homeMetaTitle?: string;
    homeMetaDescription?: string;
    copyrightText?: string;
}) {
    try {
        const settings = await prisma.settings.upsert({
            where: { id: 'default' },
            update: data,
            create: {
                id: 'default',
                ...data,
            },
        });

        revalidatePath('/', 'layout');
        revalidatePath('/about');
        revalidatePath('/contact');
        revalidatePath('/admin/settings');

        return { success: true, data: settings };
    } catch (error) {
        console.error('Error updating settings:', error);
        return { success: false, error: 'Ayarlar güncellenirken hata oluştu' };
    }
}
