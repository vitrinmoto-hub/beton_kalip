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

const POSTS = [
    {
        title: 'Beton Kalıp Seçerken Nelere Dikkat Edilmeli?',
        excerpt: 'İnşaat projelerinizde doğru kalıp seçimi, hem maliyet hem de güvenlik açısından kritik öneme sahiptir.',
        content: `
            <p class="lead text-xl text-gray-600 dark:text-gray-400 mb-8">
                İnşaat projelerinin başarısı, kullanılan malzemelerin kalitesiyle doğrudan ilişkilidir.
                Beton kalıpları, yapının iskeletini oluşturduğu için seçim aşamasında titiz davranılmalıdır.
            </p>

            <h2 class="text-2xl font-bold mb-4 text-[var(--color-dark)] dark:text-white">1. Malzeme Kalitesi</h2>
            <p class="mb-6">
                Kalıbın üretildiği malzeme, kullanım ömrünü ve beton yüzeyinin kalitesini belirler.
                Çelik kalıplar uzun ömürlü ve dayanıklıyken, plastik kalıplar hafiflik avantajı sunar.
                Projenizin büyüklüğüne ve tekrar sayısına göre en uygun malzemeyi seçmelisiniz.
            </p>

            <h2 class="text-2xl font-bold mb-4 text-[var(--color-dark)] dark:text-white">2. Ölçü Hassasiyeti</h2>
            <p class="mb-6">
                Kalıpların milimetrik hassasiyetle üretilmiş olması, montaj sırasında yaşanacak sorunları en aza indirir.
                Birbiriyle tam uyumlu parçalar, işçilik süresini kısaltır ve beton sızdırmazlığını garanti eder.
            </p>

            <h2 class="text-2xl font-bold mb-4 text-[var(--color-dark)] dark:text-white">3. Kullanım Kolaylığı</h2>
            <p class="mb-6">
                Pratik montaj ve demontaj özellikleri, şantiye verimliliğini artırır.
                Kilit sistemleri, taşıma kulpları ve hafif tasarım gibi detaylar, işçilerin daha hızlı ve güvenli çalışmasını sağlar.
            </p>

            <div class="bg-gray-50 dark:bg-gray-800 p-6 border-l-4 border-[var(--color-primary)] my-8">
                <p class="font-semibold italic text-gray-800 dark:text-gray-200">
                    "Doğru kalıp seçimi, projenizin maliyetini %20'ye kadar düşürebilir ve iş güvenliğini artırır."
                </p>
            </div>

            <p>
                Sonuç olarak, beton kalıp yatırımı yaparken sadece ilk satın alma maliyetine değil,
                toplam kullanım ömrüne ve sağladığı avantajlara odaklanmak gerekir.
                Firmamızın uzman ekibiyle iletişime geçerek projeniz için en uygun çözümü belirleyebilirsiniz.
            </p>
        `,
        date: '2025-11-28T10:00:00Z',
        author: 'Admin',
        image: ''
    },
    {
        title: 'Bahçe Duvarı Kalıplarında Yeni Trendler',
        excerpt: 'Modern peyzaj düzenlemelerinde kullanılan estetik ve dayanıklı bahçe duvarı kalıp modellerini inceliyoruz.',
        content: `
            <p class="lead text-xl text-gray-600 dark:text-gray-400 mb-8">
                Bahçe duvarları, sadece güvenlik sağlamakla kalmaz, aynı zamanda yapının estetik görünümünü de tamamlar.
                Son yıllarda gelişen kalıp teknolojileri ile birlikte, desenli ve dekoratif bahçe duvarları oldukça popüler hale geldi.
            </p>
            <p>Detaylı içerik hazırlanıyor...</p>
        `,
        date: '2025-11-25T14:30:00Z',
        author: 'Admin',
        image: ''
    },
    {
        title: 'Çelik Kalıp mı, Plastik Kalıp mı?',
        excerpt: 'Hangi durumda hangi kalıp türünü tercih etmelisiniz? Avantajlar ve dezavantajlar karşılaştırması.',
        content: `
            <p class="lead text-xl text-gray-600 dark:text-gray-400 mb-8">
                İnşaat sektöründe en çok tartışılan konulardan biri: Çelik kalıp mı yoksa plastik kalıp mı?
                Her iki sistemin de kendine özgü avantajları ve dezavantajları bulunmaktadır.
            </p>
            <p>Detaylı içerik hazırlanıyor...</p>
        `,
        date: '2025-11-20T09:15:00Z',
        author: 'Admin',
        image: ''
    },
];

async function main() {
    console.log('Start seeding posts...');

    for (const post of POSTS) {
        const slug = generateSlug(post.title);

        const existingPost = await prisma.post.findUnique({
            where: { slug },
        });

        if (!existingPost) {
            await prisma.post.create({
                data: {
                    title: post.title,
                    slug: slug,
                    excerpt: post.excerpt,
                    content: post.content,
                    published: true,
                    publishedAt: new Date(post.date),
                    authorId: post.author,
                },
            });
            console.log(`Created post: ${post.title}`);
        } else {
            console.log(`Post already exists: ${post.title}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
