<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\AdminInvitation;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $admins = User::where('role', 'admin')
            ->get()
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'status' => $user->status ?? 'active',
                    'joined_at' => $user->created_at,
                    'created_at' => $user->created_at,
                    'last_active' => $user->last_active,
                ];
            });
        return inertia('SuperAdmin/Admins/Index', ['admins' => $admins]);
    }

    // public function store(Request $request)
    // {
    //     $data = $request->validate([
    //         'name' => 'required|string',
    //         'email' => 'required|email|unique:users,email',
    //         'role' => 'required|string',
    //         'password' => 'required|string|min:8|confirmed',
    //     ]);
    //     $data['password'] = Hash::make($data['password']);
    //     $data['role'] = 'admin';
    //     $data['package'] = 'admin';
    //     $data['user_id'] = User::generateUUID();



    //     User::create($data);
    //     return redirect()-> back()->with('success', 'Admin account created');
    // }

    public function store(Request $request)
    {
        // Validate input
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string|in:admin,super_admin',
            'password' => 'required|string|min:8|confirmed',
        ]);
 
        // Generate temporary password for email (before hashing)
        $temporaryPassword = $data['password'];
 
        // Prepare user data
        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'admin';
        $data['package'] = 'admin';
        $data['user_id'] = User::generateUUID();
        $data['verification_status'] = 'verified'; // Admins are auto-verified
        $data['is_active'] = true;
 
        try {
            // Create the admin user
            $admin = User::create($data);
 
            // Send invitation email
            Mail::to($admin->email)->send(new AdminInvitation(
                adminName: $admin->name,
                adminEmail: $admin->email,
                temporaryPassword: $temporaryPassword,
                loginUrl: route('admin.login')
            ));
 
            return redirect()->back()->with('success', 'Admin account created successfully! Invitation email sent.');
 
        } catch (\Exception $e) {
            // Log the error
            \Log::error('Admin creation failed: ' . $e->getMessage());
 
            // Delete user if email send fails (optional cleanup)
            if (isset($admin)) {
                $admin->delete();
            }
 
            return redirect()->back()
                ->withInput()
                ->withErrors(['email' => 'Failed to create admin account. Please try again.']);
        }
    }

    public function resendInvitation(Request $request, $adminId)
    {
        $admin = User::where('user_id', $adminId)
            ->where('role', 'admin')
            ->firstOrFail();
 
        try {
            // Generate a new temporary password
            $temporaryPassword = Str::random(12);
 
            // Update password in database
            $admin->update([
                'password' => Hash::make($temporaryPassword),
            ]);
 
            // Send invitation email
            Mail::to($admin->email)->send(new AdminInvitation(
                adminName: $admin->name,
                adminEmail: $admin->email,
                temporaryPassword: $temporaryPassword,
                loginUrl: route('admin.login')
            ));
 
            return redirect()->back()->with('success', 'Invitation email resent successfully!');
 
        } catch (\Exception $e) {
            \Log::error('Resend invitation failed: ' . $e->getMessage());
 
            return redirect()->back()->withErrors(['email' => 'Failed to resend invitation. Please try again.']);
        }
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'role' => 'required|string',
            'password' => 'nullable|string|min:8|confirmed',
            'notify_on_save' => 'boolean',
        ]);

        // Remove fields that shouldn't be updated
        unset($data['notify_on_save']);

        // Only hash and update password if provided
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return redirect()->back()->with('success', 'Admin updated');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'Admin removed');
    }

    public function resetPassword(Request $request, $user_id)
    {
        $admin = User::where('user_id', $user_id)
            ->where('role', 'admin')
            ->firstOrFail();
 
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);
 
        $temporaryPassword = $request->password;
 
        $admin->update([
            'password' => Hash::make($request->password),
        ]);
 
        // Send password reset email
        Mail::to($admin->email)->send(new AdminInvitation(
            adminName: $admin->name,
            adminEmail: $admin->email,
            temporaryPassword: $temporaryPassword,
            loginUrl: route('admin.login'),
            isPasswordReset: true
        ));
 
        return redirect()->back()->with('success', 'Admin password reset! Email sent with new credentials.');
    }

    public function suspend(User $user)
    {
        $user->update(['status' => 'suspended']);
        return redirect()->back()->with('success', 'Admin suspended');
    }

    public function reactivate(User $user)
    {
        $user->update(['status' => 'active']);
        return redirect()->back()->with('success', 'Admin reactivated');
    }
}
