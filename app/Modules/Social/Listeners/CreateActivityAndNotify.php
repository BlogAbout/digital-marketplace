<?php

namespace App\Modules\Social\Listeners;

use App\Modules\Social\Models\Activity;
use App\Modules\Social\Services\NotificationService;
use App\Modules\Social\Services\SubscriptionService;
use App\Modules\User\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreateActivityAndNotify implements ShouldQueue
{
    public function __construct(
        private readonly NotificationService $notificationService,
        private readonly SubscriptionService $subscriptionService
    ) {}

    /**
     * Handle the event.
     */
    public function handle(object $event): void
    {
        /** @var User $user */
        $user = $event->user;

        // Создаем запись активности
        if (isset($event->product)) {
            Activity::create([
                'user_id' => $user->id,
                'type' => $event instanceof \App\Modules\Social\Events\ProductCreated
                    ? 'product_created'
                    : 'product_updated',
                'subject_id' => $event->product->id,
                'subject_type' => get_class($event->product),
                'data' => [
                    'product_name' => $event->product->name,
                    'product_slug' => $event->product->slug,
                ],
                'visibility' => 'public',
            ]);
        }

        if (isset($event->post)) {
            Activity::create([
                'user_id' => $user->id,
                'type' => 'post_published',
                'subject_id' => $event->post->id,
                'subject_type' => get_class($event->post),
                'data' => [
                    'post_title' => $event->post->title,
                    'post_slug' => $event->post->slug,
                ],
                'visibility' => 'public',
            ]);
        }

        // Отправляем уведомления подписчикам
        $followers = $this->subscriptionService->getFollowers($user->id);

        foreach ($followers as $follower) {
            /** @var User $followerUser */
            $followerUser = $follower->subscriber;

            if (!$followerUser) {
                continue;
            }

            if (isset($event->product)) {
                $this->notificationService->createNotification($followerUser, [
                    'type' => 'toast',
                    'title' => 'Новый товар',
                    'message' => "Пользователь {$user->name} добавил новый товар: {$event->product->name}",
                    'data' => [
                        'product_id' => $event->product->id,
                    ],
                    'url' => "/products/{$event->product->slug}",
                ]);
            }

            if (isset($event->post)) {
                $this->notificationService->createNotification($followerUser, [
                    'type' => 'toast',
                    'title' => 'Новый пост',
                    'message' => "Пользователь {$user->name} опубликовал новый пост: {$event->post->title}",
                    'data' => [
                        'post_id' => $event->post->id,
                    ],
                    'url' => "/blog/{$event->post->slug}",
                ]);
            }
        }
    }
}
