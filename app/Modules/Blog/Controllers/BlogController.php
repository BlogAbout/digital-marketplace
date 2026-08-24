<?php

namespace App\Modules\Blog\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Blog\Models\Blog;
use App\Modules\Blog\Requests\CreateBlogRequest;
use App\Modules\Blog\Requests\UpdateBlogRequest;
use App\Modules\Blog\Resources\BlogResource;
use App\Modules\Blog\Services\BlogService;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BlogController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly BlogService $blogService
    ) {}

    /**
     * Получить список блогов
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);

        $blogs = Blog::query()
            ->where('is_active', true)
            ->with(['user', 'cover'])
            ->withCount('posts')
            ->paginate($perPage);

        return BlogResource::collection($blogs);
    }

    /**
     * Получить блог
     */
    public function show(string $id): BlogResource
    {
        $blog = $this->blogService->getBlogWithCache($id);

        $blog->incrementViews();

        return new BlogResource($blog);
    }

    /**
     * Создать блог
     */
    public function store(CreateBlogRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validated();
        $data['user_id'] = $user->id;

        $blog = $this->blogService->createBlog($data);

        return response()->json([
            'message' => 'Блог успешно создан',
            'blog' => new BlogResource($blog),
        ], 201);
    }

    /**
     * Обновить блог
     */
    public function update(UpdateBlogRequest $request, string $id): JsonResponse
    {
        $blog = Blog::query()->findOrFail($id);

        $this->authorize('update', $blog);

        $blog = $this->blogService->updateBlog($blog, $request->validated());

        return response()->json([
            'message' => 'Блог успешно обновлен',
            'blog' => new BlogResource($blog),
        ]);
    }

    /**
     * Удалить блог
     */
    public function destroy(string $id): JsonResponse
    {
        $blog = Blog::query()->findOrFail($id);

        $this->authorize('delete', $blog);

        $blog->delete();

        return response()->json([
            'message' => 'Блог успешно удален',
        ]);
    }
}
