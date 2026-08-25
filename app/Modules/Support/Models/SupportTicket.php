<?php

namespace App\Modules\Support\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SupportTicket extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'support_ticket';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'assigned_to',
        'subject',
        'description',
        'status',
        'priority',
        'category',
        'related_order_id',
        'related_product_id',
        'resolved_at',
        'closed_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    /**
     * Пользователь, создавший тикет
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Сотрудник, ответственный за тикет
     *
     * @return BelongsTo<User, $this>
     */
    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to', 'id');
    }

    /**
     * Сообщения тикета
     *
     * @return HasMany<SupportTicketMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(SupportTicketMessage::class, 'ticket_id', 'id');
    }

    /**
     * Проверить, открыт ли тикет
     */
    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    /**
     * Проверить, решен ли тикет
     */
    public function isResolved(): bool
    {
        return $this->status === 'resolved';
    }
}
