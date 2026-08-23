<?php

namespace App\Modules\Shop\Models;

use App\Modules\Core\BaseModel;

class ShopProduct extends BaseModel
{
    /**
     * Название таблицы
     *
     * @var string
     */
    protected $table = 'shop_product';

    /**
     * Атрибуты, которые можно массово присваивать
     *
     * @var array<string>
     */
    protected $fillable = [
        'category_id',
        'name',
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
    ];

    /**
     * Касты атрибутов
     *
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
    ];
}
