import Link from 'next/link';
import { Check, Info } from 'lucide-react';
import { getProductBySlug } from '@/actions/product-actions';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/ImageGallery';

// Force dynamic rendering to avoid database connection during build
export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const result = await getProductBySlug(slug);

    if (!result.success || !result.data) {
        notFound();
    }

    const product = result.data;

    return (
        <div className="pb-20 dark:bg-[var(--color-dark)]">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                    <Link href="/" className="hover:text-[var(--color-primary)]">
                        Ana Sayfa
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href="/products" className="hover:text-[var(--color-primary)]">
                        Ürünler
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 dark:text-white">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <ImageGallery
                        images={product.images.map((img: { url: string }) => ({ url: img.url, alt: product.name }))}
                        productName={product.name}
                    />

                    {/* Product Info */}
                    <div>
                        <div className="mb-6">
                            <span className="text-[var(--color-primary)] font-semibold tracking-wider uppercase text-sm">
                                {product.category.name}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold mt-2 text-[var(--color-dark)] dark:text-white">
                                {product.name}
                            </h1>
                        </div>

                        {product.description && (
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                {product.description}
                            </p>
                        )}

                        {product.content && (
                            <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-line">
                                {product.content}
                            </div>
                        )}

                        {/* Technical Specs */}
                        {(product.dimensions || product.weight || product.material) && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 dark:text-white">
                                    <Info size={20} className="text-[var(--color-primary)]" />
                                    Teknik Özellikler
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {product.dimensions && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400 block">Ölçüler</span>
                                            <span className="font-semibold dark:text-gray-200">{product.dimensions}</span>
                                        </div>
                                    )}
                                    {product.weight && (
                                        <div>
                                            <span className="text-gray-500 dark:text-gray-400 block">Ağırlık</span>
                                            <span className="font-semibold dark:text-gray-200">{product.weight}</span>
                                        </div>
                                    )}
                                    {product.material && (
                                        <div className="col-span-2">
                                            <span className="text-gray-500 dark:text-gray-400 block">Malzeme</span>
                                            <span className="font-semibold dark:text-gray-200">{product.material}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Video */}
                        {product.videoUrl && (
                            <div className="mb-8">
                                <h3 className="font-bold text-lg mb-4 dark:text-white">Ürün Videosu</h3>
                                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${product.videoUrl.split('v=')[1]?.split('&')[0] || product.videoUrl.split('/').pop()}`}
                                        title={product.name}
                                        className="absolute top-0 left-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/contact"
                                className="flex-1 bg-[var(--color-primary)] text-white px-8 py-4 rounded-md font-bold text-center hover:bg-[var(--color-primary-hover)] transition-colors"
                            >
                                Fiyat Teklifi Al
                            </Link>
                            <a
                                href="https://wa.me/905555555555"
                                target="_blank"
                                className="flex-1 bg-[#25D366] text-white px-8 py-4 rounded-md font-bold text-center hover:bg-[#128C7E] transition-colors"
                            >
                                WhatsApp'tan Sor
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
