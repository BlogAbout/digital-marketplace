<?php

namespace App\Modules\Shop\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Shop\Requests\CreateProductRequest;
use App\Modules\Shop\Requests\UpdateProductRequest;
use App\Modules\Shop\Resources\ShopProductResource;
use App\Modules\Shop\Services\ShopProductService;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;

class ShopProductController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly ShopProductService $productService
    ) {}

    /**
     * Получить список товаров
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);
        $categoryId = $request->get('category_id');
        $search = $request->get('search');
        $status = $request->get('status');

        /** @var User|null $user */
        $user = $request->user();

        $products = ShopProduct::query()
            ->when($categoryId, function ($query) use ($categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->when($search, function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('name', 'ilike', "%{$search}%")
                        ->orWhere('description', 'ilike', "%{$search}%");
                });
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->when(!$user || !$user->hasRole('admin'), function ($query) {
                return $query->where('status', 'approved');
            })
            ->with(['category', 'author', 'images'])
            ->paginate($perPage);

        return ShopProductResource::collection($products);
    }

    /**
     * Получить товар
     */
    public function show(string $id): ShopProductResource
    {
        $product = $this->productService->getProductWithCache($id);

        // Увеличиваем счетчик просмотров
        $this->productService->incrementViews($product);

        return new ShopProductResource($product);
    }

    /**
     * Создать товар
     */
    public function store(CreateProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct(
            $request->validated(),
            $request->user(),
            $request->file('images')
        );

        return response()->json([
            'message' => 'Товар успешно создан и отправлен на модерацию',
            'product' => new ShopProductResource($product),
        ], 201);
    }

    /**
     * Обновить товар
     */
    public function update(UpdateProductRequest $request, string $id): JsonResponse
    {
        $product = ShopProduct::query()->findOrFail($id);

        $this->authorize('update', $product);

        $product = $this->productService->updateProduct($product, $request->validated());

        return response()->json([
            'message' => 'Товар успешно обновлен',
            'product' => new ShopProductResource($product),
        ]);
    }

    /**
     * Удалить товар
     */
    public function destroy(string $id): JsonResponse
    {
        $product = ShopProduct::query()->findOrFail($id);

        $this->authorize('delete', $product);

        $product->delete();

        return response()->json([
            'message' => 'Товар успешно удален',
        ]);
    }

    /**
     * Одобрить товар
     */
    public function approve(string $id): JsonResponse
    {
        $product = ShopProduct::query()->findOrFail($id);

        $this->authorize('approve', $product);

        $product = $this->productService->approveProduct($product);

        return response()->json([
            'message' => 'Товар одобрен',
            'product' => new ShopProductResource($product),
        ]);
    }

    /**
     * Отклонить товар
     */
    public function reject(Request $request, string $id): JsonResponse
    {
        $product = ShopProduct::query()->findOrFail($id);

        $this->authorize('reject', $product);

        $product = $this->productService->rejectProduct($product, $request->get('violation', []));

        return response()->json([
            'message' => 'Товар отклонен',
            'product' => new ShopProductResource($product),
        ]);
    }
}
