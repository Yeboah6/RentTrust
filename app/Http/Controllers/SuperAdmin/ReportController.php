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
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index(Request $request)
    {
        $data = app(ReportService::class)->getDashboardData($request);
        
        if ($request->header('Accept') === 'application/json') {
            return response()->json($data);
        }
        
        return Inertia::render('SuperAdmin/Reports', [
            'analytics' => $data,
            'filters' => [
                'start_date' => $request->input('start_date'),
                'end_date' => $request->input('end_date'),
            ],
        ]);
    }

}
