<?php

namespace App\Modules\Shop\Policies;

use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;

class ShopProductPolicy
{
    /**
     * Проверить, может ли пользователь обновить товар
     */
    public function update(User $user, ShopProduct $product): bool
    {
        return $user->id === $product->author_id
            || $user->hasRole('admin');
    }

    /**
     * Проверить, может ли пользователь удалить товар
     */
    public function delete(User $user, ShopProduct $product): bool
    {
        return $user->id === $product->author_id
            || $user->hasRole('admin');
    }

    /**
     * Проверить, может ли пользователь одобрить товар
     */
    public function approve(User $user, ShopProduct $product): bool
    {
        return $user->hasRole('admin')
            || $user->hasRole('moderator');
    }

    /**
     * Проверить, может ли пользователь отклонить товар
     */
    public function reject(User $user, ShopProduct $product): bool
    {
        return $user->hasRole('admin')
            || $user->hasRole('moderator');
    }
}
