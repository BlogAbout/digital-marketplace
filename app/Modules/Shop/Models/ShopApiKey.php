<?php

namespace App\Modules\Shop\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class ShopApiKey extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'shop_api_key';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'key',
        'url',
        'description',
        'is_active',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Владелец API ключа
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Товары, привязанные к API ключу
     *
     * @return HasMany<ShopProduct, $this>
     */
    public function products(): HasMany
    {
        return $this->hasMany(ShopProduct::class, 'api_key_id', 'id');
    }

    /**
     * Сгенерировать новый API ключ
     */
    public static function generateKey(): string
    {
        return 'pk_' . Str::random(64);
    }

    /**
     * Проверить, активен ли ключ
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Отправить webhook запрос
     */
    public function sendWebhook(array $data): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        try {
            $response = \Illuminate\Support\Facades\Http::timeout(10)
                ->post($this->url, $data);

            return $response->successful();
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Webhook failed: ' . $e->getMessage());
            return false;
        }
    }
}
