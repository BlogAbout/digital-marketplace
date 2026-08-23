<?php

namespace App\Modules\Shop\Repositories;

use App\Modules\Core\BaseRepository;
use App\Modules\Shop\Models\ShopCategory;
use Illuminate\Database\Eloquent\Collection;

/**
 * @extends BaseRepository<ShopCategory>
 */
class ShopCategoryRepository extends BaseRepository
{
    /**
     * @return class-string<ShopCategory>
     */
    protected function getModelClass(): string
    {
        return ShopCategory::class;
    }

    /**
     * Получить корневые категории
     *
     * @return Collection<int, ShopCategory>
     */
    public function getRootCategories(): Collection
    {
        /** @var Collection<int, ShopCategory> $categories */
        $categories = $this->query()
            ->whereNull('category_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $categories;
    }

    /**
     * Получить дочерние категории
     *
     * @return Collection<int, ShopCategory>
     */
    public function getChildren(string $parentId): Collection
    {
        /** @var Collection<int, ShopCategory> $categories */
        $categories = $this->query()
            ->where('category_id', $parentId)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $categories;
    }

    /**
     * Получить все активные категории
     *
     * @return Collection<int, ShopCategory>
     */
    public function getActiveCategories(): Collection
    {
        /** @var Collection<int, ShopCategory> $categories */
        $categories = $this->query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $categories;
    }

    /**
     * Найти категорию по slug
     */
    public function findBySlug(string $slug): ?ShopCategory
    {
        /** @var ShopCategory|null $category */
        $category = $this->query()
            ->where('slug', $slug)
            ->first();

        return $category;
    }

    /**
     * Получить категории с товарами
     *
     * @return Collection<int, ShopCategory>
     */
    public function getCategoriesWithProducts(): Collection
    {
        /** @var Collection<int, ShopCategory> $categories */
        $categories = $this->query()
            ->where('is_active', true)
            ->whereHas('products', function ($query) {
                $query->where('status', 'approved');
            })
            ->withCount(['products' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->orderBy('sort_order')
            ->get();

        return $categories;
    }
}
