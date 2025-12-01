'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type HeroSlide = {
    id: string;
    title: string;
    subtitle: string | null;
    image: string;
    ctaText: string | null;
    ctaLink: string | null;
    order: number;
};

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (slides.length === 0) return null;

    return (
        <section className="relative h-[600px] flex items-center bg-[var(--color-dark)] text-white overflow-hidden group">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-black/50 z-10"></div>

                    {/* Background Image */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: `url("${slide.image}")` }}
                    ></div>

                    <div className="container mx-auto px-4 relative z-20 h-full flex items-center">
                        <div className="max-w-3xl">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
                                {slide.title}
                            </h1>
                            {slide.subtitle && (
                                <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl animate-fade-in-up delay-100">
                                    {slide.subtitle}
                                </p>
                            )}
                            {slide.ctaLink && (
                                <div className="animate-fade-in-up delay-200">
                                    <Link
                                        href={slide.ctaLink}
                                        className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-[var(--color-primary-hover)] transition-colors inline-block"
                                    >
                                        {slide.ctaText || 'İncele'}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Buttons */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={32} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-[var(--color-primary)]' : 'bg-white/50 hover:bg-white'
                                    }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
