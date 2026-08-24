<?php

namespace App\Modules\Social\Repositories;

use App\Modules\Core\BaseRepository;
use App\Modules\Social\Models\Subscription;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<Subscription>
 */
class SubscriptionRepository extends BaseRepository
{
    /**
     * @return class-string<Subscription>
     */
    protected function getModelClass(): string
    {
        return Subscription::class;
    }

    /**
     * Получить подписчиков пользователя
     *
     * @return LengthAwarePaginator<int, Subscription>
     */
    public function getFollowers(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, Subscription> $followers */
        $followers = $this->query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->with('subscriber')
            ->paginate($perPage);

        return $followers;
    }

    /**
     * Получить подписки пользователя
     *
     * @return LengthAwarePaginator<int, Subscription>
     */
    public function getFollowing(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, Subscription> $following */
        $following = $this->query()
            ->where('subscriber_id', $userId)
            ->where('is_active', true)
            ->with('user')
            ->paginate($perPage);

        return $following;
    }

    /**
     * Проверить, подписан ли пользователь
     */
    public function isSubscribed(string $subscriberId, string $userId): bool
    {
        return $this->query()
            ->where('subscriber_id', $subscriberId)
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->exists();
    }

    /**
     * Получить ID пользователей, на которых подписан пользователь
     *
     * @return array<int, string>
     */
    public function getFollowingIds(string $userId): array
    {
        /** @var array<int, string> $ids */
        $ids = $this->query()
            ->where('subscriber_id', $userId)
            ->where('is_active', true)
            ->pluck('user_id')
            ->toArray();

        return $ids;
    }
}
