import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Örnek veriler ekleniyor...\n');

    // ===== KATEGORİLER =====
    console.log('📁 Kategoriler oluşturuluyor...');

    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'beton-kaliplari' },
            update: {},
            create: {
                name: 'Beton Kalıpları',
                slug: 'beton-kaliplari',
                description: 'Yüksek kaliteli beton döküm kalıpları',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'plastik-kaliplar' },
            update: {},
            create: {
                name: 'Plastik Kalıplar',
                slug: 'plastik-kaliplar',
                description: 'Dayanıklı plastik kalıp çeşitleri',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'bordur-kaliplari' },
            update: {},
            create: {
                name: 'Bordür Kalıpları',
                slug: 'bordur-kaliplari',
                description: 'Yol ve kaldırım bordür kalıpları',
            },
        }),
        prisma.category.upsert({
            where: { slug: 'parke-kaliplari' },
            update: {},
            create: {
                name: 'Parke Kalıpları',
                slug: 'parke-kaliplari',
                description: 'Dekoratif parke taşı kalıpları',
            },
        }),
    ]);

    console.log(`✅ ${categories.length} kategori oluşturuldu\n`);

    // ===== ÜRÜNLER =====
    console.log('📦 Ürünler oluşturuluyor...');

    const products = [
        {
            name: '40x40 Kare Beton Kalıbı',
            slug: '40x40-kare-beton-kalibi',
            description: 'Standart 40x40 cm kare beton döküm kalıbı. Yüksek dayanıklılık ve uzun ömür.',
            content: 'Bu kalıp, yüksek kaliteli plastikten üretilmiş olup, beton döküm işlemlerinde mükemmel sonuçlar verir. Kolay kullanım ve temizlik özelliğine sahiptir.',
            dimensions: '40 x 40 x 5 cm',
            weight: '1.2 kg',
            material: 'ABS Plastik',
            categoryId: categories[0].id,
            isFeatured: true,
            order: 1,
        },
        {
            name: '50x50 Büyük Beton Kalıbı',
            slug: '50x50-buyuk-beton-kalibi',
            description: 'Geniş alan uygulamaları için 50x50 cm beton kalıbı.',
            content: 'Büyük alanların döşenmesi için ideal boyut. Profesyonel kullanıma uygun dayanıklı yapı.',
            dimensions: '50 x 50 x 5 cm',
            weight: '1.8 kg',
            material: 'ABS Plastik',
            categoryId: categories[0].id,
            isFeatured: true,
            order: 2,
        },
        {
            name: 'Dekoratif Taş Kalıbı',
            slug: 'dekoratif-tas-kalibi',
            description: 'Doğal taş görünümlü dekoratif beton kalıbı.',
            content: 'Bahçe ve peyzaj düzenlemelerinde kullanılan, doğal taş görünümü veren estetik kalıp.',
            dimensions: '30 x 30 x 4 cm',
            weight: '0.8 kg',
            material: 'Silikon Kaplı Plastik',
            categoryId: categories[1].id,
            isFeatured: true,
            order: 3,
        },
        {
            name: 'Yol Bordür Kalıbı',
            slug: 'yol-bordur-kalibi',
            description: 'Standart yol bordürü üretim kalıbı.',
            content: 'Belediye standartlarına uygun yol bordürü kalıbı. Hızlı üretim ve kolay kalıptan çıkarma.',
            dimensions: '50 x 20 x 25 cm',
            weight: '2.5 kg',
            material: 'Galvanizli Çelik',
            categoryId: categories[2].id,
            isFeatured: false,
            order: 4,
        },
        {
            name: 'Bahçe Bordür Kalıbı',
            slug: 'bahce-bordur-kalibi',
            description: 'Dekoratif bahçe bordürü kalıbı.',
            content: 'Bahçe düzenlemelerinde kullanılan estetik bordür kalıbı. Çiçekli ve desenli seçenekler.',
            dimensions: '40 x 15 x 20 cm',
            weight: '1.5 kg',
            material: 'ABS Plastik',
            categoryId: categories[2].id,
            isFeatured: false,
            order: 5,
        },
        {
            name: 'Kilitli Parke Kalıbı',
            slug: 'kilitli-parke-kalibi',
            description: 'Birbirine kenetlenen kilitli parke taşı kalıbı.',
            content: 'Otopark ve yaya yolları için ideal kilitli parke sistemi. Yüksek basınç dayanımı.',
            dimensions: '20 x 10 x 8 cm',
            weight: '0.4 kg',
            material: 'Polyester',
            categoryId: categories[3].id,
            isFeatured: true,
            order: 6,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
    }

    console.log(`✅ ${products.length} ürün oluşturuldu\n`);

    // ===== BLOG YAZILARI =====
    console.log('📝 Blog yazıları oluşturuluyor...');

    const posts = [
        {
            title: 'Beton Kalıp Seçiminde Dikkat Edilmesi Gerekenler',
            slug: 'beton-kalip-seciminde-dikkat-edilmesi-gerekenler',
            excerpt: 'Doğru beton kalıbı seçmek, projenizin başarısı için kritik öneme sahiptir.',
            content: `
                <h2>Kalıp Malzemesi Seçimi</h2>
                <p>Beton kalıpları farklı malzemelerden üretilebilir: plastik, metal, ahşap veya silikon. Her malzemenin kendine özgü avantajları vardır.</p>
                
                <h3>Plastik Kalıplar</h3>
                <p>Hafif, dayanıklı ve ekonomik seçeneklerdir. Küçük ve orta ölçekli projeler için idealdir.</p>
                
                <h3>Metal Kalıplar</h3>
                <p>Endüstriyel üretim için tercih edilir. Uzun ömürlü ve yüksek basınca dayanıklıdır.</p>
                
                <h2>Boyut ve Şekil</h2>
                <p>Projenizin gereksinimlerine göre doğru boyut ve şekli seçmek önemlidir.</p>
            `,
            published: true,
            publishedAt: new Date(),
        },
        {
            title: 'Bahçe Düzenlemesinde Beton Kullanımı',
            slug: 'bahce-duzenlemesinde-beton-kullanimi',
            excerpt: 'Modern bahçe tasarımlarında beton elemanların önemi giderek artıyor.',
            content: `
                <h2>Bahçede Beton Elemanlar</h2>
                <p>Bahçe düzenlemesinde beton, dayanıklılığı ve estetik çeşitliliği nedeniyle popüler bir tercih haline gelmiştir.</p>
                
                <h3>Yürüyüş Yolları</h3>
                <p>Beton kaldırım taşları ile bahçenizde şık ve dayanıklı yürüyüş yolları oluşturabilirsiniz.</p>
                
                <h3>Bordürler</h3>
                <p>Çim alanları ile çiçek tarhlarını ayırmak için dekoratif beton bordürler kullanılabilir.</p>
            `,
            published: true,
            publishedAt: new Date(),
        },
        {
            title: 'Kalıp Bakımı ve Temizliği Nasıl Yapılır?',
            slug: 'kalip-bakimi-ve-temizligi-nasil-yapilir',
            excerpt: 'Kalıplarınızın ömrünü uzatmak için doğru bakım teknikleri.',
            content: `
                <h2>Kalıp Bakımının Önemi</h2>
                <p>Düzenli bakım, kalıplarınızın ömrünü uzatır ve daha kaliteli ürünler elde etmenizi sağlar.</p>
                
                <h3>Temizlik Adımları</h3>
                <ol>
                    <li>Her kullanımdan sonra kalıbı su ile yıkayın</li>
                    <li>Kalan beton parçalarını yumuşak fırça ile temizleyin</li>
                    <li>Kalıbı kuru bir yerde saklayın</li>
                </ol>
            `,
            published: true,
            publishedAt: new Date(),
        },
    ];

    for (const post of posts) {
        await prisma.post.upsert({
            where: { slug: post.slug },
            update: {},
            create: post,
        });
    }

    console.log(`✅ ${posts.length} blog yazısı oluşturuldu\n`);

    // ===== SİTE AYARLARI (Hakkımızda & İletişim dahil) =====
    console.log('⚙️ Site ayarları oluşturuluyor...');

    await prisma.settings.upsert({
        where: { id: 'default' },
        update: {
            siteName: 'BetonKalıp',
            phone: '+90 555 123 4567',
            email: 'info@betonkalip.com',
            whatsapp: '+90 555 123 4567',
            address: 'Organize Sanayi Bölgesi, 1. Cadde No:25\n34555 Arnavutköy/İstanbul',
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.123456789!2d28.7!3d41.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA2JzAwLjAiTiAyOMKwNDInMDAuMCJF!5e0!3m2!1str!2str!4v1234567890',
            heroTitle: 'Türkiye\'nin Lider Beton Kalıp Üreticisi',
            heroSubtitle: '25 yılı aşkın tecrübemizle, en kaliteli beton kalıpları sizlere sunuyoruz.',
            primaryColor: '#f97316',
            aboutTitle: 'Hakkımızda',
            aboutContent: `
                <p>BetonKalıp olarak 1998 yılından bu yana Türkiye'nin önde gelen beton kalıp üreticilerinden biri olarak faaliyet göstermekteyiz.</p>
                
                <p>25 yılı aşkın sektör tecrübemizle, müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmaktayız. Modern üretim tesislerimizde, son teknoloji makineler kullanarak ürettiğimiz kalıplarımız, Türkiye'nin dört bir yanında güvenle kullanılmaktadır.</p>
                
                <h3>Neden Bizi Tercih Etmelisiniz?</h3>
                <ul>
                    <li><strong>25+ Yıllık Tecrübe:</strong> Sektördeki uzun yılların getirdiği bilgi ve deneyim</li>
                    <li><strong>Kaliteli Üretim:</strong> En kaliteli hammaddeler ve modern üretim teknikleri</li>
                    <li><strong>Geniş Ürün Yelpazesi:</strong> Her ihtiyaca uygun kalıp çeşitleri</li>
                    <li><strong>Hızlı Teslimat:</strong> Türkiye genelinde hızlı ve güvenli kargo</li>
                    <li><strong>Müşteri Memnuniyeti:</strong> Satış sonrası destek ve garanti</li>
                </ul>
            `,
            missionTitle: 'Misyonumuz',
            missionContent: 'Müşterilerimize en yüksek kalitede beton kalıpları sunarak, inşaat sektörünün gelişimine katkıda bulunmak ve sektörde güvenilir bir iş ortağı olmak.',
            visionTitle: 'Vizyonumuz',
            visionContent: 'Türkiye\'nin ve bölgenin lider beton kalıp üreticisi olarak, yenilikçi ürünler ve sürdürülebilir üretim anlayışıyla sektöre yön veren bir marka olmak.',
            homeMetaTitle: 'BetonKalıp - Türkiye\'nin Lider Beton Kalıp Üreticisi',
            homeMetaDescription: 'Yüksek kaliteli beton kalıpları, plastik kalıplar, bordür ve parke kalıpları. 25 yıllık tecrübe ile hizmetinizdeyiz.',
        },
        create: {
            id: 'default',
            siteName: 'BetonKalıp',
            phone: '+90 555 123 4567',
            email: 'info@betonkalip.com',
            whatsapp: '+90 555 123 4567',
            address: 'Organize Sanayi Bölgesi, 1. Cadde No:25\n34555 Arnavutköy/İstanbul',
            mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.123456789!2d28.7!3d41.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA2JzAwLjAiTiAyOMKwNDInMDAuMCJF!5e0!3m2!1str!2str!4v1234567890',
            heroTitle: 'Türkiye\'nin Lider Beton Kalıp Üreticisi',
            heroSubtitle: '25 yılı aşkın tecrübemizle, en kaliteli beton kalıpları sizlere sunuyoruz.',
            primaryColor: '#f97316',
            aboutTitle: 'Hakkımızda',
            aboutContent: `
                <p>BetonKalıp olarak 1998 yılından bu yana Türkiye'nin önde gelen beton kalıp üreticilerinden biri olarak faaliyet göstermekteyiz.</p>
                
                <p>25 yılı aşkın sektör tecrübemizle, müşterilerimize en kaliteli ürünleri en uygun fiyatlarla sunmaktayız. Modern üretim tesislerimizde, son teknoloji makineler kullanarak ürettiğimiz kalıplarımız, Türkiye'nin dört bir yanında güvenle kullanılmaktadır.</p>
                
                <h3>Neden Bizi Tercih Etmelisiniz?</h3>
                <ul>
                    <li><strong>25+ Yıllık Tecrübe:</strong> Sektördeki uzun yılların getirdiği bilgi ve deneyim</li>
                    <li><strong>Kaliteli Üretim:</strong> En kaliteli hammaddeler ve modern üretim teknikleri</li>
                    <li><strong>Geniş Ürün Yelpazesi:</strong> Her ihtiyaca uygun kalıp çeşitleri</li>
                    <li><strong>Hızlı Teslimat:</strong> Türkiye genelinde hızlı ve güvenli kargo</li>
                    <li><strong>Müşteri Memnuniyeti:</strong> Satış sonrası destek ve garanti</li>
                </ul>
            `,
            missionTitle: 'Misyonumuz',
            missionContent: 'Müşterilerimize en yüksek kalitede beton kalıpları sunarak, inşaat sektörünün gelişimine katkıda bulunmak ve sektörde güvenilir bir iş ortağı olmak.',
            visionTitle: 'Vizyonumuz',
            visionContent: 'Türkiye\'nin ve bölgenin lider beton kalıp üreticisi olarak, yenilikçi ürünler ve sürdürülebilir üretim anlayışıyla sektöre yön veren bir marka olmak.',
            homeMetaTitle: 'BetonKalıp - Türkiye\'nin Lider Beton Kalıp Üreticisi',
            homeMetaDescription: 'Yüksek kaliteli beton kalıpları, plastik kalıplar, bordür ve parke kalıpları. 25 yıllık tecrübe ile hizmetinizdeyiz.',
        },
    });

    console.log('✅ Site ayarları, Hakkımızda ve İletişim bilgileri oluşturuldu\n');

    // ===== REFERANSLAR =====
    console.log('🏢 Referanslar oluşturuluyor...');

    const references = [
        { name: 'İstanbul Büyükşehir Belediyesi', description: 'Şehir parkları ve kaldırım projeleri', order: 1 },
        { name: 'Ankara Büyükşehir Belediyesi', description: 'Yol bordür projeleri', order: 2 },
        { name: 'ABC İnşaat A.Ş.', description: 'Toplu konut projeleri', order: 3 },
        { name: 'XYZ Peyzaj Ltd.', description: 'Bahçe düzenleme projeleri', order: 4 },
    ];

    for (const ref of references) {
        await prisma.reference.upsert({
            where: { id: ref.name.toLowerCase().replace(/\s+/g, '-') },
            update: {},
            create: {
                id: ref.name.toLowerCase().replace(/\s+/g, '-'),
                name: ref.name,
                description: ref.description,
                order: ref.order,
                isActive: true,
            },
        });
    }

    console.log(`✅ ${references.length} referans oluşturuldu\n`);

    // ===== HERO SLIDER =====
    console.log('🖼️ Hero slider oluşturuluyor...');

    const slides = [
        {
            id: 'slide-1',
            title: 'Kaliteli Beton Kalıpları',
            subtitle: '25 yıllık tecrübe ile üretim',
            image: '/images/hero-1.jpg',
            ctaText: 'Ürünleri İncele',
            ctaLink: '/products',
            order: 1,
            isActive: true,
        },
        {
            id: 'slide-2',
            title: 'Geniş Ürün Yelpazesi',
            subtitle: 'Her ihtiyaca uygun çözümler',
            image: '/images/hero-2.jpg',
            ctaText: 'Kategorilere Göz At',
            ctaLink: '/products',
            order: 2,
            isActive: true,
        },
    ];

    for (const slide of slides) {
        await prisma.heroSlide.upsert({
            where: { id: slide.id },
            update: {},
            create: slide,
        });
    }

    console.log(`✅ ${slides.length} slider oluşturuldu\n`);

    console.log('🎉 Tüm örnek veriler başarıyla eklendi!');
    console.log('📋 Eklenen içerikler:');
    console.log('   - 4 Kategori');
    console.log('   - 6 Ürün');
    console.log('   - 3 Blog yazısı');
    console.log('   - Site ayarları (Hakkımızda, İletişim dahil)');
    console.log('   - 4 Referans');
    console.log('   - 2 Hero slider');
}

main()
    .catch((e) => {
        console.error('Hata:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
