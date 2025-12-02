// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    console.log('=== KATEGORİLER ===\n');
    categories.forEach(cat => {
        console.log(`${cat.name} (${cat.slug})`);
        console.log(`  Ürün sayısı: ${cat._count.products}`);
        console.log('---');
    });

    const emptyCategories = categories.filter(cat => cat._count.products === 0);
    console.log('\n=== BOŞ KATEGORİLER ===');
    emptyCategories.forEach(cat => {
        console.log(`- ${cat.name}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
