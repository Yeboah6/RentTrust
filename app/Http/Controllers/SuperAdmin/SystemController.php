<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\AdminAuditLog;
use Inertia\Inertia;

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

    // public function logs()
    // {
    //     // simplistic example reading laravel log
    //     $path = storage_path('logs/laravel.log');
    //     $lines = [];
    //     if (file_exists($path)) {
    //         $lines = array_slice(file($path), -200);
    //     }
    //     return inertia('SuperAdmin/Support/Logs', ['logs' => $lines]);
    // }

    public function index(Request $request)
    {
        $query = AdminAuditLog::with('causer')
            ->latest('created_at');

        // ── Server-side filters (optional — frontend also filters client-side) ──

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('admin_id')) {
            $query->where('causer_id', $request->admin_id);
        }

        if ($request->filled('date')) {
            match ($request->date) {
                'today' => $query->whereDate('created_at', today()),
                'week'  => $query->where('created_at', '>=', now()->subDays(7)),
                'month' => $query->where('created_at', '>=', now()->subDays(30)),
                default => null,
            };
        }

        if ($request->filled('search')) {
            $q = $request->search;
            $query->where(function ($b) use ($q) {
                $b->where('action', 'like', "%{$q}%")
                  ->orWhere('notes', 'like', "%{$q}%")
                  ->orWhere('affected_user', 'like', "%{$q}%")
                  ->orWhere('ip_address', 'like', "%{$q}%")
                  ->orWhereHas('causer', fn ($u) => $u->where('name', 'like', "%{$q}%"));
            });
        }

        // Fetch up to 500 most recent entries (frontend paginates client-side)
        $logs = $query->limit(500)->get()->map(fn ($l) => $this->formatLog($l));

        return Inertia::render('SuperAdmin/Support/Logs', [
            'logs' => $logs,
        ]);
    }

    public function show(int $id)
    {
        $log = AdminAuditLog::with('causer')->findOrFail($id);

        return response()->json($this->formatLog($log));
    }

    public function export(Request $request)
    {
        $logs = AdminAuditLog::with('causer')
            ->latest()
            ->limit(10000)
            ->get()
            ->map(fn ($l) => $this->formatLog($l));

        $headers = ['ID', 'Admin', 'Admin Email', 'Action', 'Type', 'Affected User', 'Affected ID', 'Timestamp', 'IP', 'Notes'];

        $rows = $logs->map(fn ($l) => [
            $l['id'],
            $l['admin'],
            $l['admin_email'],
            $l['action'],
            $l['type'],
            $l['affected_user'],
            $l['affected_id'] ?? '',
            $l['timestamp'],
            $l['ip'],
            str_replace('"', '""', $l['notes'] ?? ''),
        ]);

        $csv = collect([$headers])
            ->concat($rows)
            ->map(fn ($row) => implode(',', array_map(fn ($v) => '"' . $v . '"', $row)))
            ->implode("\n");

        $filename = 'audit-log-' . now()->format('Y-m-d-His') . '.csv';

        return response($csv, 200, [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    // ─── Helper ───────────────────────────────────────────────────────────────

    private function formatLog(AdminAuditLog $l): array
    {
        return [
            'id'            => $l->id,
            'admin'         => $l->causer?->name      ?? $l->causer_name  ?? 'System',
            'admin_email'   => $l->causer?->email     ?? $l->causer_email ?? '',
            'action'        => $l->action,
            'type'          => $l->type                ?? 'settings',
            'affected_user' => $l->affected_user       ?? '—',
            'affected_id'   => $l->affected_id         ?? null,
            'timestamp'     => $l->created_at?->toIso8601String() ?? '',
            'notes'         => $l->notes               ?? $l->description ?? '',
            'ip'            => $l->ip_address          ?? '',
        ];
    }
}
