'use client';

import { useState, FormEvent } from 'react';
import { Send } from 'lucide-react';
import { submitContactForm } from '@/actions/contact-actions';

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState<{ success: boolean; message: string } | null>(null);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            message: formData.get('message') as string,
        };

        const result = await submitContactForm(data);

        setIsSubmitting(false);
        setFormStatus({
            success: result.success,
            message: result.error || result.message || '',
        });

        if (result.success) {
            (e.target as HTMLFormElement).reset();
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-[var(--color-dark)] dark:text-white">İletişim Formu</h2>

            {formStatus && (
                <div className={`mb-6 p-4 rounded-md ${formStatus.success ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'}`}>
                    {formStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ad Soyad</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                            placeholder="Adınız Soyadınız"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Telefon</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                            placeholder="0555 555 55 55"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">E-posta</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        placeholder="ornek@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mesajınız</label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        placeholder="Mesajınızı buraya yazın..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--color-primary)] text-white px-6 py-4 rounded-md font-bold hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    <Send size={20} />
                    {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
                </button>
            </form>
        </div>
    );
}
