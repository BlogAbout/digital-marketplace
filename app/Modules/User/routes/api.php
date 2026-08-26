<?php

use App\Modules\User\Controllers\AuthController;
use App\Modules\User\Controllers\BalanceController;
use App\Modules\User\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Публичные маршруты
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

// Защищенные маршруты
Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    // Пользователи
    Route::get('user', [UserController::class, 'index']);
    Route::get('user/{id}', [UserController::class, 'show']);
    Route::put('user/{id}', [UserController::class, 'update']);
    Route::post('user/{id}/block', [UserController::class, 'block']);
    Route::post('user/{id}/unblock', [UserController::class, 'unblock']);
    Route::delete('user/{id}', [UserController::class, 'destroy']);
    Route::get('user/{id}/transactions', [UserController::class, 'transactions']);

    // Баланс
    Route::get('balance', [BalanceController::class, 'getBalance']);
    Route::post('balance/deposit', [BalanceController::class, 'deposit']);
    Route::post('balance/withdraw', [BalanceController::class, 'withdraw']);
    Route::get('balance/transactions', [BalanceController::class, 'transactions']);
});
