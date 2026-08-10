<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Amenity;
use App\Models\AdminAuditLog;
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
        $amenity = Amenity::create($data);

        AdminAuditLog::record('amenity', 'Amenity created', [
            'affected_user' => $amenity->name,
            'affected_id'   => $amenity->amenity_id,
            'notes'         => "Amenity \"{$amenity->name}\" created in category \"{$amenity->category}\".",
            'properties'    => $data,
        ]);

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

        $before = $amenity->only(array_keys($data));
        $amenity->update($data);

        AdminAuditLog::record('amenity', 'Amenity updated', [
            'affected_user' => $amenity->name,
            'affected_id'   => $amenity->amenity_id,
            'notes'         => "Amenity \"{$amenity->name}\" updated.",
            'properties'    => ['before' => $before, 'after' => $data],
        ]);

        return back()->with('success', 'Amenity updated');
    }

    public function destroy(Amenity $amenity)
    {
        $name = $amenity->name;
        $id   = $amenity->amenity_id;
        $category = $amenity->category;

        $amenity->delete();

        AdminAuditLog::record('amenity', 'Amenity deleted', [
            'affected_user' => $name,
            'affected_id'   => $id,
            'notes'         => "Amenity \"{$name}\" permanently deleted.",
            'properties'    => ['category' => $category],
        ]);

        return back()->with('success', 'Amenity deleted');
    }
}