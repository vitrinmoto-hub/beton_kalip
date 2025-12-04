import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Catalogs from "@/components/Catalogs";
import LatestPosts from "@/components/LatestPosts";
import { getFeaturedProducts } from "@/actions/product-actions";
import { getCategories } from "@/actions/category-actions";
import { getSettings } from "@/actions/settings-actions";
import { Package } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const result = await getSettings();
  const settings = result.success ? result.data : null;

  return {
    title: settings?.homeMetaTitle || 'Beton Kalıp Firması - Kaliteli ve Dayanıklı Kalıp Çözümleri',
    description: settings?.homeMetaDescription || 'Bahçe duvarı, mezar, çeşme ve özel tasarım beton kalıpları üreten lider firma.',
  };
}

export default async function Home() {
  const [productsResult, categoriesResult] = await Promise.all([
    getFeaturedProducts(3),
    getCategories(),
  ]);

  const featuredProducts = (productsResult.success && productsResult.data) ? productsResult.data : [];
  const categories = (categoriesResult.success && categoriesResult.data) ? categoriesResult.data : [];

  return (
    <div className="flex flex-col gap-8 pb-8">
      <Hero />

      {/* Categories Section */}
      <section className="container mx-auto px-4 pb-12 pt-2">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-6 text-white">
            Ürünlerimiz
          </h2>
          <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category: { id: string; name: string; slug: string; image: string | null; _count: { products: number } }) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10"></div>
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Package
                      size={48}
                      className="text-gray-300 group-hover:text-[var(--color-primary)] transition-colors"
                    />
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-white text-lg md:text-xl mb-1 drop-shadow-md">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {category._count?.products || 0} Ürün İncele &rarr;
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 text-[var(--color-dark)]">
                Öne Çıkan Modeller
              </h2>
            </div>
            <Link href="/products" className="text-[var(--color-dark)] font-semibold hover:text-[var(--color-primary)] transition-colors flex items-center gap-2">
              Tüm Ürünleri Gör &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                <p>Henüz öne çıkan ürün eklenmemiş.</p>
              </div>
            ) : (
              featuredProducts.map((product: { id: string; name: string; slug: string; description: string | null; images: { url: string }[]; category: { id: string; name: string; slug: string } }) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="h-72 bg-gray-200 overflow-hidden relative">
                    <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--color-dark)] shadow-sm">
                      Öne Çıkan
                    </div>
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Görsel Yok
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 mb-4 line-clamp-2 text-sm">
                      {product.description || 'Bu model hakkında kısa açıklama metni buraya gelecek.'}
                    </p>
                    <span className="inline-block text-[var(--color-primary)] font-bold text-sm border-b-2 border-transparent group-hover:border-[var(--color-primary)] transition-all">
                      Detayları İncele
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Catalogs Section */}
      <Catalogs />

      {/* Latest Blog Posts */}
      <LatestPosts />

      {/* Why Us Section */}
      <section className="bg-[var(--color-dark)] text-white py-24 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Neden Bizi Tercih Etmelisiniz?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Sektördeki tecrübemiz ve kalite anlayışımızla projelerinize değer katıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-[var(--color-primary)]/20">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Dayanıklı Malzeme</h3>
              <p className="text-gray-400 leading-relaxed">
                Uzun ömürlü kullanım için en kaliteli çelik ve kompozit malzemeler kullanılarak, zorlu şantiye koşullarına dayanıklı kalıplar üretiyoruz.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-[var(--color-primary)]/20">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Özel Tasarım</h3>
              <p className="text-gray-400 leading-relaxed">
                Standart ölçülerin dışında, projenizin gereksinimlerine tam uygun özel ölçü ve desenlerde kalıp tasarımı ve üretimi yapıyoruz.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-[var(--color-primary)]/20">
                <Package size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Hızlı Teslimat</h3>
              <p className="text-gray-400 leading-relaxed">
                Geniş üretim kapasitemiz ve stoklu çalışmamız sayesinde, siparişlerinizi taahhüt ettiğimiz sürede eksiksiz teslim ediyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
