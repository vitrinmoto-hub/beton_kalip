'use client';

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
    images: { url: string; alt?: string }[];
    productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeLightbox();
    };

    if (images.length === 0) {
        return (
            <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-[400px] flex items-center justify-center text-gray-400 text-lg">
                Görsel Yok
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {/* Main Image */}
                <div
                    className="bg-gray-200 dark:bg-gray-800 rounded-lg h-[400px] flex items-center justify-center overflow-hidden cursor-pointer group relative"
                    onClick={() => openLightbox(selectedImage)}
                >
                    <img
                        src={images[selectedImage].url}
                        alt={images[selectedImage].alt || productName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage((prev) => (prev + 1) % images.length);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {images.map((image, i) => (
                            <div
                                key={i}
                                onClick={() => setSelectedImage(i)}
                                className={`bg-gray-100 dark:bg-gray-800 rounded-lg h-24 flex items-center justify-center cursor-pointer overflow-hidden transition-all ${selectedImage === i
                                    ? 'ring-2 ring-[var(--color-primary)]'
                                    : 'hover:ring-2 hover:ring-gray-400'
                                    }`}
                            >
                                <img
                                    src={image.url}
                                    alt={image.alt || `${productName} ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
                    onClick={closeLightbox}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                    >
                        <X size={32} />
                    </button>

                    {/* Previous Button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <ChevronLeft size={48} />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="max-w-7xl max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[lightboxIndex].url}
                            alt={images[lightboxIndex].alt || `${productName} ${lightboxIndex + 1}`}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                    </div>

                    {/* Next Button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <ChevronRight size={48} />
                        </button>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-lg">
                            {lightboxIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
