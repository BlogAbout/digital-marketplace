<?php

namespace App\Modules\Dispute\Models;

use App\Modules\Core\BaseModel;
use App\Modules\Shop\Models\ShopOrder;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dispute extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'dispute';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'buyer_id',
        'seller_id',
        'reason',
        'description',
        'status',
        'resolution',
        'resolution_note',
        'refund_amount',
        'resolved_by',
        'resolved_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'refund_amount' => 'decimal:2',
        'resolved_at' => 'datetime',
    ];

    /**
     * Спорный заказ
     *
     * @return BelongsTo<ShopOrder, $this>
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(ShopOrder::class, 'order_id', 'id');
    }

    /**
     * Покупатель
     *
     * @return BelongsTo<User, $this>
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id', 'id');
    }

    /**
     * Продавец
     *
     * @return BelongsTo<User, $this>
     */
    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id', 'id');
    }

    /**
     * Кто разрешил спор
     *
     * @return BelongsTo<User, $this>
     */
    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by', 'id');
    }

    /**
     * Сообщения спора
     *
     * @return HasMany<DisputeMessage, $this>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(DisputeMessage::class, 'dispute_id', 'id');
    }

    /**
     * Проверить, открыт ли спор
     */
    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    /**
     * Проверить, решен ли спор
     */
    public function isResolved(): bool
    {
        return $this->status === 'resolved';
    }
}
