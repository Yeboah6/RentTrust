<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ReportService;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function __construct()
    {
        // super admin should be authenticated, verified and have the proper role
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    /**
     * Get complete analytics dashboard data
     * 
     * Supports date filtering via query parameters:
     * - start_date: YYYY-MM-DD format (defaults to 30 days ago)
     * - end_date: YYYY-MM-DD format (defaults to today)
     */
    public function index(Request $request)
    {
        $data = app(ReportService::class)->getDashboardData($request);
        
        // API response (for programmatic access)
        if ($request->header('Accept') === 'application/json') {
            return response()->json($data);
        }
        
        // Inertia response (for UI)
        return Inertia::render('SuperAdmin/Reports', [
            'analytics' => $data,
            'filters' => [
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
            ],
        ]);
    }
}
