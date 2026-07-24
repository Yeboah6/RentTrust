import { Head } from '@inertiajs/react';

export default function JsonLd({ schema }) {
    if (!schema) return null;

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(schema),
                }}
            />
        </Head>
    );
}