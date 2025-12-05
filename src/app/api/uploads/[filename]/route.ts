import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        const filePath = join(process.cwd(), 'public', 'uploads', filename);

        if (!existsSync(filePath)) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        const file = await readFile(filePath);

        // Determine content type
        const ext = filename.split('.').pop()?.toLowerCase();
        const contentTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
        };

        const contentType = contentTypes[ext || ''] || 'application/octet-stream';

        return new NextResponse(file, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000',
            },
        });
    } catch (error) {
        console.error('Error serving file:', error);
        return NextResponse.json(
            { error: 'Error serving file' },
            { status: 500 }
        );
    }
}
