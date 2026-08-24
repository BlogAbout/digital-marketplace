<?php

namespace App\Modules\Shop\Services;

use App\Modules\Core\Services\ElasticsearchService;
use App\Modules\Shop\Models\ShopProduct;

class ProductIndexingService
{
    public function __construct(
        private readonly ElasticsearchService $elasticsearch
    ) {}

    /**
     * Индексировать товар
     */
    public function indexProduct(ShopProduct $product): bool
    {
        $body = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'currency' => $product->currency,
            'is_free' => $product->is_free,
            'cost' => $product->cost,
            'status' => $product->status,
            'category_id' => $product->category_id,
            'author_id' => $product->author_id,
            'views_count' => $product->views_count,
            'sales_count' => $product->sales_count,
            'created_at' => $product->created_at?->toISOString(),
            'updated_at' => $product->updated_at?->toISOString(),
            'category' => $product->category ? [
                'id' => $product->category->id,
                'name' => $product->category->name,
                'slug' => $product->category->slug,
            ] : null,
            'author' => $product->author ? [
                'id' => $product->author->id,
                'name' => $product->author->name,
            ] : null,
        ];

        return $this->elasticsearch->indexDocument('products', $product->id, $body);
    }

    /**
     * Обновить индексацию товара
     */
    public function updateProductIndex(ShopProduct $product): bool
    {
        return $this->indexProduct($product);
    }

    /**
     * Удалить товар из индекса
     */
    public function removeProductIndex(ShopProduct $product): bool
    {
        return $this->elasticsearch->deleteDocument('products', $product->id);
    }

    /**
     * Переиндексировать все товары
     */
    public function reindexAllProducts(): int
    {
        $this->elasticsearch->deleteIndex('products');
        $this->elasticsearch->createIndex('products');

        $count = 0;

        ShopProduct::query()
            ->where('status', 'approved')
            ->with(['category', 'author'])
            ->chunk(100, function ($products) use (&$count) {
                foreach ($products as $product) {
                    $this->indexProduct($product);
                    $count++;
                }
            });

        return $count;
    }

    /**
     * Поиск товаров
     *
     * @return array<string, mixed>
     */
    public function searchProducts(string $query, int $page = 1, int $perPage = 20): array
    {
        $from = ($page - 1) * $perPage;

        $searchQuery = [
            'query' => [
                'bool' => [
                    'must' => [
                        'multi_match' => [
                            'query' => $query,
                            'fields' => ['name^3', 'description^2', 'category.name'],
                            'type' => 'best_fields',
                            'fuzziness' => 'AUTO',
                        ],
                    ],
                    'filter' => [
                        'term' => ['status' => 'approved'],
                    ],
                ],
            ],
            'sort' => [
                ['sales_count' => ['order' => 'desc']],
                ['views_count' => ['order' => 'desc']],
                ['created_at' => ['order' => 'desc']],
            ],
            'highlight' => [
                'fields' => [
                    'name' => ['number_of_fragments' => 0],
                    'description' => ['number_of_fragments' => 3],
                ],
            ],
        ];

        return $this->elasticsearch->search('products', $searchQuery, $from, $perPage);
    }
}
