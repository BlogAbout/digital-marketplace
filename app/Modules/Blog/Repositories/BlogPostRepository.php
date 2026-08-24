<?php

namespace App\Modules\Blog\Repositories;

use App\Modules\Blog\Models\BlogPost;
use App\Modules\Core\BaseRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<BlogPost>
 */
class BlogPostRepository extends BaseRepository
{
    /**
     * @return class-string<BlogPost>
     */
    protected function getModelClass(): string
    {
        return BlogPost::class;
    }

    /**
     * Получить опубликованные посты
     *
     * @return LengthAwarePaginator<int, BlogPost>
     */
    public function getPublishedPosts(int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, BlogPost> $posts */
        $posts = $this->query()
            ->where('status', 'published')
            ->with(['blog', 'author', 'cover'])
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);

        return $posts;
    }

    /**
     * Получить посты блога
     *
     * @return LengthAwarePaginator<int, BlogPost>
     */
    public function getBlogPosts(string $blogId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, BlogPost> $posts */
        $posts = $this->query()
            ->where('blog_id', $blogId)
            ->where('status', 'published')
            ->with(['author', 'cover'])
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);

        return $posts;
    }

    /**
     * Найти пост по slug
     */
    public function findBySlug(string $slug): ?BlogPost
    {
        /** @var BlogPost|null $post */
        $post = $this->query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->with(['blog', 'author', 'cover'])
            ->first();

        return $post;
    }

    /**
     * Получить популярные посты
     *
     * @return Collection<int, BlogPost>
     */
    public function getPopularPosts(int $limit = 10): Collection
    {
        /** @var Collection<int, BlogPost> $posts */
        $posts = $this->query()
            ->where('status', 'published')
            ->orderBy('views_count', 'desc')
            ->limit($limit)
            ->with(['blog', 'author', 'cover'])
            ->get();

        return $posts;
    }

    /**
     * Поиск постов
     *
     * @return LengthAwarePaginator<int, BlogPost>
     */
    public function searchPosts(string $search, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, BlogPost> $posts */
        $posts = $this->query()
            ->where('status', 'published')
            ->where(function ($query) use ($search) {
                $query->where('title', 'ilike', "%{$search}%")
                    ->orWhere('content', 'ilike', "%{$search}%")
                    ->orWhere('excerpt', 'ilike', "%{$search}%");
            })
            ->with(['blog', 'author', 'cover'])
            ->paginate($perPage);

        return $posts;
    }
}
