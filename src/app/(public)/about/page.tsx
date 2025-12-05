import { Target, Eye, Award } from 'lucide-react';
import { getSettings } from '@/actions/settings-actions';

export default async function AboutPage() {
    const { data: settings } = await getSettings();

    return (
        <div className="pb-20 dark:bg-[var(--color-dark)]">
            {/* Page Header */}
            <div className="bg-[var(--color-dark)] text-white py-16 mb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Hakkımızda</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Beton kalıp sektöründe yılların verdiği tecrübe ile kalite ve güvenin adresi.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-[var(--color-dark)] dark:text-white">
                            {settings?.aboutTitle || 'Biz Kimiz?'}
                        </h2>
                        <div
                            className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: settings?.aboutContent || '<p>Firmamız hakkında bilgi...</p>' }}
                        />
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-800 h-[400px] rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                        {settings?.aboutImage ? (
                            <img src={settings.aboutImage} alt="Hakkımızda" className="w-full h-full object-cover" />
                        ) : (
                            'Firma Görseli'
                        )}
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--color-dark)] dark:text-white">
                            {settings?.missionTitle || 'Misyonumuz'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            {settings?.missionContent || 'Misyonumuz hakkında bilgi...'}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Eye size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--color-dark)] dark:text-white">
                            {settings?.visionTitle || 'Vizyonumuz'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            {settings?.visionContent || 'Vizyonumuz hakkında bilgi...'}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                        <div className="w-16 h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Award size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-4 text-[var(--color-dark)] dark:text-white">Değerlerimiz</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Dürüstlük, kalite, müşteri odaklılık ve sürekli gelişim ilkelerinden taviz vermeden çalışmak.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
