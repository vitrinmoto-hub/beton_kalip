import Link from 'next/link';
import { getActiveSlides } from '@/actions/slider-actions';
import HeroSlider from './HeroSlider';

export default async function Hero() {
    const result = await getActiveSlides();
    const slides = (result.success && result.data) ? result.data : [];

    if (slides.length > 0) {
        return <HeroSlider slides={slides} />;
    }

    // Fallback Static Hero
    return (
        <section className="relative h-[700px] flex items-center bg-[var(--color-dark)] text-white overflow-hidden">
            {/* Background Overlay with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>

            {/* Background Image (Placeholder) */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center transform scale-105 animate-slow-zoom"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop")' }}
            ></div>

            <div className="container mx-auto px-4 relative z-20">
                <div className="max-w-4xl">
                    <div className="inline-block bg-[var(--color-primary)]/20 backdrop-blur-sm border border-[var(--color-primary)]/30 text-[var(--color-primary)] px-4 py-2 rounded-full font-semibold text-sm mb-6 animate-fade-in-up">
                        ✨ Profesyonel Beton Kalıp Sistemleri
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up delay-100">
                        Sağlam Yapıların <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-white">Görünmez Kahramanı</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl animate-fade-in-up delay-200">
                        Yüksek mühendislik standartlarında üretilen kalıp sistemlerimizle, projelerinize hız, güvenlik ve estetik katıyoruz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up delay-300">
                        <Link
                            href="/products"
                            className="bg-[var(--color-primary)] text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-[var(--color-primary-hover)] transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/30 hover:-translate-y-1 text-center"
                        >
                            Ürünleri İncele
                        </Link>
                        <Link
                            href="/contact"
                            className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all hover:-translate-y-1 text-center"
                        >
                            Hemen Teklif Al
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
