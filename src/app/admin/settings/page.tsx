'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Save, Upload, Building2, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { getSettings, updateSettings } from '@/actions/settings-actions';
import { useRouter } from 'next/navigation';

type Settings = {
    id: string;
    siteName: string;
    logo: string | null;
    favicon: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    whatsapp: string | null;
    mapEmbedUrl: string | null;
    heroTitle: string | null;
    heroSubtitle: string | null;
    heroImage: string | null;
    primaryColor: string | null;
    secondaryColor: string | null;
    aboutTitle: string | null;
    aboutContent: string | null;
    aboutImage: string | null;
    missionTitle: string | null;
    missionContent: string | null;
    visionTitle: string | null;
    visionContent: string | null;
    homeMetaTitle: string | null;
    homeMetaDescription: string | null;
};

export default function SettingsPage() {
    const router = useRouter();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        const result = await getSettings();
        if (result.success && result.data) {
            setSettings(result.data as Settings);
        }
        setIsLoading(false);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingLogo(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setSettings(prev => prev ? { ...prev, logo: data.url } : null);
                setSuccess('Logo yüklendi! Değişiklikleri kaydetmeyi unutmayın.');
            } else {
                setError(data.error || 'Logo yüklenirken hata oluştu');
            }
        } catch (error) {
            setError('Logo yüklenirken bir hata oluştu');
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!settings) return;

        setIsSubmitting(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        const data = {
            siteName: formData.get('siteName') as string,
            logo: settings.logo || undefined,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            address: formData.get('address') as string,
            whatsapp: formData.get('whatsapp') as string,
            mapEmbedUrl: formData.get('mapEmbedUrl') as string,
            aboutTitle: formData.get('aboutTitle') as string,
            visionContent: formData.get('visionContent') as string,
            homeMetaTitle: formData.get('homeMetaTitle') as string,
            homeMetaDescription: formData.get('homeMetaDescription') as string,
        };

        const result = await updateSettings(data);

        if (result.success) {
            setSuccess('Ayarlar başarıyla kaydedildi!');
            router.refresh();
            setTimeout(() => setSuccess(''), 3000);
        } else {
            setError(result.error || 'Bir hata oluştu');
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Yükleniyor...</p>
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Ayarlar yüklenemedi</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Site Ayarları</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Logo Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)] flex items-center gap-2">
                                <Building2 size={20} />
                                Logo Yönetimi
                            </h3>

                            <div className="space-y-4">
                                {settings.logo && (
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <p className="text-sm text-gray-600 mb-2">Mevcut Logo:</p>
                                        <div className="bg-white p-4 rounded border border-gray-300 inline-block">
                                            <img
                                                src={settings.logo}
                                                alt="Site Logo"
                                                className="h-16 object-contain"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--color-primary)] transition-colors">
                                            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                                            <p className="text-sm text-gray-600 font-medium">
                                                {isUploadingLogo ? 'Yükleniyor...' : 'Yeni Logo Yükle'}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                PNG, JPG, SVG (Max 5MB)
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                💡 İdeal ölçüler: 200x60px veya 300x90px
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            disabled={isUploadingLogo}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Site Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                                Site Bilgileri
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site Adı
                                    </label>
                                    <input
                                        type="text"
                                        name="siteName"
                                        defaultValue={settings.siteName}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                                İletişim Bilgileri
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Phone size={16} />
                                        Telefon
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        defaultValue={settings.phone || ''}
                                        placeholder="+90 (XXX) XXX XX XX"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Mail size={16} />
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={settings.email || ''}
                                        placeholder="info@example.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <MessageSquare size={16} />
                                        WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        name="whatsapp"
                                        defaultValue={settings.whatsapp || ''}
                                        placeholder="+90XXXXXXXXXX"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin size={16} />
                                        Adres
                                    </label>
                                    <textarea
                                        name="address"
                                        rows={3}
                                        defaultValue={settings.address || ''}
                                        placeholder="Şirket adresi..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin size={16} />
                                        Google Maps Embed URL
                                    </label>
                                    <input
                                        type="text"
                                        name="mapEmbedUrl"
                                        defaultValue={settings.mapEmbedUrl || ''}
                                        placeholder="https://www.google.com/maps/embed?pb=..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Google Maps'te konumunuzu bulun → Paylaş → Haritayı yerleştir → src="..." içindeki URL'i kopyalayın
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                            Ana Sayfa SEO
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Başlık
                                </label>
                                <input
                                    type="text"
                                    name="homeMetaTitle"
                                    defaultValue={settings.homeMetaTitle || ''}
                                    placeholder="Beton Kalıp Firması - Kaliteli ve Dayanıklı Kalıp Çözümleri"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                                <p className="text-xs text-gray-500 mt-1">Arama motorlarında görünecek başlık (50-60 karakter önerilir)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Açıklama
                                </label>
                                <textarea
                                    name="homeMetaDescription"
                                    rows={3}
                                    defaultValue={settings.homeMetaDescription || ''}
                                    placeholder="Bahçe duvarı, mezar, çeşme ve özel tasarım beton kalıpları üreten lider firma."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                                <p className="text-xs text-gray-500 mt-1">Arama sonuçlarında görünecek açıklama (150-160 karakter önerilir)</p>
                            </div>
                        </div>
                    </div>

                    {/* About Us Settings */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                            Hakkımızda Sayfası
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Başlık
                                </label>
                                <input
                                    type="text"
                                    name="aboutTitle"
                                    defaultValue={settings.aboutTitle || ''}
                                    placeholder="Biz Kimiz?"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İçerik
                                </label>
                                <textarea
                                    name="aboutContent"
                                    rows={6}
                                    defaultValue={settings.aboutContent || ''}
                                    placeholder="Firma hakkında detaylı bilgi..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Görsel URL (veya yukarıdan logo yükler gibi yükleyip url'i buraya yapıştırın şimdilik)
                                </label>
                                <input
                                    type="text"
                                    name="aboutImage"
                                    defaultValue={settings.aboutImage || ''}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Misyon Başlık
                                    </label>
                                    <input
                                        type="text"
                                        name="missionTitle"
                                        defaultValue={settings.missionTitle || ''}
                                        placeholder="Misyonumuz"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vizyon Başlık
                                    </label>
                                    <input
                                        type="text"
                                        name="visionTitle"
                                        defaultValue={settings.visionTitle || ''}
                                        placeholder="Vizyonumuz"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Misyon İçerik
                                    </label>
                                    <textarea
                                        name="missionContent"
                                        rows={3}
                                        defaultValue={settings.missionContent || ''}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Vizyon İçerik
                                    </label>
                                    <textarea
                                        name="visionContent"
                                        rows={3}
                                        defaultValue={settings.visionContent || ''}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Save Button */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                            <h3 className="text-lg font-bold mb-4 text-[var(--color-dark)]">
                                Değişiklikleri Kaydet
                            </h3>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-600">{success}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Değişiklikler tüm sayfalara yansıtılacaktır
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
