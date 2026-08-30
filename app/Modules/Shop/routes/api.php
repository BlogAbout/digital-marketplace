<?php

use App\Modules\Shop\Controllers\CommentController;
use App\Modules\Shop\Controllers\ShopCategoryController;
use App\Modules\Shop\Controllers\ShopOrderController;
use App\Modules\Shop\Controllers\ShopProductController;
use Illuminate\Support\Facades\Route;

// Публичные маршруты
Route::get('shop/categories', [ShopCategoryController::class, 'index']);
Route::get('shop/categories/{id}', [ShopCategoryController::class, 'show']);
Route::get('shop/products', [ShopProductController::class, 'index']);
Route::get('shop/products/{id}', [ShopProductController::class, 'show']);
Route::get('shop/products/{productId}/comments', [CommentController::class, 'index']);

// Защищенные маршруты
Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    // Категории (только для админов и модераторов)
    Route::post('shop/categories', [ShopCategoryController::class, 'store'])
        ->middleware('role:admin,moderator');
    Route::put('shop/categories/{id}', [ShopCategoryController::class, 'update'])
        ->middleware('role:admin,moderator');
    Route::delete('shop/categories/{id}', [ShopCategoryController::class, 'destroy'])
        ->middleware('role:admin,moderator');

    // Товары
    Route::post('shop/products', [ShopProductController::class, 'store']);
    Route::put('shop/products/{id}', [ShopProductController::class, 'update']);
    Route::delete('shop/products/{id}', [ShopProductController::class, 'destroy']);

    // Модерация товаров
    Route::post('shop/products/{id}/approve', [ShopProductController::class, 'approve'])
        ->middleware('role:admin,moderator');
    Route::post('shop/products/{id}/reject', [ShopProductController::class, 'reject'])
        ->middleware('role:admin,moderator');

    // Заказы
    Route::post('shop/orders', [ShopOrderController::class, 'store']);
    Route::get('shop/orders/my', [ShopOrderController::class, 'myOrders']);
    Route::get('shop/orders/{id}', [ShopOrderController::class, 'show']);
    Route::post('shop/orders/{id}/pay', [ShopOrderController::class, 'pay']);
    Route::post('shop/orders/{id}/cancel', [ShopOrderController::class, 'cancel']);
    Route::post('shop/orders/{id}/refund', [ShopOrderController::class, 'refund'])
        ->middleware('role:admin,moderator');
    Route::get('shop/orders/{id}/download', [ShopOrderController::class, 'download']);

    Route::post('shop/products/{productId}/comments', [CommentController::class, 'store']);
    Route::post('comments/{id}/like', [CommentController::class, 'like']);
    Route::post('comments/{id}/unlike', [CommentController::class, 'unlike']);
});
