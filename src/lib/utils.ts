/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
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
