<?php

namespace App\Modules\Blog\Services;

use App\Modules\Core\BaseService;
use App\Modules\Blog\Models\Blog;
use App\Modules\Blog\Repositories\BlogRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * @extends BaseService<BlogRepository>
 */
class BlogService extends BaseService
{
    /**
     * @return class-string<BlogRepository>
     */
    protected function getRepositoryClass(): string
    {
        return BlogRepository::class;
    }

    /**
     * Создать блог
     *
     * @param array<string, mixed> $data
     */
    public function createBlog(array $data): Blog
    {
        if (!isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        /** @var Blog $blog */
        $blog = $this->repository->create($data);

        $this->clearCache();

        return $blog;
    }

    /**
     * Обновить блог
     *
     * @param array<string, mixed> $data
     */
    public function updateBlog(Blog $blog, array $data): Blog
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $blog->update($data);

        $this->clearCache();

        /** @var Blog $blog */
        return $blog->fresh();
    }

    /**
     * Получить блог с кэшированием
     */
    public function getBlogWithCache(string $id): Blog
    {
        /** @var Blog $blog */
        $blog = Cache::remember("blog:{$id}", 3600, function () use ($id) {
            return $this->repository->findOrFail($id);
        });

        return $blog;
    }

    /**
     * Очистить кэш
     */
    protected function clearCache(): void
    {
        Cache::forget('blogs:active');
        Cache::forget('blogs:popular');
    }
}
