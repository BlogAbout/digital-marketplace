<?php

use App\Modules\Blog\Controllers\BlogController;
use App\Modules\Blog\Controllers\BlogPostController;
use Illuminate\Support\Facades\Route;

// Публичные маршруты
Route::get('blog', [BlogController::class, 'index']);
Route::get('blog/{id}', [BlogController::class, 'show']);
Route::get('posts', [BlogPostController::class, 'index']);
Route::get('posts/{id}', [BlogPostController::class, 'show']);

// Защищенные маршруты
Route::middleware('auth:sanctum')->group(function () {
    Route::post('blog', [BlogController::class, 'store']);
    Route::put('blog/{id}', [BlogController::class, 'update']);
    Route::delete('blog/{id}', [BlogController::class, 'destroy']);

    Route::post('posts', [BlogPostController::class, 'store']);
    Route::put('posts/{id}', [BlogPostController::class, 'update']);
    Route::post('posts/{id}/publish', [BlogPostController::class, 'publish']);
    Route::delete('posts/{id}', [BlogPostController::class, 'destroy']);
});
