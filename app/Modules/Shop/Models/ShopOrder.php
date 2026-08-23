<?php

namespace App\Modules\Shop\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopOrder extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'shop_order';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'seller_id',
        'buyer_id',
        'currency',
        'is_free',
        'cost',
        'tax',
        'discount',
        'sum',
        'total',
        'status',
        'payment_type',
        'paid_at',
        'file_link',
        'file_expired',
        'domain',
        'api_key',
        'notify_status',
        'promo_id',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_free' => 'boolean',
        'cost' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'sum' => 'decimal:2',
        'total' => 'decimal:2',
        'paid_at' => 'datetime',
        'file_expired' => 'datetime',
    ];

    /**
     * Товар заказа
     *
     * @return BelongsTo<ShopProduct, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(ShopProduct::class, 'product_id', 'id');
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
     * Покупатель
     *
     * @return BelongsTo<User, $this>
     */
    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id', 'id');
    }

    /**
     * Промокод заказа
     *
     * @return BelongsTo<ShopPromo, $this>
     */
    public function promo(): BelongsTo
    {
        return $this->belongsTo(ShopPromo::class, 'promo_id', 'id');
    }

    /**
     * Проверить, оплачен ли заказ
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid' && $this->paid_at !== null;
    }

    /**
     * Проверить, завершен ли заказ
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Проверить, истек ли срок скачивания файла
     */
    public function isFileExpired(): bool
    {
        if (!$this->file_expired) {
            return false;
        }

        return $this->file_expired->isPast();
    }

    /**
     * Получить ссылку на файл, если не истекла
     */
    public function getDownloadLink(): ?string
    {
        if ($this->isFileExpired()) {
            return null;
        }

        return $this->file_link;
    }
}
