<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PropertyType;
use Illuminate\Support\Str;

class PropertyTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified', 'role:super_admin']);
    }

    public function index()
    {
        $types = PropertyType::all();
        return inertia('SuperAdmin/PropertyTypes/Index', ['types' => $types]);
    }

    public function store(Request $request)
    {
       $data = $request->validate([
            'name' => 'required|string',
            'slug' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            ]);
        $data['property_type_id'] = Str::uuid();
        PropertyType::create($data);
        return back()->with('success', 'Property type added');
    }

    public function update(Request $request, PropertyType $type)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'slug' => 'nullable|string',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
            ]);

        $type->update($data);
        return back()->with('success', 'Property type updated');
    }

    public function destroy(PropertyType $type)
    {
        $type->delete();
        return back()->with('success', 'Property type deleted');
    }
}
