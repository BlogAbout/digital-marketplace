<?php

namespace App\Modules\Tag\Models;

use App\Modules\Blog\Models\BlogPost;
use App\Modules\Core\BaseModel;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends BaseModel
{
    /**
     * @var string
     */
    protected $table = 'tag';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
        'type',
        'usage_count',
    ];

    /**
     * @var array<string, string>
     */
    protected $casts = [
        'usage_count' => 'integer',
    ];

    /**
     * Товары с этим тегом
     *
     * @return MorphToMany<ShopProduct, $this>
     */
    public function products(): MorphToMany
    {
        return $this->morphedByMany(
            ShopProduct::class,
            'taggable'
        );
    }

    /**
     * Блоги с этим тегом
     *
     * @return MorphToMany<\App\Modules\Blog\Models\Blog, $this>
     */
    public function blogs(): MorphToMany
    {
        return $this->morphedByMany(
            \App\Modules\Blog\Models\Blog::class,
            'taggable'
        );
    }

    /**
     * Посты с этим тегом
     *
     * @return MorphToMany<BlogPost, $this>
     */
    public function posts(): MorphToMany
    {
        return $this->morphedByMany(
            BlogPost::class,
            'taggable'
        );
    }

    /**
     * Пользователи с этим тегом
     *
     * @return MorphToMany<User, $this>
     */
    public function users(): MorphToMany
    {
        return $this->morphedByMany(
            User::class,
            'taggable'
        );
    }

    /**
     * Увеличить счетчик использования
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
    }

    /**
     * Уменьшить счетчик использования
     */
    public function decrementUsage(): void
    {
        $this->decrement('usage_count');
    }
}
