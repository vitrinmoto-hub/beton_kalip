'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { deletePost } from '@/actions/blog-actions';
import { useRouter } from 'next/navigation';

interface DeletePostButtonProps {
    postId: string;
    postTitle: string;
}

export function DeletePostButton({ postId, postTitle }: DeletePostButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm(`"${postTitle}" başlıklı yazıyı silmek istediğinize emin misiniz?`)) {
            setIsDeleting(true);
            const result = await deletePost(postId);

            if (result.success) {
                // Success handling is done via revalidatePath in server action
                // but we might want to refresh here too just in case
                router.refresh();
            } else {
                alert(result.error || 'Silme işlemi başarısız oldu');
                setIsDeleting(false);
            }
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
