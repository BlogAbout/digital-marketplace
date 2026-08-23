<?php

namespace App\Modules\Shop\Services;

use App\Modules\Core\BaseService;
use App\Modules\Core\Models\File;
use App\Modules\Core\Services\FileService;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Shop\Repositories\ShopProductRepository;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * @extends BaseService<ShopProductRepository>
 */
class ShopProductService extends BaseService
{
    public function __construct(
        private readonly FileService $fileService
    ) {
        parent::__construct();
    }

    /**
     * @return class-string<ShopProductRepository>
     */
    protected function getRepositoryClass(): string
    {
        return ShopProductRepository::class;
    }

    /**
     * Создать товар
     *
     * @param array<string, mixed> $data
     * @param array<int, UploadedFile>|null $images
     */
    public function createProduct(array $data, User $author, ?array $images = null): ShopProduct
    {
        if (!isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $data['author_id'] = $author->id;
        $data['status'] = 'pending';

        /** @var ShopProduct $product */
        $product = $this->repository->create($data);

        if ($images !== null) {
            $this->uploadProductImages($product, $images, $author);
        }

        $this->clearProductCache();

        return $product;
    }

    /**
     * Обновить товар
     *
     * @param array<string, mixed> $data
     */
    public function updateProduct(ShopProduct $product, array $data): ShopProduct
    {
        if (isset($data['name']) && !isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $product->update($data);

        $this->clearProductCache();

        /** @var ShopProduct $product */
        return $product->fresh();
    }

    /**
     * Загрузить изображения товара
     *
     * @param array<int, UploadedFile> $images
     */
    public function uploadProductImages(ShopProduct $product, array $images, User $author): void
    {
        foreach ($images as $index => $image) {
            $file = $this->fileService->uploadFile($image, $author, 'gallery', "products/{$product->id}");

            $product->images()->create([
                'file_id' => $file->id,
                'type' => 'gallery',
                'sort_order' => $index,
                'is_main' => $index === 0,
            ]);
        }
    }

    /**
     * Загрузить файл товара
     */
    public function uploadProductFile(ShopProduct $product, UploadedFile $file, User $author): File
    {
        $fileModel = $this->fileService->uploadFile($file, $author, 'product', "products/{$product->id}");

        $product->update(['file_id' => $fileModel->id]);

        $this->clearProductCache();

        return $fileModel;
    }

    /**
     * Получить товар с кэшированием
     */
    public function getProductWithCache(string $id): ShopProduct
    {
        /** @var ShopProduct $product */
        $product = Cache::remember("shop:product:{$id}", 3600, function () use ($id) {
            return $this->repository->findOrFail($id);
        });

        return $product;
    }

    /**
     * Одобрить товар
     */
    public function approveProduct(ShopProduct $product): ShopProduct
    {
        $product->update([
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        $this->clearProductCache();

        /** @var ShopProduct $product */
        return $product->fresh();
    }

    /**
     * Отклонить товар
     *
     * @param array<string, mixed> $violation
     */
    public function rejectProduct(ShopProduct $product, array $violation): ShopProduct
    {
        $product->update([
            'status' => 'rejected',
            'violation' => $violation,
        ]);

        $this->clearProductCache();

        /** @var ShopProduct $product */
        return $product->fresh();
    }

    /**
     * Приостановить товар
     */
    public function suspendProduct(ShopProduct $product): ShopProduct
    {
        $product->update(['status' => 'suspended']);

        $this->clearProductCache();

        /** @var ShopProduct $product */
        return $product->fresh();
    }

    /**
     * Увеличить счетчик просмотров
     */
    public function incrementViews(ShopProduct $product): void
    {
        $product->incrementViews();
        Cache::forget("shop:product:{$product->id}");
    }

    /**
     * Получить похожие товары
     *
     * @return Collection<int, ShopProduct>
     */
    public function getRelatedProducts(ShopProduct $product, int $limit = 5): Collection
    {
        /** @var Collection<int, ShopProduct> $products */
        $products = ShopProduct::query()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'approved')
            ->limit($limit)
            ->get();

        return $products;
    }

    /**
     * Очистить кэш товара
     */
    protected function clearProductCache(): void
    {
        Cache::forget('shop:products:all');
        Cache::forget('shop:products:popular');
    }
}
