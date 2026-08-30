<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class ClearStatisticsCache extends Command
{
    protected $signature = 'statistics:clear-cache {--type=all : Тип кэша (all, products, users, platform)}';
    protected $description = 'Очистка кэша статистики';

    public function handle(): int
    {
        $typeOption = $this->option('type');
        $type = is_string($typeOption) ? $typeOption : 'all';

        $patterns = [];

        if ($type === 'all' || $type === 'products') {
            $patterns[] = 'product:statistics:*';
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

    protected function clearCacheByPattern(string $pattern): int
    {
        try {
            /** @var \Illuminate\Redis\Connections\Connection $redis */
            $redis = Redis::connection();

            /** @var array<int, string> $keys */
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
