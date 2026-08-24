<?php

namespace App\Modules\Social\Listeners;

use App\Modules\Blog\Models\BlogPost;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Social\Events\PostPublished;
use App\Modules\Social\Events\ProductCreated;
use App\Modules\Social\Events\ProductUpdated;
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
    public function handle(ProductCreated|ProductUpdated|PostPublished $event): void
    {
        /** @var User $user */
        $user = $event->user;

        // Создаем запись активности
        if ($event instanceof ProductCreated || $event instanceof ProductUpdated) {
            /** @var ShopProduct $product */
            $product = $event->product;

            $activityType = $event instanceof ProductCreated
                ? 'product_created'
                : 'product_updated';

            Activity::query()->create([
                'user_id' => $user->id,
                'type' => $activityType,
                'subject_id' => $product->id,
                'subject_type' => ShopProduct::class,
                'data' => [
                    'product_name' => $product->name,
                    'product_slug' => $product->slug,
                ],
                'visibility' => 'public',
            ]);

            $this->notifyFollowers($user, 'Новый товар', "Пользователь {$user->name} добавил новый товар: {$product->name}", "/products/{$product->slug}");
        }

        if ($event instanceof PostPublished) {
            /** @var BlogPost $post */
            $post = $event->post;

            Activity::query()->create([
                'user_id' => $user->id,
                'type' => 'post_published',
                'subject_id' => $post->id,
                'subject_type' => BlogPost::class,
                'data' => [
                    'post_title' => $post->title,
                    'post_slug' => $post->slug,
                ],
                'visibility' => 'public',
            ]);

            $this->notifyFollowers($user, 'Новый пост', "Пользователь {$user->name} опубликовал новый пост: {$post->title}", "/blog/{$post->slug}");
        }
    }

    /**
     * Отправить уведомления подписчикам
     */
    protected function notifyFollowers(User $user, string $title, string $message, string $url): void
    {
        $followers = $this->subscriptionService->getFollowers($user->id);

        foreach ($followers as $follower) {
            /** @var User|null $followerUser */
            $followerUser = $follower->subscriber;

            if ($followerUser === null) {
                continue;
            }

            $this->notificationService->createNotification($followerUser, [
                'type' => 'toast',
                'title' => $title,
                'message' => $message,
                'url' => $url,
            ]);
        }
    }
}
