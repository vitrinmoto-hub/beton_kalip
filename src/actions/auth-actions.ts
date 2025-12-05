'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function login(email: string, password: string) {
    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { success: false, error: 'E-posta veya şifre hatalı' };
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return { success: false, error: 'E-posta veya şifre hatalı' };
        }

        // Create session
        (await cookies()).set('auth_token', user.id, {
            httpOnly: true,
            secure: false, // HTTP için false, HTTPS eklendiğinde true yapılmalı
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            sameSite: 'lax',
        });

        return { success: true };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
    }
}

export async function logout() {
    (await cookies()).delete('auth_token');
    redirect('/admin/login');
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) {
        return null;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: token.value },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        return user;
    } catch (error) {
        return null;
    }
}
