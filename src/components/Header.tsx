import Link from 'next/link';
import { Menu, Phone, Mail } from 'lucide-react';
import { getSettings } from '@/actions/settings-actions';

export default async function Header() {
  const { data: settings } = await getSettings();

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[var(--color-dark)] text-white py-2 border-b border-gray-700">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            {settings?.phone && (
              <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors">
                <Phone size={14} />
                <span>{settings.phone}</span>
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors">
                <Mail size={14} />
                <span>{settings.email}</span>
              </a>
            )}
          </div>
          <div className="hidden md:block text-gray-400">
            Profesyonel Beton Kalıp Sistemleri
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform shadow-lg">
                BK
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-[var(--color-dark)] leading-tight">
                  BETON<span className="text-[var(--color-primary)]">KALIP</span>
                </span>
                <span className="text-xs text-gray-500 font-medium">Kalite ve Güvenin Adresi</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                href="/"
                className="relative px-5 py-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors group"
              >
                Ana Sayfa
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/products"
                className="relative px-5 py-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors group"
              >
                Ürünlerimiz
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/references"
                className="relative px-5 py-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors group"
              >
                Referanslar
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/blog"
                className="relative px-5 py-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors group"
              >
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/about"
                className="relative px-5 py-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors group"
              >
                Hakkımızda
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/contact"
                className="relative px-5 py-2 font-semibold text-[var(--color-dark)] hover:text-[var(--color-primary)] transition-colors group"
              >
                İletişim
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-primary)] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl hover:shadow-[var(--color-primary)]/40 hover:scale-105 transition-all"
            >
              <Phone size={18} />
              Hemen Teklif Al
            </Link>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-3 text-[var(--color-dark)] hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
