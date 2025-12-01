import { Users } from 'lucide-react';

export default function UsersPage() {
    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-dark)]">Kullanıcılar</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                    <Users size={40} />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-dark)] mb-2">Yapım Aşamasında</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Kullanıcı yönetimi özelliği şu anda geliştirilme aşamasındadır.
                </p>
            </div>
        </div>
    );
}
