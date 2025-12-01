import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Örnek hero slide\'lar ekleniyor...');

    // Örnek slide'lar
    const slides = [
        {
            title: 'Sağlam Yapılar İçin Profesyonel Kalıp Çözümleri',
            subtitle: 'Bahçe duvarından özel tasarımlara kadar, inşaat projeleriniz için en dayanıklı ve estetik beton kalıplarını üretiyoruz.',
            image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop',
            ctaText: 'Ürünleri İncele',
            ctaLink: '/products',
            order: 1,
            isActive: true,
        },
        {
            title: 'Yüksek Kalite, Uzun Ömür',
            subtitle: 'En kaliteli malzemeler ile üretilmiş, yıllar  boyu dayanıklılığını koruyan beton kalıpları ile projelerinizi güvence altına alın.',
            image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2000&auto=format&fit=crop',
            ctaText: 'Hakkımızda',
            ctaLink: '/about',
            order: 2,
            isActive: true,
        },
        {
            title: 'Özel Tasarım Hizmetimiz',
            subtitle: 'Projenize özel ölçü ve desenlerde kalıp üretimi yapabiliyoruz. Uzman ekibimizle hayalinizdeki yapıyı gerçeğe dönüştürün.',
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop',
            ctaText: 'Teklif Alın',
            ctaLink: '/contact',
            order: 3,
            isActive: true,
        },
    ];

    for (const slide of slides) {
        const created = await prisma.heroSlide.create({
            data: slide,
        });
        console.log(`✅ "${created.title}" slide'ı eklendi`);
    }

    console.log('✅ Tüm slide\'lar başarıyla eklendi!');
}

main()
    .catch((e) => {
        console.error('❌ Hata:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
