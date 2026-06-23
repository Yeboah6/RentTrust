<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Amenity;
use Illuminate\Support\Str;

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
        $data = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);
        $data['amenity_id'] = Str::uuid();
        Amenity::create($data);
        return back()->with('success', 'Amenity added');
    }

    public function update(Request $request, Amenity $amenity)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean'
        ]);
        $amenity->update($data);
        return back()->with('success', 'Amenity updated');
    }

    public function destroy(Amenity $amenity)
    {
        $amenity->delete();
        return back()->with('success', 'Amenity deleted');
    }
}
