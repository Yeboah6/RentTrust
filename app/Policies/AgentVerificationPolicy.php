<?php

namespace App\Policies;

use App\Models\AgentVerification;
use App\Models\User;

class AgentVerificationPolicy
{
    /**
     * Determine whether the user can view any verifications.
     */
    public function viewAny(User $user): bool
    {
        return $user->super()->exists();
    }

    /**
     * Determine whether the user can view the verification.
     */
    public function view(User $user, AgentVerification $verification): bool
    {
        if ($user->super()->exists()) {
            return true;
        }

        return $user->agent && $user->agent->id === $verification->agent_id;
    }

    /**
     * Determine whether the user can create verifications.
     */
    public function create(User $user): bool
    {
        return $user->agent()->exists();
    }

    /**
     * Determine whether the user can update the verification.
     */
    public function update(User $user, AgentVerification $verification): bool
    {
        return $user->super()->exists();
    }

    /**
     * Determine whether the user can delete the verification.
     */
    public function delete(User $user, AgentVerification $verification): bool
    {
        return $user->super()->exists();
    }
}