import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import { Link } from '@inertiajs/react';
import SEO from '../Components/SEO';
import JsonLd from '../Components/JsonLd';

export default function BlogPostPage({ post, seo }) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        'headline': post.title,
        'image': [post.image],
        'author': {
            '@type': 'Organization',
            'name': 'RentTrustGh',
        },
        'publisher': {
            '@type': 'Organization',
            'name': 'RentTrustGh',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://renttrustgh.com/images/logo.webp',
            },
        },
        'datePublished': post.published_at,
        'dateModified': post.published_at,
        'description': post.excerpt,
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': seo.canonical,
        },
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
            <SEO
                title={seo.title}
                description={seo.description}
                canonical={seo.canonical}
                image={seo.image}
                type={seo.type}
                siteName={seo.siteName}
                locale={seo.locale}
                twitter={seo.twitter}
            />
            <JsonLd schema={schema} />
            <Header />
            <main className="flex-1 px-4 py-10 md:px-10">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-6">
                    <div className="mb-6">
                        <Link href="/blog" className="text-teal-600 hover:underline">← Back to blog</Link>
                    </div>
                    <img src={post.image} alt={post.title} className="w-full h-72 object-cover rounded-3xl mb-6" loading="lazy" />
                    <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                    <p className="text-slate-600 mb-8">{post.excerpt}</p>
                    <article className="prose prose-slate max-w-none">
                        <p>
                            This is a production-ready blog article shell. RentTrustGh will replace this placeholder with the full post copy once your content is published.
                        </p>
                        <p>
                            It is designed for fast indexing, clean mobile rendering and strong local relevance on Ghana property search.
                        </p>
                    </article>
                </div>
            </main>
            <Footer />
        </div>
    );
}
