<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log, Storage};
use App\Models\AdminAuditLog;
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
            'updated_at'      => now(),
        ]);

        AdminAuditLog::record('review', 'Replied to review', [
            'affected_user' => $review->full_name ?? $review->reviewer_name ?? 'Anonymous',
            'affected_id'   => $review->id,
            'notes'         => $request->response,
            'properties'    => ['listing_id' => $review->rental_id ?? $review->listing_id],
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

        $previousStatus = $report->status;

        $report->update([
            'status'      => $request->status,
            'resolved_by' => auth()->id(),
            'updated_at'  => now(),
        ]);

        AdminAuditLog::record('report', 'Report status updated', [
            'affected_user' => $report->full_name ?? $report->reporter_name ?? 'Anonymous',
            'affected_id'   => $report->id,
            'notes'         => "Status changed from \"{$previousStatus}\" to \"{$request->status}\".",
            'properties'    => ['from' => $previousStatus, 'to' => $request->status],
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
        $id   = $review->id;
        $name = $review->full_name ?? $review->reviewer_name ?? 'Anonymous';

        $review->delete();

        AdminAuditLog::record('review', 'Review deleted', [
            'affected_user' => $name,
            'affected_id'   => $id,
            'notes'         => 'Rent review permanently deleted.',
            'properties'    => [],
        ]);

        Log::info('SuperAdmin deleted review', [
            'review_id' => $id,
            'admin_id'  => auth()->id(),
        ]);

        return back()->with('success', 'Review deleted.');
    }

    // ─── Delete app review ────────────────────────────────────────────────────

    public function deleteAppReview($review)
    {
        $review = Review::where('id', $review->id)->where('review_type', 'app')->firstOrFail();
        $id     = $review->id;
        $name   = $review->full_name ?? $review->reviewer_name ?? 'Anonymous';

        $review->delete();

        AdminAuditLog::record('review', 'App review deleted', [
            'affected_user' => $name,
            'affected_id'   => $id,
            'notes'         => 'App review permanently deleted.',
            'properties'    => [],
        ]);

        Log::info('SuperAdmin deleted app review', [
            'review_id' => $id,
            'admin_id'  => auth()->id(),
        ]);

        return back()->with('success', 'App review deleted.');
    }

    // ─── Delete report ────────────────────────────────────────────────────────

    public function deleteReport(Report $report)
    {
        $id   = $report->id;
        $name = $report->full_name ?? $report->reporter_name ?? 'Anonymous';
    
        $report->delete();
    
        AdminAuditLog::record('report', 'Report deleted', [
            'affected_user' => $name,
            'affected_id'   => $id,
            'notes'         => 'Report permanently deleted.',
            'properties'    => [],
        ]);
    
        Log::info('SuperAdmin deleted report', [
            'report_id' => $id,
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
            'report_id'          => $r->report_id,
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
            'evidence'           => $r->evidence,
            'created_at'         => $r->created_at?->toISOString(),
        ];
    }

    /**
     * Download report evidence file
     */
    public function downloadReportEvidence(Request $request, Report $report, string $filename)
    {
        // URL decode the filename parameter if needed
        $filename = urldecode($filename);

        // Check if the evidence file exists in the report's evidence array
        $evidence = $report->evidence ?? [];
        $foundFile = null;

        foreach ($evidence as $evidenceItem) {
            if (is_string($evidenceItem) && ($evidenceItem === $filename || basename($evidenceItem) === $filename)) {
                $foundFile = $evidenceItem;
                break;
            }
        }

        if (!$foundFile) {
            abort(404, 'Evidence file not found');
        }

        // Construct the full path
        $filePath = 'report_files/' . basename($foundFile);

        // Check if file exists in storage
        if (!Storage::disk('public')->exists($filePath)) {
            abort(404, 'Evidence file not found on disk');
        }

        // Return the file for download
        return Storage::disk('public')->download($filePath, $filename);
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
