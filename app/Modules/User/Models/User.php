<?php

namespace App\Modules\User\Models;

use App\Modules\Core\BaseModel;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\MustVerifyEmail;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\Access\Authorizable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends BaseModel implements AuthenticatableContract, AuthorizableContract, CanResetPasswordContract
{
    use Authenticatable, Authorizable, CanResetPassword, HasApiTokens, MustVerifyEmail, Notifiable;

    /**
     * Название таблицы
     *
     * @var string
     */
    protected $table = 'user';

    /**
     * Атрибуты, которые можно массово присваивать
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'last_active',
        'is_block',
        'slogan',
        'description',
        'settings',
        'balance',
        'avatar_id',
        'role',
    ];

    /**
     * Атрибуты, которые нужно скрыть
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Касты атрибутов
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'last_active' => 'datetime',
        'is_block' => 'boolean',
        'settings' => 'array',
        'balance' => 'decimal:2',
    ];

    /**
     * Значения по умолчанию
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'settings' => '{"theme":"light","timezone":"UTC","locale":"ru"}',
        'balance' => 0,
        'is_block' => false,
        'role' => 'user',
    ];

    /**
     * Получить транзакции пользователя
     *
     * @return HasMany<UserTransaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(UserTransaction::class, 'user_id', 'id');
    }

    /**
     * Проверить, заблокирован ли пользователь
     */
    public function isBlocked(): bool
    {
        return $this->is_block;
    }

    /**
     * Проверить роль пользователя
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Получить настройку пользователя
     */
    public function getSetting(string $key, mixed $default = null): mixed
    {
        $settings = $this->settings ?? [];

        return $settings[$key] ?? $default;
    }

    /**
     * Получить валюту пользователя
     */
    public function getCurrency(): string
    {
        return $this->getSetting('currency', 'USD');
    }
}
