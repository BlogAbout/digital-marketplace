<?php

namespace App\Modules\Shop\Policies;

use App\Modules\Shop\Models\ShopOrder;
use App\Modules\User\Models\User;

class ShopOrderPolicy
{
    /**
     * Проверить, может ли пользователь просматривать заказ
     */
    public function view(User $user, ShopOrder $order): bool
    {
        return $user->id === $order->buyer_id
            || $user->id === $order->seller_id
            || $user->hasRole('admin');
    }

    /**
     * Проверить, может ли пользователь оплатить заказ
     */
    public function pay(User $user, ShopOrder $order): bool
    {
        return $user->id === $order->buyer_id
            && $order->status === 'pending';
    }

    /**
     * Проверить, может ли пользователь отменить заказ
     */
    public function cancel(User $user, ShopOrder $order): bool
    {
        return ($user->id === $order->buyer_id || $user->hasRole('admin'))
            && in_array($order->status, ['pending', 'paid']);
    }

    /**
     * Проверить, может ли пользователь вернуть средства
     */
    public function refund(User $user, ShopOrder $order): bool
    {
        return $user->hasRole('admin')
            && $order->status === 'completed';
    }

    /**
     * Проверить, может ли пользователь скачать файл
     */
    public function download(User $user, ShopOrder $order): bool
    {
        return $user->id === $order->buyer_id
            && $order->status === 'completed';
    }
}
