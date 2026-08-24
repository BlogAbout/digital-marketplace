<?php

namespace App\Modules\Messenger\Services;

use App\Modules\Core\Services\FileService;
use App\Modules\Messenger\Models\Chat;
use App\Modules\Messenger\Models\Message;
use App\Modules\User\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class MessageService
{
    public function __construct(
        private readonly FileService $fileService
    ) {}

    /**
     * Отправить сообщение
     *
     * @param array<string, mixed> $data
     * @param array<int, UploadedFile>|null $files
     */
    public function sendMessage(Chat $chat, User $user, array $data, ?array $files = null): Message
    {
        return DB::transaction(function () use ($chat, $user, $data, $files) {
            // Загружаем файлы, если есть
            $media = [];
            if ($files) {
                foreach ($files as $file) {
                    $uploadedFile = $this->fileService->uploadFile(
                        $file,
                        $user,
                        'message',
                        "messages/{$chat->id}"
                    );

                    $media[] = [
                        'id' => $uploadedFile->id,
                        'url' => $uploadedFile->getUrl(),
                        'type' => $uploadedFile->getFileType(),
                        'name' => $uploadedFile->original_name,
                        'size' => $uploadedFile->size,
                        'mime_type' => $uploadedFile->mime_type,
                    ];
                }
            }

            /** @var Message $message */
            $message = Message::create([
                'chat_id' => $chat->id,
                'user_id' => $user->id,
                'reply_to_id' => $data['reply_to_id'] ?? null,
                'forward_from_id' => $data['forward_from_id'] ?? null,
                'thread_id' => $data['thread_id'] ?? null,
                'text' => $data['text'] ?? null,
                'media' => $media ?: null,
                'mentions' => $data['mentions'] ?? null,
                'metadata' => $data['metadata'] ?? null,
                'self_destruct_at' => isset($data['self_destruct_seconds'])
                    ? now()->addSeconds($data['self_destruct_seconds'])
                    : null,
            ]);

            // Обновляем последнее сообщение в чате
            $chat->update([
                'last_message_id' => $message->id,
                'updated_at' => now(),
            ]);

            return $message;
        });
    }

    /**
     * Редактировать сообщение
     */
    public function editMessage(Message $message, string $text): Message
    {
        $message->update([
            'text' => $text,
            'is_edited' => true,
            'edited_at' => now(),
        ]);

        /** @var Message $message */
        return $message->fresh();
    }

    /**
     * Переслать сообщение
     */
    public function forwardMessage(Message $message, Chat $targetChat, User $user): Message
    {
        /** @var Message $forwardedMessage */
        $forwardedMessage = Message::create([
            'chat_id' => $targetChat->id,
            'user_id' => $user->id,
            'forward_from_id' => $message->id,
            'text' => $message->text,
            'media' => $message->media,
            'mentions' => $message->mentions,
            'metadata' => array_merge($message->metadata ?? [], [
                'forwarded' => true,
            ]),
        ]);

        $targetChat->update([
            'last_message_id' => $forwardedMessage->id,
            'updated_at' => now(),
        ]);

        return $forwardedMessage;
    }

    /**
     * Закрепить сообщение
     */
    public function pinMessage(Message $message): void
    {
        // Открепляем предыдущие закрепленные сообщения
        Message::query()
            ->where('chat_id', $message->chat_id)
            ->where('is_pinned', true)
            ->update(['is_pinned' => false]);

        $message->update(['is_pinned' => true]);
    }

    /**
     * Открепить сообщение
     */
    public function unpinMessage(Message $message): void
    {
        $message->update(['is_pinned' => false]);
    }

    /**
     * Добавить реакцию к сообщению
     *
     * @param array<string, array<int, string>> $reactions
     */
    public function addReaction(Message $message, User $user, string $reaction): void
    {
        $reactions = $message->reactions ?? [];

        if (!isset($reactions[$reaction])) {
            $reactions[$reaction] = [];
        }

        if (!in_array($user->id, $reactions[$reaction])) {
            $reactions[$reaction][] = $user->id;
        }

        $message->update(['reactions' => $reactions]);
    }

    /**
     * Удалить реакцию
     */
    public function removeReaction(Message $message, User $user, string $reaction): void
    {
        $reactions = $message->reactions ?? [];

        if (isset($reactions[$reaction])) {
            $reactions[$reaction] = array_filter(
                $reactions[$reaction],
                fn($userId) => $userId !== $user->id
            );

            if (empty($reactions[$reaction])) {
                unset($reactions[$reaction]);
            }
        }

        $message->update(['reactions' => $reactions]);
    }

    /**
     * Получить сообщения чата
     *
     * @return \Illuminate\Pagination\LengthAwarePaginator<int, Message>
     */
    public function getChatMessages(Chat $chat, int $perPage = 50): \Illuminate\Pagination\LengthAwarePaginator
    {
        return Message::query()
            ->where('chat_id', $chat->id)
            ->whereNull('thread_id') // Только основные сообщения
            ->where(function ($query) {
                $query->whereNull('self_destruct_at')
                    ->orWhere('self_destruct_at', '>', now());
            })
            ->with(['user', 'replies'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Получить сообщения треда
     *
     * @return \Illuminate\Database\Eloquent\Collection<int, Message>
     */
    public function getThreadMessages(Message $thread): \Illuminate\Database\Eloquent\Collection
    {
        return Message::query()
            ->where('thread_id', $thread->id)
            ->with('user')
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Отметить сообщение как прочитанное
     */
    public function markAsRead(Message $message, User $user): void
    {
        DB::table('message_read')->updateOrInsert(
            [
                'message_id' => $message->id,
                'user_id' => $user->id,
            ],
            [
                'read_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }

    /**
     * Получить прочитавших сообщение
     *
     * @return \Illuminate\Support\Collection<int, User>
     */
    public function getReadBy(Message $message): \Illuminate\Support\Collection
    {
        return User::query()
            ->whereIn('id', function ($query) use ($message) {
                $query->select('user_id')
                    ->from('message_read')
                    ->where('message_id', $message->id)
                    ->whereNotNull('read_at');
            })
            ->get();
    }
}
