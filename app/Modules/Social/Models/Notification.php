<?php

namespace App\Modules\Social\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'notification';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'icon',
        'url',
        'read_at',
        'sent_at',
        'status',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    /**
     * Пользователь, которому отправлено уведомление
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Проверить, прочитано ли уведомление
     */
    public function isRead(): bool
    {
        return $this->read_at !== null;
    }

    /**
     * Отметить как прочитанное
     */
    public function markAsRead(): void
    {
        $this->update([
            'read_at' => now(),
            'status' => 'read',
        ]);
    }

    /**
     * Отметить как отправленное
     */
    public function markAsSent(): void
    {
        $this->update([
            'sent_at' => now(),
            'status' => 'sent',
        ]);
    }
}
