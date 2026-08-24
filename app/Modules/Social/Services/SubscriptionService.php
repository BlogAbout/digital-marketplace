<?php

namespace App\Modules\Social\Services;

use App\Modules\Core\BaseService;
use App\Modules\Social\Models\Subscription;
use App\Modules\Social\Repositories\SubscriptionRepository;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * @extends BaseService<SubscriptionRepository>
 */
class SubscriptionService extends BaseService
{
    /**
     * @return class-string<SubscriptionRepository>
     */
    protected function getRepositoryClass(): string
    {
        return SubscriptionRepository::class;
    }

    /**
     * Подписаться на пользователя
     */
    public function subscribe(User $subscriber, User $user): Subscription
    {
        // Проверяем, не подписан ли уже
        $existing = Subscription::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            if (! $existing->is_active) {
                $existing->update([
                    'is_active' => true,
                    'subscribed_at' => now(),
                ]);
            }

            /** @var Subscription $existing */
            return $existing;
        }

        /** @var Subscription $subscription */
        $subscription = $this->repository->create([
            'subscriber_id' => $subscriber->id,
            'user_id' => $user->id,
            'is_active' => true,
            'subscribed_at' => now(),
        ]);

        $this->clearCache($subscriber->id, $user->id);

        return $subscription;
    }

    /**
     * Отписаться от пользователя
     */
    public function unsubscribe(User $subscriber, User $user): bool
    {
        $subscription = Subscription::query()
            ->where('subscriber_id', $subscriber->id)
            ->where('user_id', $user->id)
            ->first();

        if ($subscription) {
            $subscription->update(['is_active' => false]);
        }

        $this->clearCache($subscriber->id, $user->id);

        return true;
    }

    /**
     * Проверить, подписан ли пользователь
     */
    public function isSubscribed(User $subscriber, User $user): bool
    {
        return Cache::remember(
            "subscription:{$subscriber->id}:{$user->id}",
            3600,
            function () use ($subscriber, $user) {
                return $this->repository->isSubscribed($subscriber->id, $user->id);
            }
        );
    }

    /**
     * Получить подписчиков пользователя
     *
     * @return Collection<int, Subscription>
     */
    public function getFollowers(string $userId): Collection
    {
        /** @var Collection<int, Subscription> $followers */
        $followers = Subscription::query()
            ->where('user_id', $userId)
            ->where('is_active', true)
            ->with('subscriber')
            ->get();

        return $followers;
    }

    /**
     * Получить подписки пользователя
     *
     * @return Collection<int, Subscription>
     */
    public function getFollowing(string $userId): Collection
    {
        /** @var Collection<int, Subscription> $following */
        $following = Subscription::query()
            ->where('subscriber_id', $userId)
            ->where('is_active', true)
            ->with('user')
            ->get();

        return $following;
    }

    /**
     * Получить ID пользователей, на которых подписан пользователь
     *
     * @return array<int, string>
     */
    public function getFollowingIds(User $user): array
    {
        return Cache::remember(
            "subscription:following:{$user->id}",
            3600,
            function () use ($user) {
                return $this->repository->getFollowingIds($user->id);
            }
        );
    }

    /**
     * Получить количество подписчиков
     */
    public function getFollowersCount(string $userId): int
    {
        return Cache::remember(
            "subscription:followers:count:{$userId}",
            3600,
            function () use ($userId) {
                return Subscription::query()
                    ->where('user_id', $userId)
                    ->where('is_active', true)
                    ->count();
            }
        );
    }

    /**
     * Получить количество подписок
     */
    public function getFollowingCount(string $userId): int
    {
        return Cache::remember(
            "subscription:following:count:{$userId}",
            3600,
            function () use ($userId) {
                return Subscription::query()
                    ->where('subscriber_id', $userId)
                    ->where('is_active', true)
                    ->count();
            }
        );
    }

    /**
     * Очистить кэш подписок
     */
    protected function clearCache(string $subscriberId, string $userId): void
    {
        Cache::forget("subscription:{$subscriberId}:{$userId}");
        Cache::forget("subscription:following:{$subscriberId}");
        Cache::forget("subscription:followers:count:{$userId}");
        Cache::forget("subscription:following:count:{$subscriberId}");
    }
}
