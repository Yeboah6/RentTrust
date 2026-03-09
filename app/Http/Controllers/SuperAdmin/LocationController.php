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
        $locations = Location::all();
        return inertia('SuperAdmin/Locations/Index', ['locations' => $locations]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        Location::create($request->only('name'));
        return back()->with('success', 'Location added');
    }

    public function update(Request $request, Location $location)
    {
        $request->validate(['name' => 'required|string']);
        $location->update($request->only('name'));
        return back()->with('success', 'Location updated');
    }

    public function destroy(Location $location)
    {
        $location->delete();
        return back()->with('success', 'Location deleted');
    }
}
