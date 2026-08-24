<?php

namespace App\Modules\Messenger\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Messenger\Models\Chat;
use App\Modules\Messenger\Models\Message;
use App\Modules\Messenger\Requests\SendMessageRequest;
use App\Modules\Messenger\Resources\MessageResource;
use App\Modules\Messenger\Services\MessageService;
use App\Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;

class MessageController extends Controller
{
    public function __construct(
        private readonly MessageService $messageService
    ) {}

    /**
     * Получить сообщения чата
     */
    public function index(Request $request, string $chatId): AnonymousResourceCollection
    {
        $chat = Chat::query()->findOrFail($chatId);
        $perPage = (int) $request->get('per_page', 50);

        $messages = $this->messageService->getChatMessages($chat, $perPage);

        return MessageResource::collection($messages);
    }

    /**
     * Отправить сообщение
     */
    public function store(SendMessageRequest $request, string $chatId): JsonResponse
    {
        /** @var Chat $chat */
        $chat = Chat::query()->findOrFail($chatId);

        /** @var User $user */
        $user = $request->user();

        /** @var array<int, UploadedFile>|null $files */
        $files = $request->file('files');

        $message = $this->messageService->sendMessage(
            $chat,
            $user,
            $request->validated(),
            $files
        );

        return response()->json([
            'message' => 'Сообщение успешно отправлено',
            'data' => new MessageResource($message),
        ], 201);
    }

    /**
     * Редактировать сообщение
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $message = Message::query()->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        if ($message->user_id !== $user->id) {
            return response()->json([
                'message' => 'Можно редактировать только свои сообщения',
            ], 403);
        }

        $message = $this->messageService->editMessage($message, $request->input('text'));

        return response()->json([
            'message' => 'Сообщение успешно отредактировано',
            'data' => new MessageResource($message),
        ]);
    }

    /**
     * Переслать сообщение
     */
    public function forward(Request $request, string $id): JsonResponse
    {
        /** @var Message $message */
        $message = Message::query()->findOrFail($id);

        /** @var Chat $targetChat */
        $targetChat = Chat::query()->findOrFail($request->input('chat_id'));

        /** @var User $user */
        $user = $request->user();

        $forwardedMessage = $this->messageService->forwardMessage($message, $targetChat, $user);

        return response()->json([
            'message' => 'Сообщение успешно переслано',
            'data' => new MessageResource($forwardedMessage),
        ], 201);
    }

    /**
     * Закрепить сообщение
     */
    public function pin(string $id): JsonResponse
    {
        $message = Message::query()->findOrFail($id);

        $this->messageService->pinMessage($message);

        return response()->json([
            'message' => 'Сообщение закреплено',
        ]);
    }

    /**
     * Добавить реакцию
     */
    public function react(Request $request, string $id): JsonResponse
    {
        $message = Message::query()->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        $this->messageService->addReaction($message, $user, $request->input('reaction'));

        return response()->json([
            'message' => 'Реакция добавлена',
        ]);
    }

    /**
     * Отметить как прочитанное
     */
    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $message = Message::query()->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        $this->messageService->markAsRead($message, $user);

        return response()->json([
            'message' => 'Сообщение отмечено как прочитанное',
        ]);
    }

    /**
     * Получить прочитавших сообщение
     */
    public function readBy(string $id): JsonResponse
    {
        $message = Message::query()->findOrFail($id);

        $readBy = $this->messageService->getReadBy($message);

        return response()->json([
            'read_by' => $readBy,
        ]);
    }
}
