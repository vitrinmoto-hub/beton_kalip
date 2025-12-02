"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleMenu}
        className="p-3 text-[var(--color-dark)] hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {isOpen && (
        <div className="absolute top-24 left-0 w-full bg-white shadow-lg border-t border-gray-100 p-4 flex flex-col gap-4 z-50 animate-in slide-in-from-top-5">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 hover:bg-gray-50 rounded-lg font-semibold text-[var(--color-dark)]"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/products"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 hover:bg-gray-50 rounded-lg font-semibold text-[var(--color-dark)]"
          >
            Ürünlerimiz
          </Link>
          <Link
            href="/references"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 hover:bg-gray-50 rounded-lg font-semibold text-[var(--color-dark)]"
          >
            Referanslar
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 hover:bg-gray-50 rounded-lg font-semibold text-[var(--color-dark)]"
          >
            Blog
          </Link>
          <Link
            href="/about"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 hover:bg-gray-50 rounded-lg font-semibold text-[var(--color-dark)]"
          >
            Hakkımızda
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 hover:bg-gray-50 rounded-lg font-semibold text-[var(--color-dark)]"
          >
            İletişim
          </Link>
          
          <div className="h-px bg-gray-100 my-2"></div>
          
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md"
          >
            <Phone size={18} />
            Hemen Teklif Al
          </Link>
        </div>
      )}
    </div>
  );
}
