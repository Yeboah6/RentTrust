<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    {{-- Default Title (Overridden by Inertia Head) --}}
    <title inertia>RentTrustGh | Ghana's Trusted Property Marketplace</title>

    {{-- Primary Meta --}}
    <meta name="application-name" content="RentTrustGh">
    <meta name="author" content="RentTrustGh">
    <meta name="generator" content="Laravel">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta name="googlebot" content="index,follow">

    {{-- Default Description --}}
    <meta
        name="description"
        content="Find verified houses, apartments, offices, shops, and land for rent or sale across Ghana. Browse trusted listings from landlords and agents on RentTrustGh."
    >

    <meta
        name="keywords"
        content="RentTrustGh, Ghana property, apartments for rent, houses for rent, houses for sale, land for sale, real estate Ghana, Accra apartments, Tema rentals, Kumasi houses"
    >

    {{-- Theme --}}
    <meta name="theme-color" content="#0F766E">

    {{-- Canonical --}}
    <link rel="canonical" href="{{ url()->current() }}">

    {{-- Open Graph --}}
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="RentTrustGh">
    <meta property="og:locale" content="en_GH">

    <meta
        property="og:title"
        content="RentTrustGh | Ghana's Trusted Property Marketplace"
    >

    <meta
        property="og:description"
        content="Discover verified rental and property sale listings throughout Ghana."
    >

    <meta property="og:url" content="{{ url()->current() }}">

    <meta
        property="og:image"
        content="{{ asset('images/seo/og-image.jpg') }}"
    >

    {{-- Twitter --}}
    <meta name="twitter:card" content="summary_large_image">

    <meta
        name="twitter:title"
        content="RentTrustGh | Ghana's Trusted Property Marketplace"
    >

    <meta
        name="twitter:description"
        content="Find trusted rental and property listings in Ghana."
    >

    <meta
        name="twitter:image"
        content="{{ asset('images/seo/og-image.jpg') }}"
    >

    {{-- Favicon --}}
    <link rel="icon" href="{{ asset('rent-trust.png') }}" sizes="32x32">
    <link rel="apple-touch-icon" href="{{ asset('rent-trust.png') }}">

    {{-- Manifest --}}
    {{-- <link rel="manifest" href="{{ asset('site.webmanifest') }}"> --}}

    {{-- Preconnect --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    {{-- Organization JSON-LD --}}
    {{-- <script type="application/ld+json">
    {
      "@context":"https://schema.org",
      "@type":"Organization",
      "name":"RentTrustGh",
      "url":"{{ config('app.url') }}",
      "logo":"{{ asset('/images/rent-trust.png') }}",
      "sameAs":[]
    }
    </script> --}}

    @viteReactRefresh
    @vite('resources/css/app.css')
    @vite('resources/js/app.jsx')

    {{-- Dynamic SEO from React --}}
    @inertiaHead
</head>

<body class="antialiased bg-gray-50 text-gray-900">

    @inertia

</body>
</html>