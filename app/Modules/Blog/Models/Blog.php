<?php

namespace App\Modules\Blog\Models;

use App\Modules\Core\BaseModel;
use App\Modules\Core\Models\File;
use App\Modules\Tag\Models\Tag;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Blog extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'blog';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'cover_id',
        'meta_title',
        'meta_description',
        'settings',
        'is_active',
        'posts_count',
        'views_count',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'posts_count' => 'integer',
        'views_count' => 'integer',
    ];

    /**
     * Владелец блога
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Обложка блога
     *
     * @return BelongsTo<File, $this>
     */
    public function cover(): BelongsTo
    {
        return $this->belongsTo(File::class, 'cover_id', 'id');
    }

    /**
     * Посты блога
     *
     * @return HasMany<BlogPost, $this>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(BlogPost::class, 'blog_id', 'id');
    }

    /**
     * Теги блога
     *
     * @return MorphToMany<Tag, $this>
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    /**
     * Проверить, активен ли блог
     */
    public function isActive(): bool
    {
        return $this->is_active;
    }

    /**
     * Увеличить счетчик просмотров
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }
}
