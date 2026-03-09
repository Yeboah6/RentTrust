<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Amenity;

class AmenityController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $amenities = Amenity::all();
        return inertia('SuperAdmin/Amenities/Index', ['amenities' => $amenities]);
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|string']);
        Amenity::create($request->only('name'));
        return back()->with('success', 'Amenity added');
    }

    public function update(Request $request, Amenity $amenity)
    {
        $request->validate(['name' => 'required|string']);
        $amenity->update($request->only('name'));
        return back()->with('success', 'Amenity updated');
    }

    public function destroy(Amenity $amenity)
    {
        $amenity->delete();
        return back()->with('success', 'Amenity deleted');
    }
}
