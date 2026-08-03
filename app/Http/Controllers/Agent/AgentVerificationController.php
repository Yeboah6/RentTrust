<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AgentVerification;
use App\Models\Agent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AgentVerificationController extends Controller
{
    /**
     * Submit verification documents (agents)
     */
    public function store(Request $request)
    {
        $agent = Auth::user()->agent;
        
        if (!$agent) {
            return back()->with('error', 'Only agents can submit verification.');
        }

        // Check if there's an existing pending or approved verification
        $existingVerification = AgentVerification::where('agent_id', $agent->id)
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingVerification) {
            if ($existingVerification->status === 'pending') {
                return back()->with('error', 'You already have a pending verification request.');
            }
            if ($existingVerification->status === 'approved') {
                return back()->with('error', 'Your account is already verified.');
            }
        }

        $validated = $request->validate([
            'agent_name' => 'required|string|max:255',
            'email' => 'required|email|unique:agent_verifications,email',
            'phone_number' => 'nullable|string|max:20',
            'gov_id' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'license_documents' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'proof_of_address' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
        ]);

        // Handle file uploads
        $govIdPath = $request->file('gov_id')->store('verifications/gov_ids', 'public');
        
        $licenseDocsPath = null;
        if ($request->hasFile('license_documents')) {
            $licenseDocsPath = $request->file('license_documents')->store('verifications/licenses', 'public');
        }

        $proofOfAddressPath = null;
        if ($request->hasFile('proof_of_address')) {
            $proofOfAddressPath = $request->file('proof_of_address')->store('verifications/address_proofs', 'public');
        }

        // Check if there's a rejected verification to update
        $rejectedVerification = AgentVerification::where('agent_id', $agent->id)
            ->where('status', 'rejected')
            ->first();

        if ($rejectedVerification) {
            // Delete old files
            Storage::disk('public')->delete([
                $rejectedVerification->gov_id,
                $rejectedVerification->license_documents,
                $rejectedVerification->proof_of_address
            ]);

            // Update the rejected verification
            $rejectedVerification->update([
                'agent_name' => $validated['agent_name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'gov_id' => $govIdPath,
                'license_documents' => $licenseDocsPath,
                'proof_of_address' => $proofOfAddressPath,
                'status' => 'pending',
                'notes' => null,
                'submitted_at' => now(),
                'reviewed_at' => null,
                'reviewed_by' => null,
            ]);
        } else {
            // Create new verification
            AgentVerification::create([
                'agent_id' => $agent->id,
                'agent_name' => $validated['agent_name'],
                'email' => $validated['email'],
                'phone_number' => $validated['phone_number'],
                'gov_id' => $govIdPath,
                'license_documents' => $licenseDocsPath,
                'proof_of_address' => $proofOfAddressPath,
                'status' => 'pending',
                'submitted_at' => now(),
            ]);
        }

        return back()->with('success', 'Verification documents submitted successfully. We will review them shortly.');
    }
}
