<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PropertyType;

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
        $request->validate(['name' => 'required|string']);
        PropertyType::create($request->only('name'));
        return back()->with('success', 'Property type added');
    }

    public function update(Request $request, PropertyType $type)
    {
        $request->validate(['name' => 'required|string']);
        $type->update($request->only('name'));
        return back()->with('success', 'Property type updated');
    }

    public function destroy(PropertyType $type)
    {
        $type->delete();
        return back()->with('success', 'Property type deleted');
    }
}
