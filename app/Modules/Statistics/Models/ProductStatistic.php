<?php

namespace App\Modules\Statistics\Models;

use App\Modules\Core\BaseModel;
use App\Modules\Shop\Models\ShopProduct;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductStatistic extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'product_statistic';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'date',
        'views_count',
        'unique_views_count',
        'sales_count',
        'revenue',
        'conversion_rate',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'views_count' => 'integer',
        'unique_views_count' => 'integer',
        'sales_count' => 'integer',
        'revenue' => 'decimal:2',
        'conversion_rate' => 'decimal:2',
    ];

    /**
     * Товар статистики
     *
     * @return BelongsTo<ShopProduct, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(ShopProduct::class, 'product_id', 'id');
    }
}
