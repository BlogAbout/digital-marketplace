<?php

use App\Modules\Social\Controllers\ActivityController;
use App\Modules\Social\Controllers\NotificationController;
use App\Modules\Social\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

// Публичные маршруты
Route::get('user/{userId}/followers', [SubscriptionController::class, 'followers']);
Route::get('user/{userId}/following', [SubscriptionController::class, 'following']);

// Защищенные маршруты
Route::middleware(['auth:sanctum', 'throttle:120,1'])->group(function () {
    // Подписки
    Route::post('user/{userId}/subscribe', [SubscriptionController::class, 'subscribe']);
    Route::delete('user/{userId}/unsubscribe', [SubscriptionController::class, 'unsubscribe']);
    Route::get('user/{userId}/check-subscription', [SubscriptionController::class, 'check']);

    // Лента активности
    Route::get('feed', [ActivityController::class, 'feed']);

    // Уведомления
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});
