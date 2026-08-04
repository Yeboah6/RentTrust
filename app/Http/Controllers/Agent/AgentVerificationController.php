<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\AgentVerification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AgentVerificationController extends Controller
{
    public function store(Request $request)
    {
        $agentId = Auth::id();
        $existing = AgentVerification::where('agent_id', $agentId)->first();
        $isResubmission = (bool) $existing;

        $validated = $request->validate([
            'agent_name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('agent_verifications', 'email')->ignore($existing?->id),
            ],
            'phone_number' => 'nullable|string|max:30',
            'gov_id' => ($existing?->gov_id ? 'nullable' : 'required') . '|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'license_documents' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'proof_of_address' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'notes' => 'nullable|string',
        ]);

        $data = [
            'agent_id' => $agentId,
            'agent_name' => $validated['agent_name'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'] ?? null,
            'status' => 'pending',
            'submitted_at' => now(),
            'reviewed_at' => null,
            'reviewed_by' => null,
            'notes' => $validated['notes'] ?? null,
        ];

        if ($request->hasFile('gov_id')) {
            $data['gov_id'] = $request->file('gov_id')->store('verifications/gov_id', 'public');
        }
        if ($request->hasFile('license_documents')) {
            $data['license_documents'] = $request->file('license_documents')->store('verifications/license', 'public');
        }
        if ($request->hasFile('proof_of_address')) {
            $data['proof_of_address'] = $request->file('proof_of_address')->store('verifications/address', 'public');
        }

        if ($existing) {
            $existing->update($data);
        } else {
            AgentVerification::create($data);
        }

        // Confirmation to the agent
        Mail::raw(
            "Hi {$validated['agent_name']},\n\n" .
            ($isResubmission
                ? "We've received your resubmitted verification documents and they're back in the review queue."
                : "We've received your verification documents and they're now in the review queue.") .
            "\n\nWe'll email you as soon as a decision has been made.\n\nYou can go ahead and submit more listings at any time.\n\nRentTrustGH",
            function ($message) use ($validated) {
                $message->to($validated['email'])
                    ->subject($isResubmission ?? false
                        ? 'Verification resubmitted — RentTrustGH'
                        : 'Verification received — RentTrustGH');
            }
        );

        // Heads-up to the admin team
        Mail::raw(
            "{$validated['agent_name']} ({$validated['email']}) just " .
            ($isResubmission ? 're-submitted' : 'submitted') .
            " agent verification documents.\n\n" .
            "Review it in the admin panel: " . url('/super-admin/verifications') . "?search=" . urlencode($validated['email']),
            function ($message) {
                $message->to(config('mail.mail', 'renttrust2026@gmail.com'))
                    ->subject('New agent verification submission');
            }
        );

        return back()->with('success', 'Verification submitted for review.');
    }
}