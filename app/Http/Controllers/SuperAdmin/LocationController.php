<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;

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
        $location = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'slug' => 'nullable|string',
            'is_active' => 'boolean'
        ]);
        $location['location_id'] = Location::generateUUID();
        Location::create($location);
        return redirect()->back()->with('success', 'Location added');
    }

    public function update(Request $request, Location $location)
    {
        $location = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'slug' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        Location::update($location);
        return redirect()->back()->with('success', 'Location updated');
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return back()->with('success', 'Location deleted');
    }
}
