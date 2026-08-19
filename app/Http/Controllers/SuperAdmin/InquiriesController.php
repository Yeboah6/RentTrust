<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class InquiriesController extends Controller
{
    public function index(Request $request)
    {
        $search    = $request->input('search', '');
        $type      = $request->input('type', '');      
        $city      = $request->input('city', '');
        $agentId   = $request->input('agent_id', '');
        $startDate = $request->input('start_date', '');
        $endDate   = $request->input('end_date', '');
        $perPage   = max(10, min(100, (int) $request->input('per_page', 20)));

        $query = DB::table('listing_inquiries as li')
            ->join('rentals as r',      'r.id', '=', 'li.rental_id')
            ->leftJoin('users as tenant','tenant.id', '=', 'li.user_id')
            ->leftJoin('users as agent', 'agent.id', '=', 'r.user_id')
            ->select(
                'li.id',
                'li.listing_inquiry_id',
                'li.type',
                'li.message',
                'li.ip',
                'li.created_at',

                'r.id as rental_id',
                'r.rental_id as rental_uuid',
                'r.title as rental_title',
                'r.city as rental_city',
                'r.address as rental_address',
                'r.property_type',
                'r.purpose',
                'r.status as rental_status',

                'tenant.id as tenant_id',
                'tenant.name as tenant_name',
                'tenant.email as tenant_email',
                'tenant.phone as tenant_phone',

                'agent.id as agent_id',
                'agent.name as agent_name',
                'agent.email as agent_email',
                'agent.company as agent_company',
            );

        // ── Filters ───────────────────────────────────────────────────────────
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('r.title',        'like', "%{$search}%")
                  ->orWhere('tenant.name',  'like', "%{$search}%")
                  ->orWhere('tenant.email', 'like', "%{$search}%")
                  ->orWhere('agent.name',   'like', "%{$search}%")
                  ->orWhere('li.message',   'like', "%{$search}%")
                  ->orWhere('r.city',       'like', "%{$search}%");
            });
        }

        if ($type)    $query->where('li.type',   $type);
        if ($city)    $query->where('r.city',    $city);
        if ($agentId) $query->where('r.user_id', $agentId);

        if ($startDate) $query->whereDate('li.created_at', '>=', $startDate);
        if ($endDate)   $query->whereDate('li.created_at', '<=', $endDate);

        $inquiries = $query->orderByDesc('li.created_at')->paginate($perPage)->withQueryString();

        // ── Summary counts ────────────────────────────────────────────────────
        $summary = DB::table('listing_inquiries')
            ->select('type', DB::raw('COUNT(*) as count'))
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        $totalInquiries   = $summary->sum('count');
        $whatsappCount    = $summary->get('whatsapp')?->count ?? 0;
        $phoneCount       = $summary->get('phone')?->count    ?? 0;
        $formCount        = $summary->get('form')?->count     ?? 0;
        $guestCount       = DB::table('listing_inquiries')->whereNull('user_id')->count();
        $todayCount       = DB::table('listing_inquiries')->whereDate('created_at', today())->count();

        // ── Filter option lists ───────────────────────────────────────────────
        $cities = DB::table('rentals')
            ->select('city')
            ->whereNotNull('city')
            ->distinct()
            ->orderBy('city')
            ->pluck('city');

        $agents = DB::table('users')
            ->where('role', 'agent')
            ->select('id', 'name', 'company')
            ->orderBy('name')
            ->get();

        return Inertia::render('SuperAdmin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'summary'   => [
                'total'     => $totalInquiries,
                'whatsapp'  => $whatsappCount,
                'phone'     => $phoneCount,
                'form'      => $formCount,
                'guests'    => $guestCount,
                'today'     => $todayCount,
            ],
            'filters' => [
                'search'     => $search,
                'type'       => $type,
                'city'       => $city,
                'agent_id'   => $agentId,
                'start_date' => $startDate,
                'end_date'   => $endDate,
                'per_page'   => $perPage,
            ],
            'cities' => $cities,
            'agents' => $agents,
        ]);
    }
}