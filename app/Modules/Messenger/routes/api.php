<?php

use App\Modules\Messenger\Controllers\ChatController;
use App\Modules\Messenger\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Чаты
    Route::get('chats', [ChatController::class, 'index']);
    Route::get('chats/{id}', [ChatController::class, 'show']);
    Route::post('chats/private', [ChatController::class, 'createPrivateChat']);
    Route::post('chats/group', [ChatController::class, 'createGroupChat']);
    Route::post('chats/{id}/participants', [ChatController::class, 'addParticipant']);
    Route::delete('chats/{id}/participants', [ChatController::class, 'removeParticipant']);

    // Сообщения
    Route::get('chats/{chatId}/messages', [MessageController::class, 'index']);
    Route::post('chats/{chatId}/messages', [MessageController::class, 'store']);
    Route::put('messages/{id}', [MessageController::class, 'update']);
    Route::post('messages/{id}/forward', [MessageController::class, 'forward']);
    Route::post('messages/{id}/pin', [MessageController::class, 'pin']);
    Route::post('messages/{id}/react', [MessageController::class, 'react']);
    Route::post('messages/{id}/read', [MessageController::class, 'markAsRead']);
    Route::get('messages/{id}/read-by', [MessageController::class, 'readBy']);
});
