<?php

namespace App\Modules\Shop\Repositories;

use App\Modules\Core\BaseRepository;
use App\Modules\Shop\Models\ShopProduct;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<ShopProduct>
 */
class ShopProductRepository extends BaseRepository
{
    /**
     * @return class-string<ShopProduct>
     */
    protected function getModelClass(): string
    {
        return ShopProduct::class;
    }

    /**
     * Получить одобренные товары
     *
     * @return LengthAwarePaginator<int, ShopProduct>
     */
    public function getApprovedProducts(int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopProduct> $products */
        $products = $this->query()
            ->where('status', 'approved')
            ->with(['category', 'author', 'images'])
            ->paginate($perPage);

        return $products;
    }

    /**
     * Получить товары по категории
     *
     * @return LengthAwarePaginator<int, ShopProduct>
     */
    public function getProductsByCategory(string $categoryId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopProduct> $products */
        $products = $this->query()
            ->where('category_id', $categoryId)
            ->where('status', 'approved')
            ->with(['author', 'images'])
            ->paginate($perPage);

        return $products;
    }

    /**
     * Получить товары пользователя
     *
     * @return LengthAwarePaginator<int, ShopProduct>
     */
    public function getUserProducts(string $userId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopProduct> $products */
        $products = $this->query()
            ->where('author_id', $userId)
            ->with(['category', 'images'])
            ->paginate($perPage);

        return $products;
    }

    /**
     * Получить товары по статусу
     *
     * @return LengthAwarePaginator<int, ShopProduct>
     */
    public function getProductsByStatus(string $status, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopProduct> $products */
        $products = $this->query()
            ->where('status', $status)
            ->with(['category', 'author', 'images'])
            ->paginate($perPage);

        return $products;
    }

    /**
     * Найти товар по slug
     */
    public function findBySlug(string $slug): ?ShopProduct
    {
        /** @var ShopProduct|null $product */
        $product = $this->query()
            ->where('slug', $slug)
            ->with(['category', 'author', 'images', 'changelogs'])
            ->first();

        return $product;
    }

    /**
     * Получить популярные товары
     *
     * @return Collection<int, ShopProduct>
     */
    public function getPopularProducts(int $limit = 10): Collection
    {
        /** @var \Illuminate\Database\Eloquent\Builder<ShopProduct> $query */
        $query = $this->query()
            ->where('status', 'approved')
            ->orderBy('views_count', 'desc')
            ->limit($limit);

        /** @var Collection<int, ShopProduct> $products */
        $products = $query->with(['author', 'images'])->get();

        return $products;
    }

    /**
     * Поиск товаров
     *
     * @return LengthAwarePaginator<int, ShopProduct>
     */
    public function searchProducts(string $search, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopProduct> $products */
        $products = $this->query()
            ->where('status', 'approved')
            ->where(function ($query) use ($search) {
                $query->where('name', 'ilike', "%{$search}%")
                    ->orWhere('description', 'ilike', "%{$search}%")
                    ->orWhere('meta_title', 'ilike', "%{$search}%");
            })
            ->with(['category', 'author', 'images'])
            ->paginate($perPage);

        return $products;
    }
}
