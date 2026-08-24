<?php

namespace App\Modules\Social\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Social\Resources\SubscriptionResource;
use App\Modules\Social\Services\SubscriptionService;
use App\Modules\User\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService
    ) {}

    /**
     * Получить подписчиков пользователя
     */
    public function followers(Request $request, string $userId): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);

        $followers = \App\Modules\Social\Models\Subscription::query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->with('subscriber')
            ->paginate($perPage);

        return SubscriptionResource::collection($followers);
    }

    /**
     * Получить подписки пользователя
     */
    public function following(Request $request, string $userId): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);

        $following = \App\Modules\Social\Models\Subscription::query()
            ->where('subscriber_id', $userId)
            ->where('is_active', true)
            ->with('user')
            ->paginate($perPage);

        return SubscriptionResource::collection($following);
    }

    /**
     * Подписаться на пользователя
     */
    public function subscribe(Request $request, string $userId): JsonResponse
    {
        /** @var User $subscriber */
        $subscriber = $request->user();

        $user = User::query()->findOrFail($userId);

        if ($subscriber->id === $user->id) {
            return response()->json([
                'message' => 'Нельзя подписаться на самого себя',
            ], 400);
        }

        $subscription = $this->subscriptionService->subscribe($subscriber, $user);

        return response()->json([
            'message' => 'Вы успешно подписались',
            'subscription' => new SubscriptionResource($subscription),
        ], 201);
    }

    /**
     * Отписаться от пользователя
     */
    public function unsubscribe(Request $request, string $userId): JsonResponse
    {
        /** @var User $subscriber */
        $subscriber = $request->user();

        $user = User::query()->findOrFail($userId);

        $this->subscriptionService->unsubscribe($subscriber, $user);

        return response()->json([
            'message' => 'Вы успешно отписались',
        ]);
    }

    /**
     * Проверить подписку
     */
    public function check(Request $request, string $userId): JsonResponse
    {
        /** @var User $subscriber */
        $subscriber = $request->user();

        $user = User::query()->findOrFail($userId);

        $isSubscribed = $this->subscriptionService->isSubscribed($subscriber, $user);

        return response()->json([
            'is_subscribed' => $isSubscribed,
        ]);
    }
}
