import { getActiveReferences } from '@/actions/reference-actions';
import { Building2, ExternalLink } from 'lucide-react';

export default async function ReferencesPage() {
    const result = await getActiveReferences();
    const references = (result.success && result.data) ? result.data : [];

    return (
        <div className="min-h-screen py-16">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-dark)]">
                        Referanslarımız
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Kaliteli ürünlerimiz ve güvenilir hizmetimizle birçok başarılı projeye imza attık.
                        İşte bizimle çalışan değerli iş ortaklarımız ve tamamladığımız projeler.
                    </p>
                </div>

                {/* References Grid */}
                {references.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 className="mx-auto mb-6 text-gray-300" size={80} />
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">
                            Henüz Referans Eklenmemiş
                        </h3>
                        <p className="text-gray-500">
                            Yakında bu bölümde referanslarımızı görebileceksiniz.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {references.map((reference: { id: string; name: string; description: string | null; logo: string | null; website: string | null }) => (
                            <div
                                key={reference.id}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all group"
                            >
                                {/* Logo */}
                                <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-4 overflow-hidden border border-gray-100">
                                    {reference.logo ? (
                                        <img
                                            src={reference.logo}
                                            alt={reference.name}
                                            className="w-full h-full object-contain p-4"
                                        />
                                    ) : (
                                        <Building2 size={48} className="text-gray-300" />
                                    )}
                                </div>

                                {/* Name */}
                                <h3 className="font-bold text-[var(--color-dark)] text-center mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                                    {reference.name}
                                </h3>

                                {/* Description */}
                                {reference.description && (
                                    <p className="text-sm text-gray-600 text-center mb-3 line-clamp-2">
                                        {reference.description}
                                    </p>
                                )}

                                {/* Website Link */}
                                {reference.website && (
                                    <div className="text-center">
                                        <a
                                            href={reference.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline"
                                        >
                                            <ExternalLink size={14} />
                                            Web Sitesi
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Section */}
                {references.length > 0 && (
                    <div className="mt-20 bg-[var(--color-dark)] text-white rounded-2xl p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Siz de Projelerinizde Bizi Tercih Edin
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Yüzlerce başarılı projeye imza atmış deneyimli ekibimizle,
                            sizin de projenizde fark yaratmak için hazırız.
                        </p>
                        <a
                            href="/contact"
                            className="inline-block bg-[var(--color-primary)] text-white px-8 py-4 rounded-md font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
                        >
                            Hemen Teklif Alın
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
