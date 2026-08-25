<?php

namespace App\Modules\Messenger\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chat extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'chat';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'name',
        'owner_id',
        'company_id',
        'last_message_id',
        'description',
        'avatar_id',
        'settings',
        'is_active',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Владелец чата
     *
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id', 'id');
    }

    /**
     * Участники чата
     *
     * @return HasMany<ChatParticipant, $this>
     */
    public function participants(): HasMany
    {
        return $this->hasMany(ChatParticipant::class, 'chat_id', 'id');
    }

    /**
     * Сообщения чата
     *
     * @return HasMany<Message, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'chat_id', 'id');
    }

    /**
     * Последнее сообщение
     *
     * @return BelongsTo<Message, $this>
     */
    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id', 'id');
    }

    /**
     * Получить пользователей чата
     *
     * @return Collection<int, User>
     */
    public function users(): Collection
    {
        /** @var Collection<int, User> $users */
        $users = User::query()
            ->whereIn('id', function ($query) {
                $query->select('user_id')
                    ->from('chat_participant')
                    ->where('chat_id', $this->id)
                    ->whereNull('left_at');
            })
            ->get();

        return $users;
    }

    /**
     * Проверить, является ли чат групповым
     */
    public function isGroup(): bool
    {
        return $this->type === 'group';
    }

    /**
     * Проверить, является ли чат приватным
     */
    public function isPrivate(): bool
    {
        return $this->type === 'private';
    }

    /**
     * Проверить, является ли пользователь участником чата
     */
    public function hasParticipant(string $userId): bool
    {
        return $this->participants()
            ->where('user_id', $userId)
            ->whereNull('left_at')
            ->exists();
    }
}
