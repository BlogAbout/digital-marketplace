<?php

namespace App\Modules\Shop\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shop\Models\ShopCategory;
use App\Modules\Shop\Requests\CreateCategoryRequest;
use App\Modules\Shop\Requests\UpdateCategoryRequest;
use App\Modules\Shop\Resources\ShopCategoryResource;
use App\Modules\Shop\Services\ShopCategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopCategoryController extends Controller
{
    public function __construct(
        private readonly ShopCategoryService $categoryService
    ) {}

    /**
     * Получить список категорий
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        if ($request->get('tree')) {
            $categories = $this->categoryService->getCategoryTree();
        } else {
            $categories = $this->categoryService->getAllCategories();
        }

        return ShopCategoryResource::collection($categories);
    }

    /**
     * Получить категорию
     */
    public function show(string $id): ShopCategoryResource
    {
        $category = ShopCategory::query()->findOrFail($id);
        return new ShopCategoryResource($category);
    }

    /**
     * Создать категорию
     */
    public function store(CreateCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory($request->validated());

        return response()->json([
            'message' => 'Категория успешно создана',
            'category' => new ShopCategoryResource($category),
        ], 201);
    }

    /**
     * Обновить категорию
     */
    public function update(UpdateCategoryRequest $request, string $id): JsonResponse
    {
        $category = ShopCategory::query()->findOrFail($id);
        $category = $this->categoryService->updateCategory($category, $request->validated());

        return response()->json([
            'message' => 'Категория успешно обновлена',
            'category' => new ShopCategoryResource($category),
        ]);
    }

    /**
     * Удалить категорию
     */
    public function destroy(string $id): JsonResponse
    {
        $category = ShopCategory::query()->findOrFail($id);
        $this->categoryService->deleteCategory($category);

        return response()->json([
            'message' => 'Категория успешно удалена',
        ]);
    }
}
