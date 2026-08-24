<?php

namespace App\Modules\Messenger\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Message extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'message';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'chat_id',
        'user_id',
        'reply_to_id',
        'forward_from_id',
        'thread_id',
        'text',
        'media',
        'mentions',
        'reactions',
        'metadata',
        'is_pinned',
        'is_edited',
        'edited_at',
        'self_destruct_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'media' => 'array',
        'mentions' => 'array',
        'reactions' => 'array',
        'metadata' => 'array',
        'is_pinned' => 'boolean',
        'is_edited' => 'boolean',
        'edited_at' => 'datetime',
        'self_destruct_at' => 'datetime',
    ];

    /**
     * Чат, к которому относится сообщение
     *
     * @return BelongsTo<Chat, $this>
     */
    public function chat(): BelongsTo
    {
        return $this->belongsTo(Chat::class, 'chat_id', 'id');
    }

    /**
     * Отправитель сообщения
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Сообщение, на которое отвечает
     *
     * @return BelongsTo<Message, $this>
     */
    public function replyTo(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'reply_to_id', 'id');
    }

    /**
     * Тред, к которому относится сообщение
     *
     * @return BelongsTo<Message, $this>
     */
    public function thread(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'thread_id', 'id');
    }

    /**
     * Ответы в треде
     *
     * @return HasMany<Message, $this>
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Message::class, 'thread_id', 'id');
    }

    /**
     * Проверить, является ли сообщение самоудаляющимся
     */
    public function isSelfDestructing(): bool
    {
        return $this->self_destruct_at !== null;
    }

    /**
     * Проверить, истекло ли время самоудаления
     */
    public function isExpired(): bool
    {
        return $this->self_destruct_at && $this->self_destruct_at->isPast();
    }
}
