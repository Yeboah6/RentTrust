<?php

namespace App\Policies;

use App\Models\VerificationRequest;
use App\Models\User;

class VerificationRequestPolicy
{
    /**
     * Determine whether the user can view any verification requests.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can view the verification request.
     */
    public function view(User $user, VerificationRequest $verificationRequest): bool
    {
        return $user->hasRole('super_admin') || 
               $user->id === $verificationRequest->agent_id ||
               $user->id === $verificationRequest->user_id;
    }

    /**
     * Determine whether the user can create verification requests.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['agent', 'landlord', 'super_admin']);
    }

    /**
     * Determine whether the user can update the verification request.
     */
    public function update(User $user, VerificationRequest $verificationRequest): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can delete the verification request.
     */
    public function delete(User $user, VerificationRequest $verificationRequest): bool
    {
        return $user->hasRole('super_admin') || 
               ($user->id === $verificationRequest->agent_id && $verificationRequest->status === 'pending');
    }

    /**
     * Determine whether the user can restore the verification request.
     */
    public function restore(User $user, VerificationRequest $verificationRequest): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can permanently delete the verification request.
     */
    public function forceDelete(User $user, VerificationRequest $verificationRequest): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can approve the verification request.
     */
    public function approve(User $user, VerificationRequest $verificationRequest): bool
    {
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can reject the verification request.
     */
    public function reject(User $user, VerificationRequest $verificationRequest): bool
    {
        return $user->hasRole('super_admin');
    }
}