<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SystemController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function impersonate(User $user)
    {
        // store original id in session if needed
        Auth::guard()->login($user);
        return inertia('SuperAdmin/Support/Impersonate', ['user' => $user]);
        // return redirect('/')->with('success', 'Now impersonating ' . $user->name);
    }

    public function logs()
    {
        // simplistic example reading laravel log
        $path = storage_path('logs/laravel.log');
        $lines = [];
        if (file_exists($path)) {
            $lines = array_slice(file($path), -200);
        }
        return inertia('SuperAdmin/Support/Logs', ['logs' => $lines]);
    }
}
