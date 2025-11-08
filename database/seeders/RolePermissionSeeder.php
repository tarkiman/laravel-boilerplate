<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            ['name' => 'view-users', 'description' => 'View user list'],
            ['name' => 'create-users', 'description' => 'Create new users'],
            ['name' => 'edit-users', 'description' => 'Edit user information'],
            ['name' => 'delete-users', 'description' => 'Delete users'],
            ['name' => 'manage-users', 'description' => 'Full user management access'],
            ['name' => 'view-roles', 'description' => 'View role list'],
            ['name' => 'create-roles', 'description' => 'Create new roles'],
            ['name' => 'edit-roles', 'description' => 'Edit role information'],
            ['name' => 'delete-roles', 'description' => 'Delete roles'],
            ['name' => 'manage-roles', 'description' => 'Full role management access'],
            ['name' => 'view-permissions', 'description' => 'View permission list'],
            ['name' => 'manage-permissions', 'description' => 'Full permission management access'],
            ['name' => 'assign-roles', 'description' => 'Assign roles to users'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Create roles
        $adminRole = Role::create([
            'name' => 'admin',
            'description' => 'Administrator with full access',
        ]);

        $managerRole = Role::create([
            'name' => 'manager',
            'description' => 'Manager with limited administrative access',
        ]);

        $userRole = Role::create([
            'name' => 'user',
            'description' => 'Regular user with basic access',
        ]);

        // Assign permissions to roles
        $allPermissions = Permission::all();
        $adminRole->permissions()->attach($allPermissions);

        $managerPermissions = Permission::whereIn('name', [
            'view-users',
            'create-users',
            'edit-users',
            'manage-users',
            'view-roles',
            'assign-roles'
        ])->get();
        $managerRole->permissions()->attach($managerPermissions);

        // Create HR role with specific permissions
        $hrRole = Role::create([
            'name' => 'hr',
            'description' => 'HR with user management access',
        ]);

        $hrPermissions = Permission::whereIn('name', [
            'view-users',
            'manage-users',
            'create-users',
            'edit-users'
        ])->get();
        $hrRole->permissions()->attach($hrPermissions);

        // Create role manager with role-specific permissions
        $roleManagerRole = Role::create([
            'name' => 'role-manager',
            'description' => 'Role Manager with role and permission access',
        ]);

        $roleManagerPermissions = Permission::whereIn('name', [
            'view-roles',
            'manage-roles',
            'create-roles',
            'edit-roles',
            'view-permissions',
            'manage-permissions'
        ])->get();
        $roleManagerRole->permissions()->attach($roleManagerPermissions);

        $userPermissions = Permission::whereIn('name', [
            'view-users'
        ])->get();
        $userRole->permissions()->attach($userPermissions);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);
        $admin->roles()->attach($adminRole);

        // Create manager user
        $manager = User::create([
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => Hash::make('password'),
        ]);
        $manager->roles()->attach($managerRole);

        // Create HR user
        $hrUser = User::create([
            'name' => 'HR User',
            'email' => 'hr@example.com',
            'password' => Hash::make('password'),
        ]);
        $hrUser->roles()->attach($hrRole);

        // Create role manager user
        $roleManager = User::create([
            'name' => 'Role Manager',
            'email' => 'rolemanager@example.com',
            'password' => Hash::make('password'),
        ]);
        $roleManager->roles()->attach($roleManagerRole);

        // Create regular user
        $regularUser = User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
        ]);
        $regularUser->roles()->attach($userRole);
    }
}
