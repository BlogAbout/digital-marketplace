<?php

namespace App\Modules\Core\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Blog\Services\BlogIndexingService;
use App\Modules\Shop\Services\ProductIndexingService;
use App\Modules\User\Services\UserIndexingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(
        private readonly ProductIndexingService $productIndexing,
        private readonly BlogIndexingService $blogIndexing,
        private readonly UserIndexingService $userIndexing
    ) {}

    /**
     * Глобальный поиск
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');
        $type = $request->get('type', 'all'); // all, products, blogs, users
        $page = (int) $request->get('page', 1);
        $perPage = (int) $request->get('per_page', 20);

        if (empty($query)) {
            return response()->json([
                'message' => 'Введите поисковый запрос',
            ], 400);
        }

        $results = [];

        if ($type === 'all' || $type === 'products') {
            $results['products'] = $this->productIndexing->searchProducts($query, $page, $perPage);
        }

        if ($type === 'all' || $type === 'blogs') {
            $results['blogs'] = $this->blogIndexing->searchBlogs($query, $page, $perPage);
        }

        if ($type === 'all' || $type === 'users') {
            $results['users'] = $this->userIndexing->searchUsers($query, $page, $perPage);
        }

        return response()->json([
            'query' => $query,
            'type' => $type,
            'results' => $results,
        ]);
    }

    /**
     * Переиндексация (только для админов)
     */
    public function reindex(Request $request): JsonResponse
    {
        /** @var \App\Modules\User\Models\User $user */
        $user = $request->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                'message' => 'Доступ запрещен',
            ], 403);
        }

        $productsCount = $this->productIndexing->reindexAllProducts();
        $blogsCount = $this->blogIndexing->reindexAll();
        $usersCount = $this->userIndexing->reindexAllUsers();

        return response()->json([
            'message' => 'Переиндексация завершена',
            'products' => $productsCount,
            'blogs' => $blogsCount,
            'users' => $usersCount,
        ]);
    }
}
