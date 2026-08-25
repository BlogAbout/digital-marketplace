<?php

namespace App\Modules\Statistics\Models;

use App\Modules\Core\BaseModel;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStatistic extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'user_statistic';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'date',
        'views_count',
        'sales_count',
        'revenue',
        'followers_count',
        'new_followers_count',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'views_count' => 'integer',
        'sales_count' => 'integer',
        'revenue' => 'decimal:2',
        'followers_count' => 'integer',
        'new_followers_count' => 'integer',
    ];

    /**
     * Пользователь статистики
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
