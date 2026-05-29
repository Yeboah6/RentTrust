<?php

namespace App\Http\Controllers;

use App\Services\Seo\SitemapService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class SitemapController extends Controller
{
    public function index(Request $request, SitemapService $sitemapService)
    {
        $sitemapPath = public_path('sitemap.xml');

        if (! File::exists($sitemapPath)) {
            $sitemapService->generateSitemaps();
        }

        return response()->file($sitemapPath, [
            'Content-Type' => 'application/xml',
        ]);
    }
}
