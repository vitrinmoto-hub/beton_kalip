import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const posts = await prisma.post.findMany();
    console.log('--- Database Posts ---');
    posts.forEach((post: any) => {
        console.log(`Title: ${post.title}`);
        console.log(`Slug:  ${post.slug}`);
        console.log('---');
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
