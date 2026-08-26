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
use OpenApi\Attributes as OA;

#[OA\Tag(
    name: 'Products',
    description: 'API для работы с товарами'
)]
class ShopProductController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly ShopProductService $productService
    ) {}

    #[OA\Get(
        path: '/shop/products',
        summary: 'Получить список товаров',
        tags: ['Products'],
        parameters: [
            new OA\Parameter(
                name: 'page',
                description: 'Номер страницы',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer')
            ),
            new OA\Parameter(
                name: 'per_page',
                description: 'Количество элементов на странице',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'integer')
            ),
            new OA\Parameter(
                name: 'category_id',
                description: 'ID категории',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            ),
            new OA\Parameter(
                name: 'search',
                description: 'Поисковый запрос',
                in: 'query',
                required: false,
                schema: new OA\Schema(type: 'string')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Список товаров',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(ref: '#/components/schemas/Product')
                        )
                    ],
                    type: 'object'
                )
            )
        ]
    )]
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
            ->when(! $user || ! $user->hasRole('admin'), function ($query) {
                return $query->where('status', 'approved');
            })
            ->with(['category', 'author', 'images'])
            ->paginate($perPage);

        return ShopProductResource::collection($products);
    }

    #[OA\Get(
        path: '/shop/products/{id}',
        summary: 'Получить товар по ID',
        tags: ['Products'],
        parameters: [
            new OA\Parameter(
                name: 'id',
                description: 'ID товара',
                in: 'path',
                required: true,
                schema: new OA\Schema(type: 'string', format: 'uuid')
            )
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Информация о товаре',
                content: new OA\JsonContent(ref: '#/components/schemas/Product')
            ),
            new OA\Response(
                response: 404,
                description: 'Товар не найден'
            )
        ]
    )]
    public function show(string $id): ShopProductResource
    {
        $product = $this->productService->getProductWithCache($id);

        // Увеличиваем счетчик просмотров
        $this->productService->incrementViews($product);

        return new ShopProductResource($product);
    }

    #[OA\Post(
        path: '/shop/products',
        summary: 'Создать товар',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['category_id', 'name', 'description'],
                properties: [
                    new OA\Property(property: 'category_id', type: 'string', format: 'uuid'),
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'description', type: 'string'),
                    new OA\Property(property: 'currency', type: 'string', default: 'USD'),
                    new OA\Property(property: 'is_free', type: 'boolean', default: false),
                    new OA\Property(property: 'cost', type: 'number', format: 'float')
                ],
                type: 'object'
            )
        ),
        tags: ['Products'],
        responses: [
            new OA\Response(
                response: 201,
                description: 'Товар создан',
                content: new OA\JsonContent(ref: '#/components/schemas/Product')
            ),
            new OA\Response(
                response: 422,
                description: 'Ошибка валидации'
            )
        ]
    )]
    public function store(CreateProductRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $images = $request->getImages();
        $productFile = $request->getProductFile();

        $product = $this->productService->createProduct(
            $request->validated(),
            $user,
            $images
        );

        // Загружаем основной файл товара, если он есть
        if ($productFile) {
            $this->productService->uploadProductFile($product, $productFile, $user);
        }

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
