<?php

use Illuminate\Support\Facades\Route;

// Публичные маршруты с rate limiting
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('auth/login', [App\Modules\User\Controllers\AuthController::class, 'login']);
    Route::post('auth/register', [App\Modules\User\Controllers\AuthController::class, 'register']);
});
