<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PropertyType;
use Illuminate\Support\Str;
use App\Models\AdminAuditLog;

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
            'name'        => 'required|string',
            'slug'        => 'nullable|string',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);
        $data['property_type_id'] = Str::uuid();
        $type = PropertyType::create($data);

        AdminAuditLog::record('property_type', 'Property type created', [
            'affected_user' => $type->name,
            'affected_id'   => $type->property_type_id,
            'notes'         => "Property type \"{$type->name}\" created.",
            'properties'    => $data,
        ]);

        return back()->with('success', 'Property type added');
    }

    public function update(Request $request, PropertyType $type)
    {
        $data = $request->validate([
            'name'        => 'required|string',
            'slug'        => 'nullable|string',
            'description' => 'nullable|string',
            'is_active'   => 'boolean',
        ]);

        $before = $type->only(array_keys($data));
        $type->update($data);

        AdminAuditLog::record('property_type', 'Property type updated', [
            'affected_user' => $type->name,
            'affected_id'   => $type->property_type_id,
            'notes'         => "Property type \"{$type->name}\" updated.",
            'properties'    => ['before' => $before, 'after' => $data],
        ]);

        return back()->with('success', 'Property type updated');
    }

    public function destroy(PropertyType $type)
    {
        $name = $type->name;
        $id   = $type->property_type_id;
    
        $type->delete();
    
        AdminAuditLog::record('property_type', 'Property type deleted', [
            'affected_user' => $name,
            'affected_id'   => $id,
            'notes'         => "Property type \"{$name}\" permanently deleted.",
            'properties'    => [],
        ]);
    
        return back()->with('success', 'Property type deleted');
    }
}
