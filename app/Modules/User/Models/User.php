<?php

namespace App\Modules\User\Models;

use App\Modules\Core\BaseModel;

class User extends BaseModel
{
    /**
     * Название таблицы
     *
     * @var string
     */
    protected $table = 'user';

    /**
     * Атрибуты, которые можно массово присваивать
     *
     * @var array<string>
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
        'tariff_id',
        'tariff_expired',
    ];

    /**
     * Атрибуты, которые нужно скрыть
     *
     * @var array<string>
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
        'tariff_expired' => 'datetime',
    ];
}
