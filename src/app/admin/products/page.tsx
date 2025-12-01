import Link from 'next/link';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import { getProducts } from '@/actions/product-actions';
import { DeleteProductButton } from './DeleteProductButton';

export default async function AdminProductsPage() {
    const result = await getProducts();
    const products = (result.success && result.data) ? result.data : [];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Ürün Yönetimi</h2>
                <Link
                    href="/admin/products/new"
                    className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-md font-semibold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Yeni Ürün Ekle
                </Link>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ürün
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Özellikler
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Durum
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg">Henüz ürün eklenmemiş</p>
                                    <p className="text-sm mt-2">
                                        Başlamak için "Yeni Ürün Ekle" butonuna tıklayın
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                                                {product.images[0] ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    'Görsel Yok'
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[var(--color-dark)]">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-500 line-clamp-1">
                                                    {product.description || 'Açıklama yok'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-[var(--color-primary)]">
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {product.dimensions && (
                                            <div>Ölçü: {product.dimensions}</div>
                                        )}
                                        {product.weight && <div>Ağırlık: {product.weight}</div>}
                                        {product.material && (
                                            <div>Malzeme: {product.material}</div>
                                        )}
                                        {!product.dimensions && !product.weight && !product.material && (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {product.isFeatured && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Öne Çıkan
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Düzenle"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <DeleteProductButton
                                                productId={product.id}
                                                productName={product.name}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
