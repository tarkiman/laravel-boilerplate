<?php

use Illuminate\Support\Facades\Route;

// Main app route
Route::get('/', function () {
    return view('app');
});

// SPA routes - catch all except API routes
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
