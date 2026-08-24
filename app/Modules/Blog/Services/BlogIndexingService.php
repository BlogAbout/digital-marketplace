<?php

namespace App\Modules\Blog\Services;

use App\Modules\Blog\Models\Blog;
use App\Modules\Blog\Models\BlogPost;
use App\Modules\Core\Services\ElasticsearchService;

class BlogIndexingService
{
    public function __construct(
        private readonly ElasticsearchService $elasticsearch
    ) {}

    /**
     * Индексировать блог
     */
    public function indexBlog(Blog $blog): bool
    {
        $body = [
            'id' => $blog->id,
            'name' => $blog->name,
            'slug' => $blog->slug,
            'description' => $blog->description,
            'user_id' => $blog->user_id,
            'is_active' => $blog->is_active,
            'posts_count' => $blog->posts_count,
            'views_count' => $blog->views_count,
            'created_at' => $blog->created_at?->toISOString(),
            'author' => $blog->user ? [
                'id' => $blog->user->id,
                'name' => $blog->user->name,
            ] : null,
        ];

        return $this->elasticsearch->indexDocument('blogs', $blog->id, $body);
    }

    /**
     * Индексировать пост
     */
    public function indexPost(BlogPost $post): bool
    {
        $body = [
            'id' => $post->id,
            'title' => $post->title,
            'slug' => $post->slug,
            'excerpt' => $post->excerpt,
            'content' => $post->content,
            'status' => $post->status,
            'blog_id' => $post->blog_id,
            'author_id' => $post->author_id,
            'views_count' => $post->views_count,
            'published_at' => $post->published_at?->toISOString(),
            'created_at' => $post->created_at?->toISOString(),
            'blog' => $post->blog ? [
                'id' => $post->blog->id,
                'name' => $post->blog->name,
                'slug' => $post->blog->slug,
            ] : null,
            'author' => $post->author ? [
                'id' => $post->author->id,
                'name' => $post->author->name,
            ] : null,
        ];

        return $this->elasticsearch->indexDocument('blog_posts', $post->id, $body);
    }

    /**
     * Переиндексировать все блоги и посты
     */
    public function reindexAll(): int
    {
        $this->elasticsearch->deleteIndex('blogs');
        $this->elasticsearch->createIndex('blogs');
        $this->elasticsearch->deleteIndex('blog_posts');
        $this->elasticsearch->createIndex('blog_posts');

        $count = 0;

        Blog::query()
            ->where('is_active', true)
            ->with('user')
            ->chunk(100, function ($blogs) use (&$count) {
                foreach ($blogs as $blog) {
                    $this->indexBlog($blog);
                    $count++;
                }
            });

        BlogPost::query()
            ->where('status', 'published')
            ->with(['blog', 'author'])
            ->chunk(100, function ($posts) use (&$count) {
                foreach ($posts as $post) {
                    $this->indexPost($post);
                    $count++;
                }
            });

        return $count;
    }

    /**
     * Поиск по блогам и постам
     *
     * @return array<string, mixed>
     */
    public function searchBlogs(string $query, int $page = 1, int $perPage = 20): array
    {
        $from = ($page - 1) * $perPage;

        $searchQuery = [
            'query' => [
                'bool' => [
                    'must' => [
                        'multi_match' => [
                            'query' => $query,
                            'fields' => ['title^3', 'content^2', 'excerpt', 'blog.name'],
                            'type' => 'best_fields',
                            'fuzziness' => 'AUTO',
                        ],
                    ],
                    'filter' => [
                        'term' => ['status' => 'published'],
                    ],
                ],
            ],
            'sort' => [
                ['published_at' => ['order' => 'desc']],
                ['views_count' => ['order' => 'desc']],
            ],
            'highlight' => [
                'fields' => [
                    'title' => ['number_of_fragments' => 0],
                    'content' => ['number_of_fragments' => 3],
                ],
            ],
        ];

        return $this->elasticsearch->search(['blogs', 'blog_posts'], $searchQuery, $from, $perPage);
    }
}
