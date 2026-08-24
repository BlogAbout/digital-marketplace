<?php

namespace App\Modules\Social\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'subscription';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'subscriber_id',
        'user_id',
        'is_active',
        'subscribed_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'subscribed_at' => 'datetime',
    ];

    /**
     * Подписчик
     *
     * @return BelongsTo<User, $this>
     */
    public function subscriber(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subscriber_id', 'id');
    }

    /**
     * Пользователь, на которого подписаны
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Проверить, активна ли подписка
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }
}
