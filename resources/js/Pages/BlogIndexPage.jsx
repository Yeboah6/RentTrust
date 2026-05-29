import Header from '../Components/Layouts/Header';
import Footer from '../Components/Layouts/Footer';
import { Link } from '@inertiajs/react';
import SEO from '../Components/SEO';

export default function BlogIndexPage({ posts, seo }) {
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
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
            <Header />
            <main className="flex-1 px-4 py-10 md:px-10">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">RentTrustGh Blog</h1>
                    <p className="text-slate-600 mb-8">Real estate insights for renters, buyers and investors across Ghana.</p>
                    <div className="grid gap-6 sm:grid-cols-2">
                        {posts.map((post) => (
                            <article key={post.slug} className="rounded-3xl border p-6 shadow-sm hover:shadow-lg transition-shadow bg-white">
                                <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-2xl mb-4" loading="lazy" />
                                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                <p className="text-slate-600 mb-4">{post.excerpt}</p>
                                <Link href={`/blog/${post.slug}`} className="text-teal-600 hover:underline">Read article</Link>
                            </article>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
