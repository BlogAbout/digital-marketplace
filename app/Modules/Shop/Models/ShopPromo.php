<?php

namespace App\Modules\Shop\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopPromo extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'shop_promo';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'product_id',
        'author_id',
        'type',
        'value',
        'is_multiple',
        'max_uses',
        'used_count',
        'expires_at',
        'is_active',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'value' => 'decimal:2',
        'is_multiple' => 'boolean',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Товар, к которому относится промокод
     *
     * @return BelongsTo<ShopProduct, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(ShopProduct::class, 'product_id', 'id');
    }

    /**
     * Автор промокода
     *
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    /**
     * Проверить, действителен ли промокод
     */
    public function isValid(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return false;
        }

        if (!$this->is_multiple && $this->used_count > 0) {
            return false;
        }

        if ($this->max_uses && $this->used_count >= $this->max_uses) {
            return false;
        }

        return true;
    }

    /**
     * Рассчитать скидку
     */
    public function calculateDiscount(float $price): float
    {
        if ($this->type === 'percent') {
            return $price * ($this->value / 100);
        }

        return min((float) $this->value, $price);
    }

    /**
     * Увеличить счетчик использования
     */
    public function incrementUsage(): void
    {
        $this->increment('used_count');
    }
}
