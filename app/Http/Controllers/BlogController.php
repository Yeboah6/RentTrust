<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        return inertia('BlogIndexPage', [
            'posts' => config('seo.blog.posts', []),
            'seo' => [
                'title' => 'RentTrustGh Blog | Real Estate Advice for Ghana',
                'description' => 'Explore RentTrustGh blog posts for local property advice, rental tips and market insights across Accra, Kumasi and greater Ghana.',
                'canonical' => rtrim(config('app.url'), '/') . '/blog',
                'image' => config('seo.site.default_image'),
                'type' => 'website',
                'locale' => config('seo.site.locale'),
                'siteName' => config('seo.site.name'),
                'twitter' => config('seo.site.twitter_handle'),
            ],
        ]);
    }

    public function show(Request $request, string $slug)
    {
        $posts = collect(config('seo.blog.posts', []));
        $post = $posts->firstWhere('slug', $slug);

        if (! $post) {
            abort(404);
        }

        return inertia('BlogPostPage', [
            'post' => $post,
            'seo' => app(\App\Services\Seo\SeoService::class)->blogMeta($post),
        ]);
    }
}
