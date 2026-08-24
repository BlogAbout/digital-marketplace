<?php

namespace App\Modules\Blog\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Blog\Models\BlogPost;
use App\Modules\Blog\Requests\CreatePostRequest;
use App\Modules\Blog\Requests\UpdatePostRequest;
use App\Modules\Blog\Resources\BlogPostResource;
use App\Modules\Blog\Services\BlogPostService;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BlogPostController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly BlogPostService $postService
    ) {}

    /**
     * Получить список постов
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);
        $blogId = $request->get('blog_id');
        $search = $request->get('search');

        $posts = BlogPost::query()
            ->where('status', 'published')
            ->when($blogId, function ($query) use ($blogId) {
                return $query->where('blog_id', $blogId);
            })
            ->when($search, function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('title', 'ilike', "%{$search}%")
                        ->orWhere('content', 'ilike', "%{$search}%");
                });
            })
            ->with(['blog', 'author', 'cover'])
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);

        return BlogPostResource::collection($posts);
    }

    /**
     * Получить пост
     */
    public function show(string $id): BlogPostResource
    {
        $post = $this->postService->getPostWithCache($id);

        $post->incrementViews();

        return new BlogPostResource($post);
    }

    /**
     * Создать пост
     */
    public function store(CreatePostRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validated();
        $data['author_id'] = $user->id;

        $post = $this->postService->createPost($data);

        return response()->json([
            'message' => 'Пост успешно создан',
            'post' => new BlogPostResource($post),
        ], 201);
    }

    /**
     * Обновить пост
     */
    public function update(UpdatePostRequest $request, string $id): JsonResponse
    {
        $post = BlogPost::query()->findOrFail($id);

        $this->authorize('update', $post);

        $post = $this->postService->updatePost($post, $request->validated());

        return response()->json([
            'message' => 'Пост успешно обновлен',
            'post' => new BlogPostResource($post),
        ]);
    }

    /**
     * Опубликовать пост
     */
    public function publish(string $id): JsonResponse
    {
        $post = BlogPost::query()->findOrFail($id);

        $this->authorize('publish', $post);

        $post = $this->postService->publishPost($post);

        return response()->json([
            'message' => 'Пост успешно опубликован',
            'post' => new BlogPostResource($post),
        ]);
    }

    /**
     * Удалить пост
     */
    public function destroy(string $id): JsonResponse
    {
        $post = BlogPost::query()->findOrFail($id);

        $this->authorize('delete', $post);

        $post->delete();

        return response()->json([
            'message' => 'Пост успешно удален',
        ]);
    }
}
