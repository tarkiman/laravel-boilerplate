<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Role::with('permissions');

        // Filter berdasarkan pencarian
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $roles = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'status' => 'success',
            'data' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles',
            'description' => 'nullable|string|max:500',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Assign permissions jika ada
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        $role->load('permissions');

        return response()->json([
            'status' => 'success',
            'message' => 'Role berhasil dibuat',
            'data' => $role,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role): JsonResponse
    {
        $role->load('permissions', 'users');

        return response()->json([
            'status' => 'success',
            'data' => $role,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('roles')->ignore($role->id)
            ],
            'description' => 'nullable|string|max:500',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $role->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        // Update permissions jika disediakan
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        $role->load('permissions');

        return response()->json([
            'status' => 'success',
            'message' => 'Role berhasil diupdate',
            'data' => $role,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role): JsonResponse
    {
        // Detach all permissions and users before deleting
        $role->permissions()->detach();
        $role->users()->detach();

        $role->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Role berhasil dihapus',
        ]);
    }

    /**
     * Get all permissions for role assignment
     */
    public function getPermissions(): JsonResponse
    {
        $permissions = Permission::all();

        return response()->json([
            'status' => 'success',
            'data' => $permissions,
        ]);
    }

    /**
     * Assign permission to role
     */
    public function assignPermission(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id'
        ]);

        if (!$role->permissions()->where('permission_id', $request->permission_id)->exists()) {
            $role->permissions()->attach($request->permission_id);
        }

        $role->load('permissions');

        return response()->json([
            'status' => 'success',
            'message' => 'Permission berhasil ditambahkan ke role',
            'data' => $role,
        ]);
    }

    /**
     * Remove permission from role
     */
    public function removePermission(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'permission_id' => 'required|exists:permissions,id'
        ]);

        $role->permissions()->detach($request->permission_id);
        $role->load('permissions');

        return response()->json([
            'status' => 'success',
            'message' => 'Permission berhasil dihapus dari role',
            'data' => $role,
        ]);
    }
}
