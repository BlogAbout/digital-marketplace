<?php

namespace App\Modules\Shop\Models;

use App\Modules\Core\BaseModel;
use App\Modules\Core\Models\File;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopImage extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'shop_image';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'file_id',
        'type',
        'sort_order',
        'is_main',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'sort_order' => 'integer',
        'is_main' => 'boolean',
    ];

    /**
     * Товар, к которому относится изображение
     *
     * @return BelongsTo<ShopProduct, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(ShopProduct::class, 'product_id', 'id');
    }

    /**
     * Файл изображения
     *
     * @return BelongsTo<File, $this>
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class, 'file_id', 'id');
    }

    /**
     * Получить URL изображения
     */
    public function getUrl(): ?string
    {
        return $this->file ? $this->file->getUrl() : null;
    }

    /**
     * Проверить, является ли изображение главным
     */
    public function isMain(): bool
    {
        return $this->is_main;
    }
}
