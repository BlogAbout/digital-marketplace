<?php

namespace App\Modules\Messenger\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Messenger\Models\Chat;
use App\Modules\Messenger\Models\ChatParticipant;
use App\Modules\Messenger\Requests\CreateChatRequest;
use App\Modules\Messenger\Requests\AddParticipantRequest;
use App\Modules\Messenger\Resources\ChatResource;
use App\Modules\Messenger\Services\ChatService;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ChatController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly ChatService $chatService
    ) {}

    /**
     * Получить чаты пользователя
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = $request->user();

        $chats = $this->chatService->getUserChats($user);

        return ChatResource::collection($chats);
    }

    /**
     * Получить чат
     */
    public function show(Request $request, string $id): ChatResource
    {
        /** @var Chat $chat */
        $chat = Chat::query()
            ->with(['participants', 'lastMessage'])
            ->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        // Проверяем, что пользователь является участником чата
        if (!$chat->hasParticipant($user->id)) {
            abort(403, 'Вы не являетесь участником этого чата');
        }

        return new ChatResource($chat);
    }

    /**
     * Создать приватный чат
     */
    public function createPrivateChat(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $request->validate([
            'user_id' => ['required', 'uuid', 'exists:user,id'],
        ]);

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
     * Создать групповой чат
     */
    public function createGroupChat(CreateChatRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $chat = $this->chatService->createGroupChat(
            $user,
            $request->input('name'),
            $request->input('participants', [])
        );

        return response()->json([
            'message' => 'Групповой чат успешно создан',
            'chat' => new ChatResource($chat),
        ], 201);
    }

    /**
     * Добавить участника в чат
     */
    public function addParticipant(AddParticipantRequest $request, string $id): JsonResponse
    {
        /** @var Chat $chat */
        $chat = Chat::query()->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        /** @var ChatParticipant|null $participant */
        $participant = ChatParticipant::query()
            ->where('chat_id', $chat->id)
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->first();

        if (!$participant || !$participant->isAdmin()) {
            return response()->json(['message' => 'Только администратор может добавлять участников'], 403);
        }

        /** @var User $newParticipant */
        $newParticipant = User::query()->findOrFail($request->input('user_id'));

        $this->chatService->addParticipant($chat, $newParticipant);

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
        $user = $request->user();

        // Проверяем, что пользователь является администратором чата
        $participant = ChatParticipant::query()
            ->where('chat_id', $chat->id)
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->first();

        if (!$participant || !$participant->isAdmin()) {
            return response()->json([
                'message' => 'Только администратор может удалять участников',
            ], 403);
        }

        /** @var User $participantToRemove */
        $participantToRemove = User::query()->findOrFail($request->input('user_id'));

        $this->chatService->removeParticipant($chat, $participantToRemove);

        return response()->json([
            'message' => 'Участник успешно удален',
        ]);
    }

    /**
     * Получить участников чата
     */
    public function participants(Request $request, string $id): JsonResponse
    {
        /** @var Chat $chat */
        $chat = Chat::query()->findOrFail($id);

        /** @var User $user */
        $user = $request->user();

        if (!$chat->hasParticipant($user->id)) {
            return response()->json([
                'message' => 'Вы не являетесь участником этого чата',
            ], 403);
        }

        $participants = ChatParticipant::query()
            ->where('chat_id', $chat->id)
            ->whereNull('left_at')
            ->with('user')
            ->get();

        return response()->json([
            'data' => $participants,
        ]);
    }
}
