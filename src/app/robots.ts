import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    // Change this to your actual production domain
    const baseUrl = 'https://www.metalkalip.com.tr';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/', // Disallow admin routes
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
