<?php

namespace App\Modules\Social\Repositories;

use App\Modules\Core\BaseRepository;
use App\Modules\Social\Models\Notification;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<Notification>
 */
class NotificationRepository extends BaseRepository
{
    /**
     * @return class-string<Notification>
     */
    protected function getModelClass(): string
    {
        return Notification::class;
    }

    /**
     * Получить уведомления пользователя
     *
     * @return LengthAwarePaginator<int, Notification>
     */
    public function getUserNotifications(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, Notification> $notifications */
        $notifications = $this->query()
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $notifications;
    }

    /**
     * Получить непрочитанные уведомления
     *
     * @return LengthAwarePaginator<int, Notification>
     */
    public function getUnreadNotifications(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, Notification> $notifications */
        $notifications = $this->query()
            ->where('user_id', $userId)
            ->whereNull('read_at')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return $notifications;
    }

    /**
     * Получить количество непрочитанных уведомлений
     */
    public function getUnreadCount(string $userId): int
    {
        return $this->query()
            ->where('user_id', $userId)
            ->whereNull('read_at')
            ->count();
    }
}
