import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getProductById } from '@/actions/product-actions';
import { getCategories } from '@/actions/category-actions';
import { ProductForm } from '../../ProductForm';

// Force dynamic rendering to avoid database connection during build
export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [productResult, categoriesResult] = await Promise.all([
        getProductById(id),
        getCategories(),
    ]);

    if (!productResult.success || !productResult.data) {
        notFound();
    }

    const product = productResult.data;
    const categories = (categoriesResult.success && categoriesResult.data) ? categoriesResult.data : [];

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Ürünü Düzenle</h2>
            </div>

            <ProductForm categories={categories} product={product} />
        </div>
    );
}
