<?php

namespace App\Modules\Social\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Activity extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'activity';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'subject_id',
        'subject_type',
        'data',
        'visibility',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'data' => 'array',
    ];

    /**
     * Пользователь, совершивший действие
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Субъект активности (полиморфная связь)
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
