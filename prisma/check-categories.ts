// @ts-check
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
    categories.forEach((cat: { name: string; slug: string; _count: { products: number } }) => {
        console.log(`${cat.name} (${cat.slug})`);
        console.log(`  Ürün sayısı: ${cat._count.products}`);
        console.log('---');
    });

    const emptyCategories = categories.filter((cat: { _count: { products: number } }) => cat._count.products === 0);
    console.log('\n=== BOŞ KATEGORİLER ===');
    emptyCategories.forEach((cat: { name: string; _count: { products: number } }) => {
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
