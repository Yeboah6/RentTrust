<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Str;
use App\Models\AdminAuditLog;

class LocationController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $locations = Location::latest()->get();
        return inertia('SuperAdmin/Locations/Index', ['locations' => $locations]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'      => 'required|string',
            'type'      => 'required|string',
            'slug'      => 'nullable|string',
            'is_active' => 'boolean'
        ]);
        $data['location_id'] = Str::uuid();
        $location = Location::create($data);

        AdminAuditLog::record('location', 'Location created', [
            'affected_user' => $location->name,
            'affected_id'   => $location->location_id,
            'notes'         => "Location \"{$location->name}\" ({$location->type}) created.",
            'properties'    => $data,
        ]);

        return redirect()->back()->with('success', 'Location added');
    }

    public function update(Request $request, Location $location)
    {
        $data = $request->validate([
            'name'      => 'required|string',
            'type'      => 'required|string',
            'slug'      => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $before = $location->only(array_keys($data));
        $location->update($data);

        AdminAuditLog::record('location', 'Location updated', [
            'affected_user' => $location->name,
            'affected_id'   => $location->location_id,
            'notes'         => "Location \"{$location->name}\" updated.",
            'properties'    => ['before' => $before, 'after' => $data],
        ]);

        return redirect()->back()->with('success', 'Location updated');
    }

    public function destroy(Location $location)
    {
        $name = $location->name;
        $id   = $location->location_id;
    
        $location->delete();
    
        AdminAuditLog::record('location', 'Location deleted', [
            'affected_user' => $name,
            'affected_id'   => $id,
            'notes'         => "Location \"{$name}\" permanently deleted.",
            'properties'    => [],
        ]);
    
        return back()->with('success', 'Location deleted');
    }
}
