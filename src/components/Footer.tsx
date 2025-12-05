import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { getSettings } from '@/actions/settings-actions';

export default async function Footer() {
    const { data: settings } = await getSettings();

    return (
        <footer className="bg-[var(--color-dark)] text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6">
                            {settings?.siteName || 'BETON KALIP'}
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Yüksek kaliteli beton kalıp çözümleri ile inşaat sektörüne değer katıyoruz.
                            Dayanıklı, estetik ve uzun ömürlü kalıplarımızla projelerinizi şekillendiriyoruz.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-[var(--color-dark-light)] rounded-full hover:bg-[var(--color-primary)] transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="p-2 bg-[var(--color-dark-light)] rounded-full hover:bg-[var(--color-primary)] transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-2 bg-[var(--color-dark-light)] rounded-full hover:bg-[var(--color-primary)] transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b border-[var(--color-primary)] inline-block pb-2">Hızlı Erişim</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link href="/" className="hover:text-[var(--color-primary)] transition-colors">Ana Sayfa</Link></li>
                            <li><Link href="/products" className="hover:text-[var(--color-primary)] transition-colors">Ürünlerimiz</Link></li>
                            <li><Link href="/blog" className="hover:text-[var(--color-primary)] transition-colors">Blog</Link></li>
                            <li><Link href="/about" className="hover:text-[var(--color-primary)] transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/contact" className="hover:text-[var(--color-primary)] transition-colors">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b border-[var(--color-primary)] inline-block pb-2">Ürün Grupları</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li><Link href="/products/bahce-duvar" className="hover:text-[var(--color-primary)] transition-colors">Bahçe Duvar Kalıpları</Link></li>
                            <li><Link href="/products/mezar" className="hover:text-[var(--color-primary)] transition-colors">Mezar Kalıpları</Link></li>
                            <li><Link href="/products/cesme" className="hover:text-[var(--color-primary)] transition-colors">Çeşme Kalıpları</Link></li>
                            <li><Link href="/products/bariyer" className="hover:text-[var(--color-primary)] transition-colors">Bariyer Kalıpları</Link></li>
                            <li><Link href="/products/korkuluk" className="hover:text-[var(--color-primary)] transition-colors">Korkuluk Kalıpları</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 border-b border-[var(--color-primary)] inline-block pb-2">İletişim</h4>
                        <ul className="space-y-4 text-gray-400">
                            {settings?.address && (
                                <li className="flex gap-3">
                                    <MapPin className="text-[var(--color-primary)] shrink-0" size={20} />
                                    <span>{settings.address}</span>
                                </li>
                            )}
                            {settings?.phone && (
                                <li className="flex gap-3">
                                    <Phone className="text-[var(--color-primary)] shrink-0" size={20} />
                                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                                        {settings.phone}
                                    </a>
                                </li>
                            )}
                            {settings?.email && (
                                <li className="flex gap-3">
                                    <Mail className="text-[var(--color-primary)] shrink-0" size={20} />
                                    <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                                        {settings.email}
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--color-dark-light)] pt-8 text-center text-gray-500 text-sm">
                    <p className="mb-2">
                        {settings?.copyrightText || `© ${new Date().getFullYear()} ${settings?.siteName || 'Beton Kalıp Firması'}. Tüm hakları saklıdır.`}
                    </p>
                    <p className="text-gray-600">
                        Coded by{' '}
                        <a
                            href="https://www.hasandurmus.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[var(--color-primary)] hover:text-white transition-colors"
                        >
                            Hasan Durmuş
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
