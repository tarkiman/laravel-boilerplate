<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes (tidak perlu authentication)
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
});

// Protected routes (perlu authentication)
Route::middleware('auth:sanctum')->group(function () {

    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::get('user', [AuthController::class, 'user']);
        Route::post('logout', [AuthController::class, 'logout']);
    });

    // User management routes
    Route::apiResource('users', UserController::class);
    Route::prefix('users')->group(function () {
        Route::get('roles', [UserController::class, 'getRoles']);
        Route::post('{user}/assign-role', [UserController::class, 'assignRole']);
        Route::post('{user}/remove-role', [UserController::class, 'removeRole']);
    });

    // Role management routes
    Route::apiResource('roles', RoleController::class);
    Route::prefix('roles')->group(function () {
        Route::get('permissions', [RoleController::class, 'getPermissions']);
        Route::post('{role}/assign-permission', [RoleController::class, 'assignPermission']);
        Route::post('{role}/remove-permission', [RoleController::class, 'removePermission']);
    });
});

// Fallback route untuk 404 API
Route::fallback(function () {
    return response()->json([
        'status' => 'error',
        'message' => 'API endpoint tidak ditemukan',
    ], 404);
});
