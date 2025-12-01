'use client';

import { useState, useEffect } from 'react';
import { Mail, Trash2, CheckCircle, Circle, Phone, Calendar } from 'lucide-react';
import { getContactMessages, markAsRead, deleteMessage } from '@/actions/contact-admin-actions';
import { useRouter } from 'next/navigation';

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    isRead: boolean;
    createdAt: Date;
};

export default function MessagesPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        setIsLoading(true);
        const result = await getContactMessages();
        if (result.success && result.data) {
            setMessages(result.data as ContactMessage[]);
        }
        setIsLoading(false);
    };

    const handleMarkAsRead = async (id: string) => {
        const result = await markAsRead(id);
        if (result.success) {
            loadMessages();
            router.refresh();
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`"${name}" kişisinin mesajını silmek istediğinizden emin misiniz?`)) {
            return;
        }

        const result = await deleteMessage(id);
        if (result.success) {
            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }
            loadMessages();
            router.refresh();
        } else {
            alert(result.error);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const unreadCount = messages.filter(m => !m.isRead).length;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--color-dark)]">İletişim Mesajları</h2>
                    <p className="text-gray-600 mt-2">
                        Toplam {messages.length} mesaj · {unreadCount} okunmamış
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Messages List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {isLoading ? (
                            <div className="p-8 text-center text-gray-500">
                                Yükleniyor...
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Henüz mesaj yok
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        onClick={() => {
                                            setSelectedMessage(message);
                                            if (!message.isRead) {
                                                handleMarkAsRead(message.id);
                                            }
                                        }}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === message.id ? 'bg-blue-50 border-l-4 border-[var(--color-primary)]' : ''
                                            } ${!message.isRead ? 'bg-blue-50/30' : ''}`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {message.isRead ? (
                                                    <CheckCircle size={16} className="text-green-600" />
                                                ) : (
                                                    <Circle size={16} className="text-[var(--color-primary)]" />
                                                )}
                                                <h3 className={`font-semibold text-[var(--color-dark)] ${!message.isRead ? 'font-bold' : ''}`}>
                                                    {message.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                            {message.message}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={12} />
                                            {formatDate(message.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-[var(--color-dark)] mb-2">
                                        {selectedMessage.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} />
                                            <a href={`mailto:${selectedMessage.email}`} className="hover:text-[var(--color-primary)]">
                                                {selectedMessage.email}
                                            </a>
                                        </div>
                                        {selectedMessage.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} />
                                                <a href={`tel:${selectedMessage.phone}`} className="hover:text-[var(--color-primary)]">
                                                    {selectedMessage.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(selectedMessage.id, selectedMessage.name)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    title="Sil"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Mesaj:</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.message}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 mt-6 pt-6">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calendar size={14} />
                                    Gönderim Tarihi: {formatDate(selectedMessage.createdAt)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                            <Mail size={64} className="mx-auto mb-4 text-gray-300" />
                            <p>Mesaj detaylarını görmek için sol taraftan bir mesaj seçin</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
