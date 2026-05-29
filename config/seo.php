<?php

return [
    'site' => [
        'name' => 'RentTrustGh',
        'title' => 'RentTrustGh | Trusted Real Estate in Ghana',
        'description' => 'RentTrustGh helps Ghanaian renters and buyers discover verified apartments, houses, and investment properties with fast search, trusted agents, and local area insights.',
        'url' => env('APP_URL', 'https://renttrustgh.com'),
        'twitter_handle' => '@RentTrustGh',
        'locale' => 'en_GH',
        'default_image' => 'https://renttrustgh.com/images/seo/hero.webp',
        'logo' => 'https://renttrustgh.com/images/logo.webp',
    ],

    'organization' => [
        'name' => 'RentTrustGh',
        'url' => env('APP_URL', 'https://renttrustgh.com'),
        'logo' => 'https://renttrustgh.com/images/logo.webp',
        'same_as' => [
            'https://www.facebook.com/RentTrustGh',
            'https://www.instagram.com/RentTrustGh',
            'https://www.linkedin.com/company/renttrustgh',
        ],
        'contact_point' => [
            '@type' => 'ContactPoint',
            'telephone' => '+233000000000',
            'contactType' => 'customer support',
            'areaServed' => 'GH',
            'availableLanguage' => ['English'],
        ],
    ],

    'location_pages' => [
        'accra' => [
            'title' => 'Properties for Rent and Sale in Accra | RentTrustGh',
            'description' => 'Explore verified homes, apartments and houses in Accra. Compare rental and sale options, view top neighborhoods, and find your new home with RentTrustGh.',
            'h1' => 'Accra Real Estate Listings',
            'keywords' => 'Accra homes, Accra rentals, Accra properties, Accra houses for sale',
        ],
        'east-legon' => [
            'title' => 'East Legon Apartments for Rent and Sale | RentTrustGh',
            'description' => 'Find the best apartments and houses in East Legon for rent or sale. Trusted listings, neighbourhood guides, and verified agents for East Legon properties.',
            'h1' => 'East Legon Properties',
            'keywords' => 'East Legon apartments, East Legon rentals, East Legon properties, East Legon real estate',
        ],
        'tema' => [
            'title' => 'Tema Properties for Rent and Sale | RentTrustGh',
            'description' => 'Discover trusted Tema listings for rent and sale. Browse residential homes, affordable apartments and the latest property offers in Tema.',
            'h1' => 'Tema Real Estate',
            'keywords' => 'Tema properties, Tema rentals, Tema houses for sale, Tema homes',
        ],
        'kumasi' => [
            'title' => 'Kumasi Property Listings | RentTrustGh',
            'description' => 'Search Kumasi apartments and houses for rent or sale. RentTrustGh helps buyers and renters find verified listings in Kumasi and surrounding neighbourhoods.',
            'h1' => 'Kumasi Property Search',
            'keywords' => 'Kumasi rentals, Kumasi houses for rent, Kumasi homes for sale',
        ],
        'spintex' => [
            'title' => 'Spintex Homes for Rent and Sale | RentTrustGh',
            'description' => 'Explore Spintex properties with trusted listings, competitive pricing and local SEO-optimized neighbourhood pages for rentals and sales.',
            'h1' => 'Spintex Property Listings',
            'keywords' => 'Spintex rentals, Spintex houses, Spintex apartments for sale',
        ],
        'madina' => [
            'title' => 'Madina Real Estate Listings | RentTrustGh',
            'description' => 'Discover rental and sale listings in Madina. Verified homes, apartments and agents to help you find the best Madina property.',
            'h1' => 'Madina Properties',
            'keywords' => 'Madina rentals, Madina houses for sale, Madina apartments',
        ],
        'airport-residential' => [
            'title' => 'Airport Residential Estate Properties | RentTrustGh',
            'description' => 'Browse Airport Residential Estate homes, villas and apartments for rent or sale. Secure your next property in one of Accra’s premium neighbourhoods.',
            'h1' => 'Airport Residential Estate Listings',
            'keywords' => 'Airport Residential Estate rentals, Airport Residential Estate properties, Airport Residential Estate homes',
        ],
    ],

    'blog' => [
        'posts' => [
            [
                'slug' => 'how-to-find-the-best-rental-in-accra',
                'title' => 'How to Find the Best Rental in Accra',
                'excerpt' => 'Discover practical tips for renting in Accra, from neighbourhood selection to verification and lease negotiation.',
                'published_at' => '2025-09-10',
                'image' => 'https://renttrustgh.com/images/blog/rental-accra.webp',
            ],
            [
                'slug' => 'why-east-legon-is-a-top-investment-area',
                'title' => 'Why East Legon Is a Top Investment Area',
                'excerpt' => 'Learn why investors and renters are choosing East Legon, with insights into pricing, amenities and local lifestyle.',
                'published_at' => '2025-10-02',
                'image' => 'https://renttrustgh.com/images/blog/east-legon-real-estate.webp',
            ],
            [
                'slug' => 'local-guide-to-renting-in-kumasi',
                'title' => 'Local Guide to Renting in Kumasi',
                'excerpt' => 'A practical guide for finding safe, affordable and verified rentals in Kumasi’s most desirable communities.',
                'published_at' => '2025-11-05',
                'image' => 'https://renttrustgh.com/images/blog/kumasi-rentals.webp',
            ],
        ],
    ],

    'static_pages' => [
        '/about',
        '/guide',
        '/safety',
        '/faq',
        '/terms',
        '/privacy',
        '/report',
        '/pricing',
        '/contact',
        '/agents',
        '/sign-up',
        '/login',
    ],
];
