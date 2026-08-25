<?php

namespace App\Modules\Messenger\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatParticipant extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'chat_participant';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'chat_id',
        'user_id',
        'role',
        'is_muted',
        'last_read_at',
        'joined_at',
        'left_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_muted' => 'boolean',
        'last_read_at' => 'datetime',
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
    ];

    /**
     * Чат, к которому относится участник
     *
     * @return BelongsTo<Chat, $this>
     */
    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class, 'chat_id', 'id');
    }

    /**
     * Пользователь-участник
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Проверить, является ли участник владельцем чата
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    /**
     * Проверить, является ли участник администратором
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin' || $this->role === 'owner';
    }

    /**
     * Проверить, заглушен ли чат для участника
     */
    public function isMuted(): bool
    {
        return $this->is_muted;
    }

    /**
     * Проверить, активен ли участник в чате
     */
    public function isActive(): bool
    {
        return $this->left_at === null;
    }

    /**
     * Обновить время последнего прочтения
     */
    public function updateLastRead(): void
    {
        $this->update(['last_read_at' => now()]);
    }
}
