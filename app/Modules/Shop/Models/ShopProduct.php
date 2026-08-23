<?php

namespace App\Modules\Shop\Models;

use App\Modules\Core\BaseModel;
use App\Modules\Core\Models\File;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopProduct extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'shop_product';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'currency',
        'is_free',
        'cost',
        'cost_old',
        'author_id',
        'file_id',
        'status',
        'avatar_id',
        'meta_title',
        'meta_description',
        'fields',
        'violation',
        'is_link_domain',
        'api_key_id',
        'is_infinity_download',
        'file_days_expired',
        'access_update',
        'update_discount',
        'views_count',
        'sales_count',
        'approved_at',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_free' => 'boolean',
        'cost' => 'decimal:2',
        'cost_old' => 'decimal:2',
        'fields' => 'array',
        'violation' => 'array',
        'is_link_domain' => 'boolean',
        'is_infinity_download' => 'boolean',
        'file_days_expired' => 'integer',
        'update_discount' => 'decimal:2',
        'views_count' => 'integer',
        'sales_count' => 'integer',
        'approved_at' => 'datetime',
    ];

    /**
     * Категория товара
     *
     * @return BelongsTo<ShopCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ShopCategory::class, 'category_id', 'id');
    }

    /**
     * Автор товара
     *
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    /**
     * Изображения товара
     *
     * @return HasMany<ShopImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ShopImage::class, 'product_id', 'id');
    }

    /**
     * Промокоды товара
     *
     * @return HasMany<ShopPromo, $this>
     */
    public function promos(): HasMany
    {
        return $this->hasMany(ShopPromo::class, 'product_id', 'id');
    }

    /**
     * Заказы товара
     *
     * @return HasMany<ShopOrder, $this>
     */
    public function orders(): HasMany
    {
        return $this->hasMany(ShopOrder::class, 'product_id', 'id');
    }

    /**
     * Changelog товара
     *
     * @return HasMany<ShopChangeLog, $this>
     */
    public function changelogs(): HasMany
    {
        return $this->hasMany(ShopChangeLog::class, 'product_id', 'id');
    }

    /**
     * API ключ товара
     *
     * @return BelongsTo<ShopApiKey, $this>
     */
    public function apiKey(): BelongsTo
    {
        return $this->belongsTo(ShopApiKey::class, 'api_key_id', 'id');
    }

    /**
     * Проверить, одобрен ли товар
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Проверить, бесплатный ли товар
     */
    public function isFree(): bool
    {
        return $this->is_free || $this->cost == 0;
    }

    /**
     * Проверить, требует ли товар привязку к домену
     */
    public function requiresDomain(): bool
    {
        return $this->is_link_domain && $this->api_key_id !== null;
    }

    /**
     * Увеличить счетчик просмотров
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }

    /**
     * Увеличить счетчик продаж
     */
    public function incrementSales(): void
    {
        $this->increment('sales_count');
    }

    /**
     * Получить последнюю версию
     */
    public function getLatestVersion(): ?ShopChangeLog
    {
        return ShopChangeLog::getLatestVersion($this->id);
    }

    /**
     * Файл товара
     *
     * @return BelongsTo<File, $this>
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class, 'file_id', 'id');
    }

    /**
     * Аватар товара
     *
     * @return BelongsTo<File, $this>
     */
    public function avatar(): BelongsTo
    {
        return $this->belongsTo(File::class, 'avatar_id', 'id');
    }
}
