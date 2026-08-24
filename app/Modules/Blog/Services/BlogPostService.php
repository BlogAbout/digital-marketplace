<?php

namespace App\Modules\Blog\Services;

use App\Modules\Blog\Models\BlogPost;
use App\Modules\Blog\Repositories\BlogPostRepository;
use App\Modules\Core\BaseService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * @extends BaseService<BlogPostRepository>
 */
class BlogPostService extends BaseService
{
    /**
     * @return class-string<BlogPostRepository>
     */
    protected function getRepositoryClass(): string
    {
        return BlogPostRepository::class;
    }

    /**
     * Создать пост
     *
     * @param  array<string, mixed>  $data
     */
    public function createPost(array $data): BlogPost
    {
        if (! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        /** @var BlogPost $post */
        $post = $this->repository->create($data);

        // Обновляем счетчик постов в блоге
        $post->blog()->increment('posts_count');

        $this->clearCache();

        return $post;
    }

    /**
     * Обновить пост
     *
     * @param  array<string, mixed>  $data
     */
    public function updatePost(BlogPost $post, array $data): BlogPost
    {
        if (isset($data['title']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        $post->update($data);

        $this->clearCache();

        /** @var BlogPost $post */
        return $post->fresh();
    }

    /**
     * Опубликовать пост
     */
    public function publishPost(BlogPost $post): BlogPost
    {
        $post->publish();

        $this->clearCache();

        /** @var BlogPost $post */
        return $post->fresh();
    }

    /**
     * Получить пост с кэшированием
     */
    public function getPostWithCache(string $id): BlogPost
    {
        /** @var BlogPost $post */
        $post = Cache::remember("blog:post:{$id}", 3600, function () use ($id) {
            return $this->repository->findOrFail($id);
        });

        return $post;
    }

    /**
     * Очистить кэш
     */
    protected function clearCache(): void
    {
        Cache::forget('blog:posts:published');
        Cache::forget('blog:posts:popular');
    }
}
