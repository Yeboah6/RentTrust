<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Log, Auth};
use App\Models\Review;
use App\Models\Report;

class ReviewController extends Controller
{
    public function reviews()
    {
        $reviews = Review::where('review_type', 'rent')->get();
        $reports = DB::table('reports')
            ->join('rentals', 'reports.rental_id', '=', 'rentals.id')
            ->select('reports.*', 'rentals.title', 'rentals.city', 'rentals.area', 'rentals.purpose', 'rentals.agent_name', 'rentals.agent_phone', 'rentals.agent_email', 'rentals.is_verified')
            ->get();

        $appReviews = Review::where('review_type', 'app')->get();

        return inertia('Static/ReviewsPage',
            [
                'reviews' => $reviews,
                'reports' => $reports,
                'appReviews' => $appReviews,
            ]);
    }

    public function storeReviewForms(Request $request)
    {
        $user = Auth::user();
        if ((! $request->has('full_name') || trim($request->input('full_name')) === '') && ($user)) {
            $name = $user->fullName ?? null;
            if ($name) {
                $request->merge(['full_name' => $name]);
            }
        }

        $validated = $request->validate([
            'overall_rating' => 'required|integer|min:1|max:5',
            'landlord_responsive' => 'nullable|boolean',
            'property_matched_description' => 'nullable|boolean',
            'fair_pricing' => 'nullable|boolean',
            'good_communication' => 'nullable|boolean',
            'comments' => 'nullable|string|max:255',
            'full_name' => 'required|string|max:255',
            'rental_id' => 'required|exists:rentals,id',
        ], [
            'overall_rating.required' => 'Please provide an overall rating.',
            'overall_rating.integer' => 'Rating must be a whole number.',
            'overall_rating.min' => 'Rating must be at least 1 star.',
            'overall_rating.max' => 'Rating cannot be more than 5 stars.',
            'full_name.required' => 'Your name is required.',
            'rental_id.required' => 'Rental property is required.',
            'rental_id.exists' => 'The selected rental property does not exist.',
        ]);

        try {
            $checkboxFields = [
                'landlord_responsive',
                'property_matched_description',
                'fair_pricing',
                'good_communication',
            ];

            foreach ($checkboxFields as $field) {
                $validated[$field] = $request->has($field) ? true : false;
            }

            // Create the review
            $review = Review::create([
                'review_id' => Review::generateUUID(),
                'rental_id' => $validated['rental_id'],
                'overall_rating' => $validated['overall_rating'],
                'landlord_responsive' => $validated['landlord_responsive'] ?? false,
                'property_matched_description' => $validated['property_matched_description'] ?? false,
                'fair_pricing' => $validated['fair_pricing'] ?? false,
                'good_communication' => $validated['good_communication'] ?? false,
                'comments' => $validated['comments'] ?? null,
                'full_name' => $validated['full_name'],
            ]);

            // Success response
            return redirect()->back()
                ->with('success', 'Thank you for your review! Your feedback has been submitted.');

        } catch (\Exception $e) {
            Log::error('Failed to store review: '.$e->getMessage());

            return redirect()->back()
                ->with('error', 'Failed to submit review. Please try again.')
                ->withInput();
        }
    }

    public function reportListing(Request $request)
    {
        $user = Auth::user();
        if ((! $request->has('name') || trim($request->input('name')) === '') && ($user)) {
            $name = $user->fullName ?? null;
            if ($name) {
                $request->merge(['name' => $name]);
            }
        }

        $validated = $request->validate([
            'property_id' => 'required|exists:rentals,id',
            'description' => 'required|max:255',
            'report_type' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'evidence' => 'nullable|array',
            'evidence.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $filePaths = [];

        // Handle multiple file uploads
        if ($request->hasFile('evidence')) {
            foreach ($request->file('evidence') as $file) {
                if ($file->isValid()) {
                    $fileName = 'report_'.time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
                    $file->storeAs('report_files', $fileName, 'public');
                    $filePaths[] = $fileName;
                }
            }
        }

        $name = $validated['name'] ?? 'Anonymous';

        $report = Report::create([
            'report_id' => Report::generateUUID(),
            'rental_id' => $validated['property_id'],
            'report_description' => $validated['description'],
            'report_type' => $validated['report_type'],
            'full_name' => $name,
            'evidence' => $filePaths,
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Report submitted successfully. Thank you for your feedback.');
    }

    public function storeReviewApp(Request $request)
    {
        $user = Auth::user();
        if ((! $request->has('name') || trim($request->input('name')) === '') && ($user)) {
            $name = $user->fullName ?? null;
            if ($name) {
                $request->merge(['name' => $name]);
            }
        }

        $validated = $request->validate([
            'overall_rating' => 'required|integer|min:1|max:5',
            'name' => 'required|string|max:255',
            'comment' => 'nullable|string|max:255',
        ]);

        Review::create([
            'review_id' => Review::generateUUID(),
            'review_type' => 'app',
            'overall_rating' => $validated['overall_rating'],
            'full_name' => $validated['name'],
            'comments' => $validated['comment'],
        ]);

        return redirect()->back()->with('success', 'Rview added successfully');
    }
}
