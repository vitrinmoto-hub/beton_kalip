import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Maksimum dosya boyutu: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// İzin verilen dosya tipleri
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Dosya bulunamadı' },
                { status: 400 }
            );
        }

        // Dosya tipini kontrol et
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Geçersiz dosya tipi. Sadece resim dosyaları yüklenebilir.' },
                { status: 400 }
            );
        }

        // Dosya boyutunu kontrol et
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'Dosya boyutu çok büyük. Maksimum 5MB yüklenebilir.' },
                { status: 400 }
            );
        }

        // Dosyayı buffer'a çevir
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Uploads klasörünün yolunu belirle
        const uploadsDir = join(process.cwd(), 'public', 'uploads');

        // Uploads klasörü yoksa oluştur
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Benzersiz dosya adı oluştur (timestamp + orijinal ad)
        const timestamp = Date.now();
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${timestamp}-${originalName}`;
        const filePath = join(uploadsDir, fileName);

        // Dosyayı kaydet
        await writeFile(filePath, buffer);

        // API route üzerinden serve edilecek URL
        const publicUrl = `/api/uploads/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            fileName: fileName
        });

    } catch (error) {
        console.error('Dosya yükleme hatası:', error);
        return NextResponse.json(
            { error: 'Dosya yüklenirken bir hata oluştu' },
            { status: 500 }
        );
    }
}
