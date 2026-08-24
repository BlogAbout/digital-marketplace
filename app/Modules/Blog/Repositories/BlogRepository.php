<?php

namespace App\Modules\Blog\Repositories;

use App\Modules\Blog\Models\Blog;
use App\Modules\Core\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<Blog>
 */
class BlogRepository extends BaseRepository
{
    /**
     * @return class-string<Blog>
     */
    protected function getModelClass(): string
    {
        return Blog::class;
    }

    /**
     * Получить активные блоги
     *
     * @return LengthAwarePaginator<int, Blog>
     */
    public function getActiveBlogs(int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, Blog> $blogs */
        $blogs = $this->query()
            ->where('is_active', true)
            ->with(['user', 'cover'])
            ->withCount('posts')
            ->paginate($perPage);

        return $blogs;
    }

    /**
     * Получить блоги пользователя
     *
     * @return Collection<int, Blog>
     */
    public function getUserBlogs(string $userId): Collection
    {
        /** @var Collection<int, Blog> $blogs */
        $blogs = $this->query()
            ->where('user_id', $userId)
            ->withCount('posts')
            ->get();

        return $blogs;
    }

    /**
     * Найти блог по slug
     */
    public function findBySlug(string $slug): ?Blog
    {
        /** @var Blog|null $blog */
        $blog = $this->query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['user', 'cover'])
            ->first();

        return $blog;
    }

    /**
     * Получить популярные блоги
     *
     * @return Collection<int, Blog>
     */
    public function getPopularBlogs(int $limit = 10): Collection
    {
        /** @var Collection<int, Blog> $blogs */
        $blogs = $this->query()
            ->where('is_active', true)
            ->orderBy('views_count', 'desc')
            ->limit($limit)
            ->with(['user', 'cover'])
            ->get();

        return $blogs;
    }
}
