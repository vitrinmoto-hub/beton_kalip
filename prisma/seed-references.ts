import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Örnek referanslar ekleniyor...');

    // Örnek referanslar
    const references = [
        {
            name: 'Mega Yapı AŞ',
            description: 'Konut ve ticari yapı projeleri',
            order: 1,
            isActive: true,
        },
        {
            name: 'Anadolu İnşaat',
            description: 'Altyapı ve köprü projeleri',
            order: 2,
            isActive: true,
        },
        {
            name: 'Çelik Yapı Firması',
            description: 'Endüstriyel tesis projeleri',
            order: 3,
            isActive: true,
        },
        {
            name: 'Akdeniz Müteahhitlik',
            description: 'Otel ve turistik tesis yapımı',
            order: 4,
            isActive: true,
        },
        {
            name: 'Marmara İnşaat',
            description: 'Toplu konut projeleri',
            order: 5,
            isActive: true,
        },
        {
            name: 'Doğu Yapı',
            description: 'Kamu binası projeleri',
            order: 6,
            isActive: true,
        },
    ];

    for (const reference of references) {
        const created = await prisma.reference.create({
            data: reference,
        });
        console.log(`✅ ${created.name} eklendi`);
    }

    console.log('✅ Tüm referanslar başarıyla eklendi!');
}

main()
    .catch((e) => {
        console.error('❌ Hata:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
