<?php

namespace App\Console\Commands;

use App\Modules\Blog\Services\BlogIndexingService;
use App\Modules\Shop\Services\ProductIndexingService;
use App\Modules\User\Services\UserIndexingService;
use Illuminate\Console\Command;

class ReindexSearch extends Command
{
    protected $signature = 'search:reindex {--type=all : Тип индекса (all, products, blogs, users)}';
    protected $description = 'Переиндексация данных для поиска';

    public function handle(
        ProductIndexingService $productIndexing,
        BlogIndexingService $blogIndexing,
        UserIndexingService $userIndexing
    ): int {
        $type = $this->option('type');

        $this->info('Начинаем переиндексацию...');

        if ($type === 'all' || $type === 'products') {
            $count = $productIndexing->reindexAllProducts();
            $this->info("Проиндексировано товаров: {$count}");
        }

        if ($type === 'all' || $type === 'blogs') {
            $count = $blogIndexing->reindexAll();
            $this->info("Проиндексировано блогов и постов: {$count}");
        }

        if ($type === 'all' || $type === 'users') {
            $count = $userIndexing->reindexAllUsers();
            $this->info("Проиндексировано пользователей: {$count}");
        }

        $this->info('Переиндексация завершена!');

        return self::SUCCESS;
    }
}
