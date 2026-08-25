<?php

use App\Modules\Support\Controllers\SupportTicketController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Пользовательские маршруты
    Route::get('support/tickets', [SupportTicketController::class, 'index']);
    Route::get('support/tickets/{id}', [SupportTicketController::class, 'show']);
    Route::post('support/tickets', [SupportTicketController::class, 'store']);
    Route::post('support/tickets/{id}/messages', [SupportTicketController::class, 'addMessage']);

    // Админские маршруты
    Route::get('support/all-tickets', [SupportTicketController::class, 'allTickets'])
        ->middleware('role:admin,moderator');
    Route::post('support/tickets/{id}/assign', [SupportTicketController::class, 'assign'])
        ->middleware('role:admin,moderator');
    Route::post('support/tickets/{id}/resolve', [SupportTicketController::class, 'resolve'])
        ->middleware('role:admin,moderator');
    Route::post('support/tickets/{id}/close', [SupportTicketController::class, 'close'])
        ->middleware('role:admin,moderator');
});
