<?php

namespace App\Modules\Social\Repositories;

use App\Modules\Core\BaseRepository;
use App\Modules\Social\Models\Activity;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<Activity>
 */
class ActivityRepository extends BaseRepository
{
    /**
     * @return class-string<Activity>
     */
    protected function getModelClass(): string
    {
        return Activity::class;
    }

    /**
     * Получить ленту активности пользователя
     *
     * @param array<int, string> $userIds
     * @return LengthAwarePaginator<int, Activity>
     */
    public function getUserFeed(array $userIds, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, Activity> $activities */
        $activities = $this->query()
            ->whereIn('user_id', $userIds)
            ->where('visibility', 'public')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $activities;
    }

    /**
     * Получить активность пользователя
     *
     * @return LengthAwarePaginator<int, Activity>
     */
    public function getUserActivity(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, Activity> $activities */
        $activities = $this->query()
            ->where('user_id', $userId)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $activities;
    }
}
