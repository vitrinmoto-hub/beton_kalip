import Link from 'next/link';
import { getProducts } from '@/actions/product-actions';
import { getCategories } from '@/actions/category-actions';

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const params = await searchParams;
    const selectedCategory = params.category;

    const [productsResult, categoriesResult] = await Promise.all([
        getProducts(),
        getCategories(),
    ]);

    const allProducts = (productsResult.success && productsResult.data) ? productsResult.data : [];
    const categories = (categoriesResult.success && categoriesResult.data) ? categoriesResult.data : [];

    // Filter products by selected category
    const products = selectedCategory
        ? allProducts.filter((p: { category: { slug: string } }) => p.category.slug === selectedCategory)
        : allProducts;

    return (
        <div className="pb-20">
            {/* Page Header */}
            <div className="bg-[var(--color-dark)] text-white py-16 mb-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Ürünlerimiz</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        İhtiyacınıza uygun, dayanıklı ve estetik beton kalıp modellerimizi inceleyin.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 shrink-0">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 text-[var(--color-dark)]">
                                Kategoriler
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/products"
                                        className={`transition-colors text-left w-full block px-3 py-2 rounded-md ${!selectedCategory
                                                ? 'bg-[var(--color-primary)] text-white font-semibold'
                                                : 'text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-50'
                                            }`}
                                    >
                                        Tümü ({allProducts.length})
                                    </Link>
                                </li>
                                {categories.map((cat: { id: string; name: string; slug: string; _count?: { products: number } }) => (
                                    <li key={cat.id}>
                                        <Link
                                            href={`/products?category=${cat.slug}`}
                                            className={`transition-colors text-left w-full block px-3 py-2 rounded-md ${selectedCategory === cat.slug
                                                    ? 'bg-[var(--color-primary)] text-white font-semibold'
                                                    : 'text-gray-600 hover:text-[var(--color-primary)] hover:bg-gray-50'
                                                }`}
                                        >
                                            {cat.name} ({cat._count?.products || 0})
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {products.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-lg">
                                    {selectedCategory
                                        ? 'Bu kategoride ürün bulunmuyor.'
                                        : 'Henüz ürün eklenmemiş.'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product: { id: string; name: string; slug: string; description: string | null; images: { url: string }[]; category: { id: string; name: string; slug: string } }) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="group"
                                    >
                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                            <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                                                {product.images[0] ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    'Görsel'
                                                )}
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="text-xs font-semibold text-[var(--color-primary)] mb-2 uppercase tracking-wider">
                                                    {product.category.name}
                                                </div>
                                                <h3 className="text-lg font-bold mb-2 text-[var(--color-dark)] group-hover:text-[var(--color-primary)] transition-colors">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                                    {product.description || ''}
                                                </p>
                                                <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-gray-500 group-hover:text-[var(--color-dark)]">
                                                    İncele &rarr;
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
