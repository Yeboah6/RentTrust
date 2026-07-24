import { Head } from '@inertiajs/react';

const defaultSiteUrl = typeof window !== 'undefined' ? window.location.origin : '';

export default function SEO({
    title='RentTrustGh - Find Your Perfect Rental Home in Ghana',
    description,
    canonical,
    image,
    type = 'website',
    siteName = 'RentTrustGh',
    locale = 'en_GH',
    // twitter = '@RentTrustGh',
    noIndex = false,
    additionalMeta = [],
}) {
    const canonicalUrl = canonical || defaultSiteUrl;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={locale} />
            {image ? <meta property="og:image" content={image} /> : null}
            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:site" content={twitter} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {/* {image ? <meta name="twitter:image" content={image} /> : null} */}
            {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
            {additionalMeta.map(({ name, content, property, key }) => (
                <meta
                    key={key || `${name || property}-${content}`}
                    name={name}
                    property={property}
                    content={content}
                />
            ))}
        </Head>
    );
}
