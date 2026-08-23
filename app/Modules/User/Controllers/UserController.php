<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\Models\User;
use App\Modules\User\Requests\UpdateUserRequest;
use App\Modules\User\Resources\UserResource;
use App\Modules\User\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    public function __construct(
        private readonly UserService $userService
    ) {}

    /**
     * Получить список пользователей
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->get('per_page', 15);
        $role = $request->get('role');
        $search = $request->get('search');
        $isBlocked = $request->get('is_blocked');

        $cacheKey = "users:list:{$perPage}:{$role}:{$search}:{$isBlocked}";

        $users = Cache::remember($cacheKey, 300, function () use ($perPage, $role, $search, $isBlocked) {
            $query = User::query();

            if ($role) {
                $query->where('role', $role);
            }

            if ($isBlocked !== null) {
                $query->where('is_block', $isBlocked);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'ilike', "%{$search}%")
                        ->orWhere('email', 'ilike', "%{$search}%")
                        ->orWhere('phone', 'ilike', "%{$search}%");
                });
            }

            return $query->paginate($perPage);
        });

        return UserResource::collection($users);
    }

    /**
     * Получить пользователя по ID
     */
    public function show(string $id): UserResource
    {
        $user = $this->userService->getUserWithCache($id);
        return new UserResource($user);
    }

    /**
     * Обновить пользователя
     */
    public function update(UpdateUserRequest $request, string $id): JsonResponse
    {
        $this->authorize('update', $user = User::findOrFail($id));

        $user = $this->userService->updateUser($user, $request->validated());

        return response()->json([
            'message' => 'Профиль успешно обновлен',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Заблокировать пользователя
     */
    public function block(string $id): JsonResponse
    {
        $this->authorize('block', $user = User::findOrFail($id));

        $user = $this->userService->blockUser($user);

        return response()->json([
            'message' => 'Пользователь заблокирован',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Разблокировать пользователя
     */
    public function unblock(string $id): JsonResponse
    {
        $this->authorize('unblock', $user = User::findOrFail($id));

        $user = $this->userService->unblockUser($user);

        return response()->json([
            'message' => 'Пользователь разблокирован',
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Удалить пользователя
     */
    public function destroy(string $id): JsonResponse
    {
        $this->authorize('delete', $user = User::findOrFail($id));

        $user->delete();

        Cache::forget("user:{$id}");

        return response()->json([
            'message' => 'Пользователь удален',
        ]);
    }

    /**
     * Получить транзакции пользователя
     */
    public function transactions(Request $request, string $id): AnonymousResourceCollection
    {
        $user = User::findOrFail($id);

        $this->authorize('viewTransactions', $user);

        $perPage = $request->get('per_page', 15);
        $type = $request->get('type');
        $status = $request->get('status');

        $transactions = $user->transactions()
            ->when($type, function ($query) use ($type) {
                return $query->where('type', $type);
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return UserTransactionResource::collection($transactions);
    }
}
