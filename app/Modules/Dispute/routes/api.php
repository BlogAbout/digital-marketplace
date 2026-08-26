<?php

use App\Modules\Dispute\Controllers\DisputeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    Route::get('disputes', [DisputeController::class, 'index']);
    Route::get('disputes/{id}', [DisputeController::class, 'show']);
    Route::post('disputes', [DisputeController::class, 'store']);
    Route::post('disputes/{id}/messages', [DisputeController::class, 'addMessage']);
    Route::post('disputes/{id}/resolve', [DisputeController::class, 'resolve'])
        ->middleware('role:admin,moderator');
});
