'use client';

import { Trash2 } from 'lucide-react';
import { deleteProduct } from '@/actions/product-actions';
import { useState } from 'react';

export function DeleteProductButton({
    productId,
    productName,
}: {
    productId: string;
    productName: string;
}) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`"${productName}" ürününü silmek istediğinize emin misiniz?`)) {
            return;
        }

        setIsDeleting(true);
        const result = await deleteProduct(productId);

        if (result.success) {
            // Page will auto-refresh due to revalidatePath
        } else {
            alert(result.error || 'Ürün silinirken hata oluştu');
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="Sil"
        >
            <Trash2 size={18} />
        </button>
    );
}
