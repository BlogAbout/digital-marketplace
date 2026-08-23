<?php

namespace App\Modules\Shop\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopChangeLog extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'shop_change_log';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'name',
        'description',
        'short_description',
        'version',
        'author_id',
        'is_published',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_published' => 'boolean',
    ];

    /**
     * Товар, к которому относится changelog
     *
     * @return BelongsTo<ShopProduct, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(ShopProduct::class, 'product_id', 'id');
    }

    /**
     * Автор changelog
     *
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    /**
     * Получить последнюю версию товара
     */
    public static function getLatestVersion(string $productId): ?self
    {
        /** @var self|null $changelog */
        $changelog = self::query()
            ->where('product_id', $productId)
            ->where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->first();

        return $changelog;
    }
}
