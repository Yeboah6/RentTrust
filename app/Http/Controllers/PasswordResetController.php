<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\{Hash, DB, Mail};
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use App\Models\User;
use App\Mail\ResetPasswordMail;
use Carbon\Carbon;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    /**
     * Show the forgot password form
     */
    public function showForgotPasswordForm()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Handle the forgot password request
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'userType' => 'required|in:agent,admin',
        ]);

        $email = $request->email;
        $userType = $request->userType;
    
        $roles = $userType === 'admin' ? ['admin', 'super_admin'] : ['agent'];

        $user = User::where('email', $email)
                     ->whereIn('role', $roles)
                     ->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'We could not find an account with that email address.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->where('email', $email)->delete();

        DB::table('password_reset_tokens')->insert([
            'id'         => (string) Str::uuid(),
            'email'      => $email,
            'token'      => Hash::make($token),
            'user_type'  => $user->role,
            'created_at' => Carbon::now(),
        ]);

        $resetUrl = url('/reset-password/' . $token . '?email=' . urlencode($email) . '&type=' . $user->role);

        try {
            Mail::to($email)->queue(new ResetPasswordMail($user, $resetUrl, $token));

            return back()->with('success', 'Password reset link sent to your email!');
        } catch (\Exception $e) {
            return back()->withErrors([
                'email' => 'Failed to send email. Please try again later.',
            ]);
        }
    }

    /**
     * Show the reset password form
     */
    public function showResetPasswordForm(Request $request, $token)
    {
        $email = $request->query('email');
        $userType = $request->query('type', 'agent');

        if (!$email) {
            return redirect('/forgot-password')->withErrors([
                'email' => 'Invalid reset link.',
            ]);
        }

        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $email,
            'userType' => $userType,
        ]);
    }

    /**
     * Handle the password reset
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'userType' => 'required|in:agent,admin,super_admin',
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/[a-z]/',      
                'regex:/[A-Z]/',      
                'regex:/[0-9]/',      
                'regex:/[@$!%*#?&]/', 
            ],
        ], [
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ]);

        // Find the password reset record
        $passwordReset = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('user_type', $request->userType)
            ->first();

        if (!$passwordReset) {
            return back()->withErrors([
                'email' => 'Invalid or expired reset token.',
            ]);
        }

        // Check if token matches (tokens are hashed in database)
        if (!Hash::check($request->token, $passwordReset->token)) {
            return back()->withErrors([
                'email' => 'Invalid reset token.',
            ]);
        }

        // Check if token is expired (24 hours)
        if (Carbon::parse($passwordReset->created_at)->addHours(24)->isPast()) {
            // Delete expired token
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return back()->withErrors([
                'email' => 'Reset token has expired. Please request a new one.',
            ]);
        }

        // Get user and update password
        $user = User::where('email', $request->email)
                     ->where('role', $request->userType === 'admin' ? 'admin' : $request->userType)
                     ->first();

        if (!$user) {
            return back()->withErrors([
                'email' => 'User not found.',
            ]);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete the used token
        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        // Fire password reset event (optional)
        event(new PasswordReset($user));

        return back()->with('success', 'Password has been reset successfully!');
    }

    /**
     * Resend reset link
     */
    public function resendResetLink(Request $request)
    {
        return $this->sendResetLink($request);
    }
}