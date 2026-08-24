<?php

use App\Modules\Core\Controllers\SearchController;
use Illuminate\Support\Facades\Route;

// Публичный поиск
Route::get('search', [SearchController::class, 'search']);

// Админские маршруты
Route::middleware('auth:sanctum')->group(function () {
    Route::post('search/reindex', [SearchController::class, 'reindex'])
        ->middleware('role:admin');
});
