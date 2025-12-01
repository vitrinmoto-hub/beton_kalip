'use client';

import Link from 'next/link';
import { LayoutDashboard, Package, FileText, Settings, Users, Image as ImageIcon, FolderOpen, Award, Mail } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    // If on login page, just render children without sidebar
    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-dark)] text-white flex flex-col fixed h-full">
                <div className="h-20 flex items-center justify-center border-b border-gray-800">
                    <h1 className="text-xl font-bold">
                        BETON<span className="text-[var(--color-primary)]">PANEL</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <LayoutDashboard size={20} />
                        <span>Genel Bakış</span>
                    </Link>

                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <Package size={20} />
                        <span>Ürün Yönetimi</span>
                    </Link>

                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <FolderOpen size={20} />
                        <span>Kategoriler</span>
                    </Link>

                    <Link
                        href="/admin/blog"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <FileText size={20} />
                        <span>Blog Yazıları</span>
                    </Link>

                    <Link
                        href="/admin/media"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <ImageIcon size={20} />
                        <span>Medya Galeri</span>
                    </Link>

                    <Link
                        href="/admin/slider"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <ImageIcon size={20} />
                        <span>Slider</span>
                    </Link>

                    <Link
                        href="/admin/references"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <Award size={20} />
                        <span>Referanslar</span>
                    </Link>

                    <Link
                        href="/admin/catalogs"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <FileText size={20} />
                        <span>E-Kataloglar</span>
                    </Link>

                    <Link
                        href="/admin/messages"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <Mail size={20} />
                        <span>Mesajlar</span>
                    </Link>

                    <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <Users size={20} />
                        <span>Kullanıcılar</span>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[var(--color-dark-light)] hover:text-white rounded-md transition-colors"
                    >
                        <Settings size={20} />
                        <span>Ayarlar</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
