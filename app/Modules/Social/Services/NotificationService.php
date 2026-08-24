<?php

namespace App\Modules\Social\Services;

use App\Events\ToastNotification;
use App\Modules\Social\Models\Notification;
use App\Modules\Social\Repositories\NotificationRepository;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    public function __construct(
        private readonly NotificationRepository $repository
    ) {}

    /**
     * Создать уведомление
     *
     * @param  array<string, mixed>  $data
     */
    public function createNotification(User $user, array $data): Notification
    {
        /** @var Notification $notification */
        $notification = $this->repository->create([
            'user_id' => $user->id,
            'type' => $data['type'] ?? 'toast',
            'title' => $data['title'],
            'message' => $data['message'],
            'data' => $data['data'] ?? null,
            'icon' => $data['icon'] ?? null,
            'url' => $data['url'] ?? null,
            'status' => 'pending',
        ]);

        $this->clearCache($user->id);

        return $notification;
    }

    /**
     * Отправить email уведомление
     */
    public function sendEmailNotification(User $user, string $title, string $message): void
    {
        Mail::raw($message, function ($mail) use ($user, $title) {
            $mail->to($user->email)
                ->subject($title);
        });
    }

    /**
     * Отправить toast уведомление через WebSocket
     */
    public function sendToastNotification(User $user, string $title, string $message): void
    {
        $notification = $this->createNotification($user, [
            'type' => 'toast',
            'title' => $title,
            'message' => $message,
        ]);

        // Отправляем через WebSocket
        broadcast(new ToastNotification($user, $notification));
    }

    /**
     * Отметить уведомление как прочитанное
     */
    public function markAsRead(Notification $notification): void
    {
        $notification->markAsRead();
        $this->clearCache($notification->user_id);
    }

    /**
     * Отметить все уведомления как прочитанные
     */
    public function markAllAsRead(User $user): void
    {
        Notification::query()
            ->where('user_id', $user->id)
            ->whereNull('read_at')
            ->update([
                'read_at' => now(),
                'status' => 'read',
            ]);

        $this->clearCache($user->id);
    }

    /**
     * Получить количество непрочитанных уведомлений
     */
    public function getUnreadCount(User $user): int
    {
        return Cache::remember(
            "notification:unread:{$user->id}",
            300,
            function () use ($user) {
                return $this->repository->getUnreadCount($user->id);
            }
        );
    }

    /**
     * Очистить кэш уведомлений
     */
    protected function clearCache(string $userId): void
    {
        Cache::forget("notification:unread:{$userId}");
    }
}
