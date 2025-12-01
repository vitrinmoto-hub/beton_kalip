'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getContactMessages() {
    try {
        const messages = await prisma.contactForm.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { success: true, data: messages };
    } catch (error) {
        console.error('Error fetching contact messages:', error);
        return { success: false, error: 'Mesajlar yüklenirken bir hata oluştu.' };
    }
}

export async function markAsRead(id: string) {
    try {
        await prisma.contactForm.update({
            where: { id },
            data: { isRead: true },
        });

        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error('Error marking message as read:', error);
        return { success: false, error: 'İşlem başarısız oldu.' };
    }
}

export async function deleteMessage(id: string) {
    try {
        await prisma.contactForm.delete({
            where: { id },
        });

        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error('Error deleting message:', error);
        return { success: false, error: 'Mesaj silinemedi.' };
    }
}
