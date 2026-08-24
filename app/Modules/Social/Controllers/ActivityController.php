<?php

namespace App\Modules\Social\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Social\Models\Activity;
use App\Modules\Social\Resources\ActivityResource;
use App\Modules\Social\Services\SubscriptionService;
use App\Modules\User\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityController extends Controller
{
    public function __construct(
        private readonly SubscriptionService $subscriptionService
    ) {}

    /**
     * Получить ленту активности
     */
    public function feed(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);

        /** @var User $user */
        $user = $request->user();

        // Получаем ID пользователей, на которых подписан текущий пользователь
        $followingIds = $this->subscriptionService->getFollowingIds($user);

        // Добавляем самого пользователя в ленту
        $followingIds[] = $user->id;

        $activities = Activity::query()
            ->whereIn('user_id', $followingIds)
            ->where('visibility', 'public')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return ActivityResource::collection($activities);
    }
}
