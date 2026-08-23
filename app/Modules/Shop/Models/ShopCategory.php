<?php

namespace App\Modules\Shop\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShopCategory extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'shop_category';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'slogan',
        'description',
        'author_id',
        'avatar_id',
        'cover_id',
        'meta_title',
        'meta_description',
        'fields',
        'sort_order',
        'is_active',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'fields' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Родительская категория
     *
     * @return BelongsTo<ShopCategory, $this>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(ShopCategory::class, 'category_id', 'id');
    }

    /**
     * Дочерние категории
     *
     * @return HasMany<ShopCategory, $this>
     */
    public function children(): HasMany
    {
        return $this->hasMany(ShopCategory::class, 'category_id', 'id');
    }

    /**
     * Товары в категории
     *
     * @return HasMany<ShopProduct, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(ShopProduct::class, 'category_id', 'id');
    }

    /**
     * Автор категории
     *
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }
}
