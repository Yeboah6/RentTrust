<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Report;
// use App\Models\AppReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ReviewsReportsController extends Controller
{
    // ─── Index ────────────────────────────────────────────────────────────────

    public function index()
    {
        $reviews = Review::latest()
        ->where('review_type', 'rent')
            ->get()
            ->map(fn ($r) => $this->formatReview($r));

        $reports = Report::latest()
            ->get()
            ->map(fn ($r) => $this->formatReport($r));

        $appReviews = Review::latest()
            ->where('review_type', 'app')
            ->get()
            ->map(fn ($r) => $this->formatAppReview($r));

        return Inertia::render('SuperAdmin/ReportsReviews/Index', [
            'reviews'     => $reviews,
            'reports'     => $reports,
            'app_reviews' => $appReviews,
        ]);
    }

    // ─── Post reply to a rent review ──────────────────────────────────────────

    public function reply(Request $request, Review $review)
    {
        $request->validate([
            'response' => ['required', 'string', 'max:1000'],
        ]);

        $review->update([
            'response'        => $request->response,
            'response_person' => auth()->user()->name,
            'updated_at'    => now(),
        ]);

        Log::info('SuperAdmin replied to review', [
            'review_id' => $review->id,
            'admin_id'  => auth()->id(),
        ]);

        return back()->with('success', 'Reply posted successfully.');
    }

    // ─── Update report status ─────────────────────────────────────────────────

    public function reportStatus(Request $request, Report $report)
    {
        $request->validate([
            'status' => ['required', 'in:pending,reviewing,resolved,dismissed'],
        ]);

        $report->update([
            'status'      => $request->status,
            'resolved_by' => auth()->id(),
            'updated_at' => in_array($request->status, ['resolved', 'dismissed']) ? now() : null,
        ]);

        Log::info('SuperAdmin updated report status', [
            'report_id' => $report->id,
            'status'    => $request->status,
            'admin_id'  => auth()->id(),
        ]);

        return back()->with('success', "Report marked as {$request->status}.");
    }

    // ─── Delete review ────────────────────────────────────────────────────────

    public function deleteReview(Review $review)
    {
        $review->delete();

        Log::info('SuperAdmin deleted review', [
            'review_id' => $review->id,
            'admin_id'  => auth()->id(),
        ]);

        return back()->with('success', 'Review deleted.');
    }

    // ─── Delete app review ────────────────────────────────────────────────────

    public function deleteAppReview($review)
    {
        $review = Review::where('id', $review->id)->where('review_type', 'app')->firstOrFail();
        $review->delete();

        Log::info('SuperAdmin deleted app review', [
            'review_id' => $review->id,
            'admin_id'  => auth()->id(),
        ]);

        return back()->with('success', 'App review deleted.');
    }

    // ─── Delete report ────────────────────────────────────────────────────────

    public function deleteReport(Report $report)
    {
        $report->delete();

        Log::info('SuperAdmin deleted report', [
            'report_id' => $report->id,
            'admin_id'  => auth()->id(),
        ]);

        return back()->with('success', 'Report deleted.');
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    private function formatReview(Review $r): array
    {
        return [
            'id'                           => $r->id,
            'full_name'                    => $r->full_name
                                           ?? $r->reviewer_name
                                           ?? $r->name
                                           ?? 'Anonymous',
            'overall_rating'               => $r->overall_rating ?? $r->rating,
            'landlord_responsive'          => $r->landlord_responsive,
            'property_matched_description' => $r->property_matched_description,
            'fair_pricing'                 => $r->fair_pricing,
            'good_communication'           => $r->good_communication,
            'comments'                     => $r->comments ?? $r->review,
            'response'                     => $r->response,
            'response_person'              => $r->response_person,
            'listing_id'                   => $r->rental_id ?? $r->listing_id ?? $r->property_id,
            'listing_title'                => optional($r->rental)->title
                                           ?? optional($r->listing)->title
                                           ?? $r->listing_title
                                           ?? $r->property_title,
            'created_at'                   => $r->created_at?->toISOString(),
        ];
    }

    private function formatReport(Report $r): array
    {
        return [
            'id'                 => $r->id,
            'full_name'          => $r->full_name ?? $r->reporter_name ?? 'Anonymous',
            'report_type'        => $r->report_type,
            'title'              => $r->title,
            'report_description' => $r->report_description ?? $r->description,
            'status'             => $r->status ?? 'pending',
            'listing_id'         => $r->rental_id ?? $r->listing_id ?? $r->property_id,
            'listing_title'      => optional($r->rental)->title
                                 ?? optional($r->listing)->title
                                 ?? $r->listing_title
                                 ?? $r->property_title,
            'created_at'         => $r->created_at?->toISOString(),
        ];
    }

    private function formatAppReview($r): array
    {
        $r = Review::where('id', $r->id)->where('review_type', 'app')->firstOrFail();

        return [
            'id'             => $r->id,
            'full_name'      => $r->full_name ?? $r->reviewer_name ?? 'Anonymous',
            'overall_rating' => $r->overall_rating,
            'comments'       => $r->comments,
            'created_at'     => $r->created_at?->toISOString(),
        ];
    }
}
