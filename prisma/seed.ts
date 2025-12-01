import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        // Replace Turkish characters
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/Ğ/g, 'g')
        .replace(/Ü/g, 'u')
        .replace(/Ş/g, 's')
        .replace(/İ/g, 'i')
        .replace(/Ö/g, 'o')
        .replace(/Ç/g, 'c')
        // Replace spaces with -
        .replace(/\s+/g, '-')
        // Remove all non-word chars
        .replace(/[^\w\-]+/g, '')
        // Replace multiple - with single -
        .replace(/\-\-+/g, '-')
        // Remove - from start and end
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

async function seed() {
    console.log('🌱 Starting database seed...');

    // Create categories
    const categories = [
        {
            name: 'Bahçe Duvar Kalıpları',
            description: 'Bahçe ve peyzaj düzenlemeleriniz için desenli beton duvar kalıpları',
        },
        {
            name: 'Mezar Kalıpları',
            description: 'Dayanıklı ve estetik mezar çevresi kalıpları',
        },
        {
            name: 'Çeşme Kalıpları',
            description: 'Geleneksel ve modern tasarım çeşme kalıpları',
        },
        {
            name: 'Bariyer Kalıpları',
            description: 'Yol ve güvenlik bariyeri kalıpları',
        },
    ];

    console.log('Creating categories...');
    const createdCategories = [];
    for (const cat of categories) {
        const category = await prisma.category.upsert({
            where: { slug: generateSlug(cat.name) },
            update: cat,
            create: {
                ...cat,
                slug: generateSlug(cat.name),
            },
        });
        createdCategories.push(category);
        console.log(`✓ Created category: ${category.name}`);
    }

    // Create sample products
    console.log('\nCreating products...');

    const products = [
        {
            name: 'Bahçe Duvar Kalıbı - Model A',
            description: 'Desenli beton duvar kalıbı, estetik görünüm ve dayanıklılık',
            content: 'Bu kalıp modeli, bahçe duvarlarınıza estetik bir görünüm kazandırır. Dayanıklı çelik yapısı sayesinde uzun yıllar kullanılabilir. Kolay montaj ve sökme özelliği ile işçilik maliyetlerinden tasarruf sağlar.',
            categoryId: createdCategories[0].id,
            dimensions: '200 x 100 cm',
            weight: '45 kg',
            material: 'Çelik + Kompozit',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isFeatured: true,
            order: 1,
            images: [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
                'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
            ],
        },
        {
            name: 'Mezar Kalıbı - Tekli Model',
            description: 'Tek kişilik mezar çevresi için dayanıklı kalıp',
            content: 'Mezar çevrelerinde kullanılan, uzun ömürlü ve bakım gerektirmeyen kalıp modelidir. Özel beton karışımı ile kusursuz yüzey elde edilir.',
            categoryId: createdCategories[1].id,
            dimensions: '220 x 90 cm',
            weight: '38 kg',
            material: 'Çelik',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isFeatured: true,
            order: 2,
            images: [
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            ],
        },
        {
            name: 'Çeşme Kalıbı - Osmanlı Desenli',
            description: 'Geleneksel Osmanlı motifli çeşme kalıbı',
            content: 'Geleneksel Osmanlı mimarisinden ilham alan bu çeşme kalıbı, bahçenize veya mekanınıza tarihi bir hava katar. Detaylı işçilik ve dayanıklı malzeme.',
            categoryId: createdCategories[2].id,
            dimensions: '120 x 80 cm',
            weight: '32 kg',
            material: 'Çelik',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isFeatured: true,
            order: 3,
            images: [
                'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800',
            ],
        },
        {
            name: 'Bariyer Kalıbı - Tip 1',
            description: 'Yol bariyeri üretimi için endüstriyel kalıp',
            content: 'Karayolu güvenlik bariyerlerinin üretiminde kullanılan, yüksek kaliteli ve dayanıklı kalıp sistemi. Hızlı montaj ve yüksek üretim kapasitesi.',
            categoryId: createdCategories[3].id,
            dimensions: '250 x 100 cm',
            weight: '65 kg',
            material: 'Çelik',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isFeatured: false,
            images: [
                'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
            ],
        },
    ];

    for (const prod of products) {
        const { images, ...productData } = prod;
        const product = await prisma.product.upsert({
            where: { slug: generateSlug(prod.name) },
            update: {
                ...productData,
            },
            create: {
                ...productData,
                slug: generateSlug(prod.name),
                images: {
                    create: images.map((url) => ({ url })),
                },
            },
        });
        console.log(`✓ Created product: ${product.name}`);
    }

    console.log('\n✅ Database seeded successfully!');
}

seed()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
