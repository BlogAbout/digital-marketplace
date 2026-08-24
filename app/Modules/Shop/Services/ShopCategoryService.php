<?php

namespace App\Modules\Shop\Services;

use App\Modules\Core\BaseService;
use App\Modules\Shop\Models\ShopCategory;
use App\Modules\Shop\Repositories\ShopCategoryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * @extends BaseService<ShopCategoryRepository>
 */
class ShopCategoryService extends BaseService
{
    /**
     * @return class-string<ShopCategoryRepository>
     */
    protected function getRepositoryClass(): string
    {
        return ShopCategoryRepository::class;
    }

    /**
     * Создать категорию
     *
     * @param  array<string, mixed>  $data
     */
    public function createCategory(array $data): ShopCategory
    {
        if (! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        /** @var ShopCategory $category */
        $category = $this->repository->create($data);

        $this->clearCache();

        return $category;
    }

    /**
     * Обновить категорию
     *
     * @param  array<string, mixed>  $data
     */
    public function updateCategory(ShopCategory $category, array $data): ShopCategory
    {
        if (isset($data['name']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category->update($data);

        $this->clearCache();

        /** @var ShopCategory $category */
        return $category->fresh();
    }

    /**
     * Удалить категорию
     */
    public function deleteCategory(ShopCategory $category): bool
    {
        $result = $category->delete();

        $this->clearCache();

        return $result;
    }

    /**
     * Получить все категории с кэшированием
     *
     * @return Collection<int, ShopCategory>
     */
    public function getAllCategories(): Collection
    {
        /** @var Collection<int, ShopCategory> $categories */
        $categories = Cache::remember('shop:categories:all', 3600, function () {
            return $this->repository->getActiveCategories();
        });

        return $categories;
    }

    /**
     * Получить дерево категорий
     *
     * @return Collection<int, ShopCategory>
     */
    public function getCategoryTree(): Collection
    {
        /** @var Collection<int, ShopCategory> $categories */
        $categories = Cache::remember('shop:categories:tree', 3600, function () {
            return $this->repository->getRootCategories()->load('children');
        });

        return $categories;
    }

    /**
     * Очистить кэш категорий
     */
    protected function clearCache(): void
    {
        Cache::forget('shop:categories:all');
        Cache::forget('shop:categories:tree');
    }
}
