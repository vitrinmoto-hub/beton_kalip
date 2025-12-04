import { getCatalogs } from "@/actions/catalog-actions";
import { FileText, Download } from "lucide-react";

type Catalog = {
    id: string;
    name: string;
    fileUrl: string;
    coverImage: string | null;
};

export default async function Catalogs() {
    const result = await getCatalogs();
    const catalogs = (result.success && result.data) ? result.data : [];

    if (catalogs.length === 0) return null;

    return (
        <section className="py-20 bg-[var(--color-dark)] relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[var(--color-primary)] blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-600 blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ürün Kataloglarımızı <br />
                            <span className="text-[var(--color-primary)]">İncelediniz mi?</span>
                        </h2>
                        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            En yeni ürünlerimiz, teknik detaylar ve uygulama örnekleri için dijital kataloglarımızı hemen indirin. Projeleriniz için en uygun çözümleri keşfedin.
                        </p>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                            {catalogs.map((catalog: { id: string; name: string; fileUrl: string; coverImage: string | null }) => (
                                <a
                                    key={catalog.id}
                                    href={catalog.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-6 py-4 rounded-xl transition-all hover:scale-105"
                                >
                                    <div className="bg-[var(--color-primary)] p-2 rounded-lg text-white group-hover:shadow-lg transition-shadow">
                                        <Download size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">PDF İndir</div>
                                        <div className="text-white font-bold">{catalog.name}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative">
                            {/* Decorative Elements */}
                            <div className="absolute -inset-4 border-2 border-[var(--color-primary)]/30 rounded-2xl transform rotate-3"></div>
                            <div className="absolute -inset-4 border-2 border-white/10 rounded-2xl transform -rotate-3"></div>

                            <div className="relative bg-white p-2 rounded-xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-500">
                                {catalogs[0]?.coverImage ? (
                                    <img
                                        src={catalogs[0].coverImage}
                                        alt="Katalog Önizleme"
                                        className="w-64 md:w-80 rounded-lg shadow-inner"
                                    />
                                ) : (
                                    <div className="w-64 md:w-80 h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400">
                                        <FileText size={64} className="mb-4 text-[var(--color-primary)]" />
                                        <span className="font-medium">Katalog Önizleme</span>
                                    </div>
                                )}

                                {/* Floating Badge */}
                                <div className="absolute -bottom-6 -right-6 bg-[var(--color-primary)] text-white p-4 rounded-full shadow-lg font-bold text-center w-24 h-24 flex items-center justify-center transform rotate-12">
                                    <span className="text-sm">2024<br />Katalog</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
