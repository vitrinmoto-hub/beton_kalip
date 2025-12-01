'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type ContactFormData = {
    name: string;
    email: string;
    phone?: string;
    message: string;
};

export async function submitContactForm(data: ContactFormData) {
    try {
        // Basic validation
        if (!data.name || !data.email || !data.message) {
            return { success: false, error: 'Lütfen zorunlu alanları doldurun.' };
        }

        await prisma.contactForm.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                message: data.message,
            },
        });

        // Revalidate admin dashboard where messages might be shown
        revalidatePath('/admin');

        return { success: true, message: 'Mesajınız başarıyla gönderildi.' };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return { success: false, error: 'Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.' };
    }
}
