<?php

namespace App\Http\Controllers\SuperAdmin;


use Illuminate\Support\Facades\{DB, Log, Hash, Mail};
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Str;
use App\Mail\AdminInvitation;
use App\Models\AdminAuditLog;

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

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string|in:admin,super_admin',
        ]);

        DB::beginTransaction();

        try {
            $setupToken = Str::random(64);

            $admin = User::create([
                'user_id'               => (string) Str::uuid(),
                'name'                  => $data['name'],
                'email'                 => $data['email'],
                'password'              => Hash::make(Str::random(32)), // unusable until they set their own
                'role'                  => $data['role'],
                'package'               => $data['role'] === 'super_admin' ? 'super_admin' : 'admin',
                'status'                => 'unverified', // becomes 'verified' after setup
                'setup_token'           => hash('sha256', $setupToken), // store hashed
                'setup_token_expires_at'=> now()->addHours(24),
            ]);

            $setupUrl = route('admin.setup', ['token' => $setupToken]); // plain token in URL

            Mail::to($admin->email)->send(
                new AdminInvitation(
                    adminName:  $admin->name,
                    adminEmail: $admin->email,
                    setupUrl:   $setupUrl,
                    expiresAt:  $admin->setup_token_expires_at->format('M j, Y g:i A'),
                )
            );

            AdminAuditLog::record('user', 'Admin invited', [
                'affected_user' => $admin->name,
                'affected_id'   => $admin->id,
                'notes'         => 'Admin invitation sent via email.',
                'properties'    => ['email' => $admin->email, 'role' => $admin->role],
            ]);

            DB::commit();

            return back()->with('success', 'Admin account created and invitation sent.');

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin invite failed', ['error' => $e->getMessage()]);

            return back()->withErrors(['email' => $e->getMessage()]);
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
