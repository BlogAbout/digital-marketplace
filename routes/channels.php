<?php

use App\Modules\Messenger\Models\ChatParticipant;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('user.{id}', function (User $user, string $id) {
    return $user->id === $id;
});

Broadcast::channel('chat.{chatId}', function (User $user, string $chatId) {
    return ChatParticipant::query()
        ->where('chat_id', $chatId)
        ->where('user_id', $user->id)
        ->whereNull('left_at')
        ->exists();
});

Broadcast::channel('product.{productId}', function ($user, $productId) {
    return true; // Все могут слушать комментарии
});
