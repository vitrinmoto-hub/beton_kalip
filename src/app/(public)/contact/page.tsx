import { Mail, MapPin, Phone } from 'lucide-react';
import { getSettings } from '@/actions/settings-actions';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
    const { data: settings } = await getSettings();

    return (
        <div className="pb-20 dark:bg-[var(--color-dark)]">
            {/* Page Header */}
            <div className="bg-[var(--color-dark)] text-white py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">İletişim</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Projeleriniz için fiyat teklifi almak veya sorularınız için bizimle iletişime geçin.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-[var(--color-dark)] dark:text-white">İletişim Bilgileri</h2>
                            <div className="space-y-6">
                                {settings?.address && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[var(--color-primary)] text-white rounded-lg">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--color-dark)] dark:text-white mb-1">Adres</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {settings.address}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {settings?.phone && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[var(--color-primary)] text-white rounded-lg">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--color-dark)] dark:text-white mb-1">Telefon</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-[var(--color-primary)] transition-colors">
                                                    {settings.phone}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {settings?.email && (
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[var(--color-primary)] text-white rounded-lg">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[var(--color-dark)] dark:text-white mb-1">E-posta</h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                <a href={`mailto:${settings.email}`} className="hover:text-[var(--color-primary)] transition-colors">
                                                    {settings.email}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map Embed */}
                        {settings?.mapEmbedUrl ? (
                            <div className="bg-gray-200 dark:bg-gray-800 h-80 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                <iframe
                                    src={settings.mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        ) : (
                            <div className="bg-gray-200 dark:bg-gray-800 h-64 rounded-lg flex items-center justify-center text-gray-500">
                                Harita bilgisi eklenmemiş
                            </div>
                        )}
                    </div>

                    {/* Contact Form */}
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
