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
                    'role' => $user->role,
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

    public function resendInvitation(Request $request, User $user)
    {
        abort_if($user->role !== 'admin', 404);

        DB::beginTransaction();

        try {
            $setupToken = Str::random(64);
            $user->update([
                'setup_token'            => hash('sha256', $setupToken),
                'setup_token_expires_at' => now()->addHours(24),
                'status'                 => 'unverified',
            ]);

            $setupUrl = route('admin.setup', ['token' => $setupToken]);

            Mail::to($user->email)->send(
                new AdminInvitation(
                    adminName:  $user->name,
                    adminEmail: $user->email,
                    setupUrl:   $setupUrl,
                    expiresAt:  $user->setup_token_expires_at->format('M j, Y g:i A'),
                )
            );

            AdminAuditLog::record('user', 'Admin invitation resent', [
                'affected_user' => $user->name,
                'affected_id'   => $user->id,
                'notes'         => 'Admin invitation resent via email.',
                'properties'    => ['email' => $user->email, 'role' => $user->role],
            ]);

            DB::commit();

            return back()->with('success', 'Invitation email resent successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Resend invitation failed', ['error' => $e->getMessage(), 'admin_id' => $user->id]);

            return back()->withErrors(['email' => 'Failed to resend invitation. Please try again.']);
        }
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'role' => 'required|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        DB::beginTransaction();

        try {
            $original = $user->only(['name', 'email', 'role', 'status']);

            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user->update($data);

            $changes = [];
            foreach (['name', 'email', 'role', 'status'] as $key) {
                $from = $original[$key] ?? null;
                $to   = $user->{$key} ?? null;
                if ($from !== $to) {
                    $changes[$key] = ['from' => $from, 'to' => $to];
                }
            }
            if (array_key_exists('password', $data)) {
                $changes['password'] = ['from' => '(hidden)', 'to' => '(changed)'];
            }

            // Send notification email to the admin about the change
            try {
                Mail::to($user->email)->send(new \App\Mail\AdminUpdated(
                    adminName: $user->name,
                    adminEmail: $user->email,
                    updatedBy: auth()->user()?->name ?? 'System',
                    changes: $changes,
                ));
            } catch (\Throwable $e) {
                Log::warning('Failed to send admin updated email', ['error' => $e->getMessage(), 'admin_id' => $user->id]);
            }

            // Record audit log
            AdminAuditLog::record('user', 'Admin updated', [
                'affected_user' => $user->name,
                'affected_id'   => $user->id,
                'notes'         => 'Admin account updated by ' . (auth()->user()?->name ?? 'System'),
                'properties'    => ['changes' => $changes],
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Admin updated');

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin update failed', ['error' => $e->getMessage(), 'admin_id' => $user->id]);

            return back()->withErrors(['email' => 'Failed to update admin. Please try again.']);
        }
    }

    public function destroy(User $user)
    {
        DB::beginTransaction();
    
        try {
            $adminName = $user->name;
            $adminEmail = $user->email;
    
            AdminAuditLog::record('user', 'Admin account deleted', [
                'affected_user' => $adminName,
                'affected_id'   => $user->id,
                'notes'         => "Admin account '{$adminName}' was deleted by " . (auth()->user()?->name ?? 'System'),
                'properties'    => ['email' => $adminEmail, 'role' => $user->role],
            ]);
    
            $user->delete();
    
            try {
                Mail::raw(
                    "Hello {$adminName},\n\n" .
                    "Your admin account on RentTrustGh has been deleted by a super admin.\n\n" .
                    "If you believe this was done in error, please contact the support team.\n\n" .
                    "Thank you.\n",
                    function ($message) use ($adminEmail, $adminName) {
                        $message->to($adminEmail, $adminName)
                            ->subject('Your admin account has been deleted');
                    }
                );
            } catch (\Throwable $e) {
                Log::warning('Failed to send admin deletion email', ['admin_email' => $adminEmail, 'error' => $e->getMessage()]);
            }
    
            DB::commit();
            return back()->with('success', 'Admin removed');
    
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin deletion failed', ['error' => $e->getMessage(), 'admin_id' => $user->id]);
            return back()->withErrors(['email' => 'Failed to remove admin. Please try again.']);
        }
    }
    
    public function resetPassword(Request $request, $user_id)
    {
        $admin = User::where('user_id', $user_id)
            ->where('role', 'admin')
            ->firstOrFail();
    
        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);
    
        DB::beginTransaction();
    
        try {
            $temporaryPassword = $request->password;
    
            $admin->update([
                'password' => Hash::make($request->password),
            ]);
    
            // Record audit log
            AdminAuditLog::record('user', 'Admin password reset', [
                'affected_user' => $admin->name,
                'affected_id'   => $admin->id,
                'notes'         => "Password reset by " . (auth()->user()?->name ?? 'System'),
                'properties'    => ['email' => $admin->email],
            ]);
    
            // Send password reset email
            Mail::to($admin->email)->send(new AdminInvitation(
                adminName: $admin->name,
                adminEmail: $admin->email,
                temporaryPassword: $temporaryPassword,
                loginUrl: route('admin.login'),
                isPasswordReset: true
            ));
    
            DB::commit();
            return redirect()->back()->with('success', 'Admin password reset! Email sent with new credentials.');
    
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin password reset failed', ['error' => $e->getMessage(), 'admin_id' => $admin->id]);
            return back()->withErrors(['password' => 'Failed to reset password. Please try again.']);
        }
    }
    
    public function suspend(User $user)
    {
        DB::beginTransaction();
    
        try {
            $user->update(['status' => 'suspended']);
    
            // Record audit log
            AdminAuditLog::record('user', 'Admin account suspended', [
                'affected_user' => $user->name,
                'affected_id'   => $user->id,
                'notes'         => "Admin account suspended by " . (auth()->user()?->name ?? 'System'),
                'properties'    => ['email' => $user->email, 'role' => $user->role],
            ]);
    
            try {
                Mail::raw(
                    "Hello {$user->name},\n\n" .
                    "Your admin account on RentTrustGh has been suspended by a super admin.\n\n" .
                    "You will not be able to access the admin panel until your account is reactivated.\n\n" .
                    "If you believe this was done in error, please contact the support team.\n\n" .
                    "Thank you.\n",
                    function ($message) use ($user) {
                        $message->to($user->email, $user->name)
                            ->subject('Your admin account has been suspended');
                    }
                );
            } catch (\Throwable $e) {
                Log::warning('Failed to send admin suspension email', ['admin_id' => $user->id, 'error' => $e->getMessage()]);
            }
    
            DB::commit();
            return redirect()->back()->with('success', 'Admin suspended');
    
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin suspension failed', ['error' => $e->getMessage(), 'admin_id' => $user->id]);
            return back()->withErrors(['email' => 'Failed to suspend admin. Please try again.']);
        }
    }
    
    public function reactivate(User $user)
    {
        DB::beginTransaction();
    
        try {
            $user->update(['status' => 'active']);
    
            // Record audit log
            AdminAuditLog::record('user', 'Admin account reactivated', [
                'affected_user' => $user->name,
                'affected_id'   => $user->id,
                'notes'         => "Admin account reactivated by " . (auth()->user()?->name ?? 'System'),
                'properties'    => ['email' => $user->email, 'role' => $user->role],
            ]);
    
            try {
                Mail::raw(
                    "Hello {$user->name},\n\n" .
                    "Your admin account on RentTrustGh has been reactivated by a super admin.\n\n" .
                    "You can now access the admin panel. If you need to reset your password, please contact the support team.\n\n" .
                    "Thank you.\n",
                    function ($message) use ($user) {
                        $message->to($user->email, $user->name)
                            ->subject('Your admin account has been reactivated');
                    }
                );
            } catch (\Throwable $e) {
                Log::warning('Failed to send admin reactivation email', ['admin_id' => $user->id, 'error' => $e->getMessage()]);
            }
    
            DB::commit();
            return redirect()->back()->with('success', 'Admin reactivated');
    
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Admin reactivation failed', ['error' => $e->getMessage(), 'admin_id' => $user->id]);
            return back()->withErrors(['email' => 'Failed to reactivate admin. Please try again.']);
        }
    }
}
