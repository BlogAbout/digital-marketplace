<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearStatisticsCache extends Command
{
    protected $signature = 'statistics:clear-cache
        {--type=all : Тип кэша (all, products, users, platform)}';

    protected $description = 'Очистка кэша статистики';

    public function handle(): int
    {
        $type = $this->option('type');

        $patterns = [];

        if ($type === 'all' || $type === 'products') {
            $patterns[] = 'product:statistics:*';
            $patterns[] = 'shop:product:*';
        }

        if ($type === 'all' || $type === 'users') {
            $patterns[] = 'seller:statistics:*';
        }

        if ($type === 'all' || $type === 'platform') {
            $patterns[] = 'platform:statistics:*';
        }

        $totalDeleted = 0;

        foreach ($patterns as $pattern) {
            $count = $this->clearCacheByPattern($pattern);
            $totalDeleted += $count;
            $this->info("Очищено ключей по паттерну {$pattern}: {$count}");
        }

        $this->info("Всего очищено ключей: {$totalDeleted}");

        return self::SUCCESS;
    }

    /**
     * Очистка кэша по паттерну
     */
    protected function clearCacheByPattern(string $pattern): int
    {
        try {
            $redis = Cache::getRedis();
            $keys = $redis->keys($pattern);

            foreach ($keys as $key) {
                $redis->del($key);
            }

            return count($keys);
        } catch (\Exception $e) {
            $this->error("Ошибка при очистке кэша: {$e->getMessage()}");
            return 0;
        }
    }
}
