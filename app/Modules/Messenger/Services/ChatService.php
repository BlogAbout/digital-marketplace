<?php

namespace App\Modules\Messenger\Services;

use App\Modules\Messenger\Events\ChatCreated;
use App\Modules\Messenger\Models\Chat;
use App\Modules\Messenger\Models\ChatParticipant;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ChatService
{
    /**
     * Создать приватный чат между двумя пользователями
     */
    public function createPrivateChat(User $user1, User $user2): Chat
    {
        // Проверяем, существует ли уже чат
        $existingChat = $this->findPrivateChat($user1, $user2);

        if ($existingChat) {
            return $existingChat;
        }

        return DB::transaction(function () use ($user1, $user2) {
            /** @var Chat $chat */
            $chat = Chat::create([
                'type' => 'private',
                'is_active' => true,
            ]);

            ChatParticipant::create([
                'chat_id' => $chat->id,
                'user_id' => $user1->id,
                'role' => 'member',
                'joined_at' => now(),
            ]);

            ChatParticipant::create([
                'chat_id' => $chat->id,
                'user_id' => $user2->id,
                'role' => 'member',
                'joined_at' => now(),
            ]);

            // Отправляем WebSocket событие
            broadcast(new ChatCreated($chat))->toOthers();

            return $chat;
        });
    }

    /**
     * Найти приватный чат между двумя пользователями
     */
    public function findPrivateChat(User $user1, User $user2): ?Chat
    {
        /** @var Chat|null $chat */
        $chat = Chat::query()
            ->where('type', 'private')
            ->whereHas('participants', function ($query) use ($user1) {
                $query->where('user_id', $user1->id)
                    ->whereNull('left_at');
            })
            ->whereHas('participants', function ($query) use ($user2) {
                $query->where('user_id', $user2->id)
                    ->whereNull('left_at');
            })
            ->first();

        return $chat;
    }

    /**
     * Создать групповой чат
     *
     * @param array<int, string> $participantIds
     */
    public function createGroupChat(User $owner, string $name, array $participantIds): Chat
    {
        return DB::transaction(function () use ($owner, $name, $participantIds) {
            /** @var Chat $chat */
            $chat = Chat::create([
                'type' => 'group',
                'name' => $name,
                'owner_id' => $owner->id,
                'is_active' => true,
            ]);

            // Добавляем владельца
            ChatParticipant::create([
                'chat_id' => $chat->id,
                'user_id' => $owner->id,
                'role' => 'owner',
                'joined_at' => now(),
            ]);

            // Добавляем остальных участников
            foreach ($participantIds as $participantId) {
                if ($participantId !== $owner->id) {
                    ChatParticipant::create([
                        'chat_id' => $chat->id,
                        'user_id' => $participantId,
                        'role' => 'member',
                        'joined_at' => now(),
                    ]);
                }
            }

            // Отправляем WebSocket событие
            broadcast(new ChatCreated($chat))->toOthers();

            return $chat;
        });
    }

    /**
     * Добавить участника в чат
     */
    public function addParticipant(Chat $chat, User $user, string $role = 'member'): ChatParticipant
    {
        /** @var ChatParticipant $participant */
        $participant = ChatParticipant::updateOrCreate(
            [
                'chat_id' => $chat->id,
                'user_id' => $user->id,
            ],
            [
                'role' => $role,
                'joined_at' => now(),
                'left_at' => null,
            ]
        );

        return $participant;
    }

    /**
     * Удалить участника из чата
     */
    public function removeParticipant(Chat $chat, User $user): void
    {
        ChatParticipant::query()
            ->where('chat_id', $chat->id)
            ->where('user_id', $user->id)
            ->update(['left_at' => now()]);
    }

    /**
     * Получить чаты пользователя
     *
     * @return Collection<int, Chat>
     */
    public function getUserChats(User $user): Collection
    {
        /** @var Collection<int, Chat> $chats */
        $chats = Chat::query()
            ->whereHas('participants', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->whereNull('left_at');
            })
            ->with(['participants', 'lastMessage'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return $chats;
    }
}
