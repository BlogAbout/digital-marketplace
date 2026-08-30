<?php

namespace App\Modules\Notification\Services;

use App\Modules\Dispute\Models\Dispute;
use App\Modules\Shop\Models\ShopOrder;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Отправить email уведомление
     */
    public function send(User $user, string $subject, string $template, array $data = []): bool
    {
        try {
            if (!$user->email) {
                return false;
            }

            Mail::send($template, $data, function ($message) use ($user, $subject) {
                $message->to($user->email)
                    ->subject($subject);
            });

            Log::info('Email sent', [
                'user_id' => $user->id,
                'subject' => $subject,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Отправить приветственное письмо
     */
    public function sendWelcomeEmail(User $user): bool
    {
        return $this->send(
            $user,
            'Добро пожаловать в Marketplace!',
            'emails.welcome',
            ['user' => $user]
        );
    }

    /**
     * Отправить уведомление о новом заказе
     */
    public function sendNewOrderEmail(User $user, ShopOrder $order): bool
    {
        return $this->send(
            $user,
            'Новый заказ #' . $order->id,
            'emails.new-order',
            ['user' => $user, 'order' => $order]
        );
    }

    /**
     * Отправить уведомление о продаже
     */
    public function sendSaleEmail(User $user, ShopOrder $order): bool
    {
        return $this->send(
            $user,
            'Новая продажа!',
            'emails.sale',
            ['user' => $user, 'order' => $order]
        );
    }

    /**
     * Отправить уведомление о новом подписчике
     */
    public function sendNewFollowerEmail(User $user, User $follower): bool
    {
        return $this->send(
            $user,
            'Новый подписчик!',
            'emails.new-follower',
            ['user' => $user, 'follower' => $follower]
        );
    }

    /**
     * Отправить уведомление о разрешении спора
     */
    public function sendDisputeResolvedEmail(User $user, Dispute $dispute): bool
    {
        return $this->send(
            $user,
            'Спор разрешен',
            'emails.dispute-resolved',
            ['user' => $user, 'dispute' => $dispute]
        );
    }
}
