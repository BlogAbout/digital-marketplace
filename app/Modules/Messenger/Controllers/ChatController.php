<?php

namespace App\Modules\Messenger\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Messenger\Models\Chat;
use App\Modules\Messenger\Resources\ChatResource;
use App\Modules\Messenger\Services\ChatService;
use App\Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct(
        private readonly ChatService $chatService
    ) {}

    /**
     * Создать приватный чат
     */
    public function createPrivateChat(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var User $targetUser */
        $targetUser = User::query()->findOrFail($request->input('user_id'));

        if ($user->id === $targetUser->id) {
            return response()->json([
                'message' => 'Нельзя создать чат с самим собой',
            ], 400);
        }

        $chat = $this->chatService->createPrivateChat($user, $targetUser);

        return response()->json([
            'message' => 'Чат успешно создан',
            'chat' => new ChatResource($chat),
        ], 201);
    }

    /**
     * Добавить участника в чат
     */
    public function addParticipant(Request $request, string $id): JsonResponse
    {
        /** @var Chat $chat */
        $chat = Chat::query()->findOrFail($id);

        /** @var User $user */
        $user = User::query()->findOrFail($request->input('user_id'));

        $this->chatService->addParticipant($chat, $user);

        return response()->json([
            'message' => 'Участник успешно добавлен',
        ]);
    }

    /**
     * Удалить участника из чата
     */
    public function removeParticipant(Request $request, string $id): JsonResponse
    {
        /** @var Chat $chat */
        $chat = Chat::query()->findOrFail($id);

        /** @var User $user */
        $user = User::query()->findOrFail($request->input('user_id'));

        $this->chatService->removeParticipant($chat, $user);

        return response()->json([
            'message' => 'Участник успешно удален',
        ]);
    }
}
