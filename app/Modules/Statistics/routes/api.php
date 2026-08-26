<?php

use App\Modules\Statistics\Controllers\StatisticsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    Route::get('statistics/seller', [StatisticsController::class, 'sellerStatistics']);
    Route::get('statistics/product/{productId}', [StatisticsController::class, 'productStatistics']);
    Route::get('statistics/platform', [StatisticsController::class, 'platformStatistics'])
        ->middleware('role:admin');
});
