import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCategories } from '@/actions/category-actions';
import { ProductForm } from '../ProductForm';

// Force dynamic rendering to avoid database connection during build
export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
    const categoriesResult = await getCategories();
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
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Yeni Ürün Ekle</h2>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
