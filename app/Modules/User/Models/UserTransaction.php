<?php

namespace App\Modules\User\Models;

use App\Modules\Core\BaseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserTransaction extends BaseModel
{
    /**
     * Название таблицы
     *
     * @var string
     */
    protected $table = 'user_transaction';

    /**
     * Атрибуты, которые можно массово присваивать
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'currency',
        'balance_before',
        'balance_after',
        'related_id',
        'related_type',
        'description',
        'metadata',
        'status',
    ];

    /**
     * Касты атрибутов
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'metadata' => 'array',
    ];

    /**
     * Пользователь, которому принадлежит транзакция
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
