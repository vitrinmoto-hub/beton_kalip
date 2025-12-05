import { MetadataRoute } from 'next';
import { getProducts } from '@/actions/product-actions';
import { getPosts } from '@/actions/blog-actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Change this to your actual production domain
    const baseUrl = 'https://www.metalkalip.com.tr';

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/products',
        '/blog',
        '/contact',
        '/references',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Product Routes
    const productsResult = await getProducts();
    const products = productsResult.success && productsResult.data ? productsResult.data : [];

    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Dynamic Blog Post Routes
    const postsResult = await getPosts({ status: 'Yayında' });
    const posts = postsResult.success && postsResult.data ? postsResult.data : [];

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
