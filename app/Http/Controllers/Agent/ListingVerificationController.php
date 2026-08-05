<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\ListingVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ListingVerificationController extends Controller
{
    private const MAX_FILE_KB = 10240; // 10MB, matches frontend limit
    private const ALLOWED_MIMES = 'jpg,jpeg,png,pdf,doc,docx';
    private const AVAILABILITY_OPTIONS = ['available', 'rented', 'sold', 'unavailable'];
    // private const ADMIN_ROLES = ['admin', 'super_admin'];

    public function store(Request $request)
    {
        $validated = $request->validate([
            'listing_id' => ['required', 'integer', 'exists:rentals,id'],
            'property_title' => ['required', 'string', 'max:255'],
            'property_address' => ['required', 'string', 'max:255'],
            'availability_status' => ['required', Rule::in(self::AVAILABILITY_OPTIONS)],
            'notes' => ['nullable', 'string', 'max:2000'],
            'ownership_documents' => ['nullable', 'array'],
            'ownership_documents.*' => ['file', 'mimes:' . self::ALLOWED_MIMES, 'max:' . self::MAX_FILE_KB],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['file', 'mimes:' . self::ALLOWED_MIMES, 'max:' . self::MAX_FILE_KB],
            'other_documents' => ['nullable', 'array'],
            'other_documents.*' => ['file', 'mimes:' . self::ALLOWED_MIMES, 'max:' . self::MAX_FILE_KB],
        ]);
 
        $hasDocs = $request->hasFile('ownership_documents')
            || $request->hasFile('photos')
            || $request->hasFile('other_documents');
 
        if (! $hasDocs) {
            return back()->withErrors(['ownership_documents' => 'Please upload at least one document.']);
        }
 
        // One pending/approved request per listing at a time.
        $alreadyActive = ListingVerification::where('listing_id', $validated['listing_id'])
            ->whereIn('status', ['pending', 'approved'])
            ->exists();
 
        if ($alreadyActive) {
            return back()->withErrors(['listing_id' => 'This listing already has an active verification request.']);
        }
 
        ListingVerification::create([
            'listing_id' => $validated['listing_id'],
            'user_id' => Auth::id(),
            'property_title' => $validated['property_title'],
            'property_address' => $validated['property_address'],
            'availability_status' => $validated['availability_status'],
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
            'submitted_at' => now(),
            'ownership_documents' => $this->storeFiles($request, 'ownership_documents', $validated['listing_id']),
            'photos' => $this->storeFiles($request, 'photos', $validated['listing_id']),
            'other_documents' => $this->storeFiles($request, 'other_documents', $validated['listing_id']),
        ]);
 
        return back()->with('success', 'Verification request submitted.');
    }

    private function storeFiles(Request $request, string $field, int $listingId): ?array
    {
        if (! $request->hasFile($field)) {
            return null;
        }
 
        return collect($request->file($field))
            ->map(fn ($file) => $file->store("verifications/listings/{$field}", 'public'))
            ->all();
    }
}
