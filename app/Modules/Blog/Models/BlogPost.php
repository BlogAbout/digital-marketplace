<?php

namespace App\Modules\Blog\Models;

use App\Modules\Core\BaseModel;
use App\Modules\Core\Models\File;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class BlogPost extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'blog_post';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'blog_id',
        'author_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_id',
        'status',
        'published_at',
        'meta_title',
        'meta_description',
        'fields',
        'views_count',
        'likes_count',
        'comments_count',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'fields' => 'array',
        'published_at' => 'datetime',
        'views_count' => 'integer',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
    ];

    /**
     * Блог, к которому относится пост
     *
     * @return BelongsTo<Blog, $this>
     */
    public function blog(): BelongsTo
    {
        return $this->belongsTo(Blog::class, 'blog_id', 'id');
    }

    /**
     * Автор поста
     *
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id', 'id');
    }

    /**
     * Обложка поста
     *
     * @return BelongsTo<File, $this>
     */
    public function cover(): BelongsTo
    {
        return $this->belongsTo(File::class, 'cover_id', 'id');
    }

    /**
     * Теги поста
     *
     * @return MorphToMany<Tag, $this>
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    /**
     * Проверить, опубликован ли пост
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' && $this->published_at !== null;
    }

    /**
     * Проверить, является ли пост черновиком
     */
    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    /**
     * Опубликовать пост
     */
    public function publish(): void
    {
        $this->update([
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Увеличить счетчик просмотров
     */
    public function incrementViews(): void
    {
        $this->increment('views_count');
    }
}
