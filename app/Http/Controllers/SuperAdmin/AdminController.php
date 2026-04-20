<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);
        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'admin';
        $data['package'] = 'admin';

        User::create($data);
        return redirect()-> back()->with('success', 'Admin account created');
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

    public function resetPassword(User $user)
    {
        // could send reset email or set to default
        return back();
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
