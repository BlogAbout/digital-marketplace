<?php

namespace App\Modules\Notification\Services;

use App\Modules\User\Models\User;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

class PushNotificationService
{
    private WebPush $webPush;

    public function __construct()
    {
        $auth = [
            'VAPID' => [
                'subject' => config('app.url'),
                'publicKey' => env('VAPID_PUBLIC_KEY'),
                'privateKey' => env('VAPID_PRIVATE_KEY'),
            ],
        ];

        $this->webPush = new WebPush($auth);
    }

    /**
     * Отправить push уведомление
     */
    public function send(User $user, string $title, string $body, array $data = []): bool
    {
        try {
            $subscriptions = $user->pushSubscriptions;

            foreach ($subscriptions as $subscription) {
                $webPushSubscription = Subscription::create([
                    'endpoint' => $subscription->endpoint,
                    'publicKey' => $subscription->public_key,
                    'authToken' => $subscription->auth_token,
                ]);

                $this->webPush->queueNotification(
                    $webPushSubscription,
                    json_encode([
                        'title' => $title,
                        'body' => $body,
                        'data' => $data,
                    ])
                );
            }

            foreach ($this->webPush->flush() as $report) {
                if (!$report->isSuccess()) {
                    \Log::warning('Push notification failed: ' . $report->getReason());
                }
            }

            return true;
        } catch (\Exception $e) {
            \Log::error('Push notification failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Генерация VAPID ключей
     */
    public static function generateVapidKeys(): array
    {
        return \Minishlink\WebPush\VAPID::createVapidKeys();
    }
}
