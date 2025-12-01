import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // Generate secure password
    const password = 'BK@2024#SecureAdmin!789';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or update admin user
    const admin = await prisma.user.upsert({
        where: { email: 'admin@betonkalip.com' },
        update: {
            password: hashedPassword,
        },
        create: {
            email: 'admin@betonkalip.com',
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Admin kullanıcısı oluşturuldu!');
    console.log('📧 E-posta: admin@betonkalip.com');
    console.log('🔐 Şifre: BK@2024#SecureAdmin!789');
    console.log('\n⚠️  Bu şifreyi güvenli bir yerde saklayın!\n');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
