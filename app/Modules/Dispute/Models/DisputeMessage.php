<?php

namespace App\Modules\Dispute\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DisputeMessage extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'dispute_message';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'dispute_id',
        'user_id',
        'message',
        'attachments',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'attachments' => 'array',
    ];

    /**
     * Спор, к которому относится сообщение
     *
     * @return BelongsTo<Dispute, $this>
     */
    public function dispute(): BelongsTo
    {
        return $this->belongsTo(Dispute::class, 'dispute_id', 'id');
    }

    /**
     * Отправитель сообщения
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
