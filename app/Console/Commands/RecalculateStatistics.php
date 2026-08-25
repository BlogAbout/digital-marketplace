<?php

namespace App\Console\Commands;

use App\Modules\Shop\Models\ShopOrder;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Statistics\Models\ProductStatistic;
use App\Modules\Statistics\Models\UserStatistic;
use App\Modules\User\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class RecalculateStatistics extends Command
{
    protected $signature = 'statistics:recalculate
        {--from= : Начальная дата (Y-m-d)}
        {--to= : Конечная дата (Y-m-d)}
        {--type=all : Тип пересчета (all, products, users, views)}
        {--chunk=100 : Размер чанка для обработки}';

    protected $description = 'Пересчет статистики за период';

    public function handle(): int
    {
        $from = $this->option('from')
            ? Carbon::parse($this->option('from'))->startOfDay()
            : Carbon::now()->subDays(30)->startOfDay();

        $to = $this->option('to')
            ? Carbon::parse($this->option('to'))->endOfDay()
            : Carbon::now()->endOfDay();

        $type = $this->option('type');
        $chunkSize = (int) $this->option('chunk');

        $this->info("Пересчет статистики с {$from->toDateString()} по {$to->toDateString()}");
        $this->info("Тип: {$type}");

        if ($type === 'all' || $type === 'products') {
            $this->recalculateProductStatistics($from, $to, $chunkSize);
        }

        if ($type === 'all' || $type === 'users') {
            $this->recalculateUserStatistics($from, $to, $chunkSize);
        }

        if ($type === 'all' || $type === 'views') {
            $this->recalculateViewStatistics($chunkSize);
        }

        // Очищаем кэш статистики
        $this->clearStatisticsCache();

        $this->info('Пересчет завершен!');

        return self::SUCCESS;
    }

    /**
     * Пересчет статистики по товарам
     */
    protected function recalculateProductStatistics(Carbon $from, Carbon $to, int $chunkSize): void
    {
        $this->info('Пересчет статистики товаров...');

        $productStats = ShopOrder::query()
            ->whereIn('status', ['completed', 'paid'])
            ->whereBetween('created_at', [$from, $to])
            ->select(
                'product_id',
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as sales_count'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('product_id', 'date')
            ->orderBy('date')
            ->get();

        $bar = $this->output->createProgressBar($productStats->count());
        $bar->start();

        foreach ($productStats as $stat) {
            $productStatistic = ProductStatistic::query()
                ->firstOrNew([
                    'product_id' => $stat->product_id,
                    'date' => $stat->date,
                ]);

            $productStatistic->sales_count = $stat->sales_count;
            $productStatistic->revenue = $stat->revenue;

            // Пересчитываем конверсию
            if ($productStatistic->views_count > 0) {
                $productStatistic->conversion_rate = round(
                    ($stat->sales_count / $productStatistic->views_count) * 100,
                    2
                );
            }

            $productStatistic->save();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Пересчитано товаров: {$productStats->count()}");
    }

    /**
     * Пересчет статистики по пользователям
     */
    protected function recalculateUserStatistics(Carbon $from, Carbon $to, int $chunkSize): void
    {
        $this->info('Пересчет статистики пользователей...');

        $userStats = ShopOrder::query()
            ->whereIn('status', ['completed', 'paid'])
            ->whereBetween('created_at', [$from, $to])
            ->select(
                'seller_id',
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as sales_count'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('seller_id', 'date')
            ->orderBy('date')
            ->get();

        $bar = $this->output->createProgressBar($userStats->count());
        $bar->start();

        foreach ($userStats as $stat) {
            $userStatistic = UserStatistic::query()
                ->firstOrNew([
                    'user_id' => $stat->seller_id,
                    'date' => $stat->date,
                ]);

            $userStatistic->sales_count = $stat->sales_count;
            $userStatistic->revenue = $stat->revenue;
            $userStatistic->save();

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Пересчитано пользователей: {$userStats->count()}");
    }

    /**
     * Пересчет статистики просмотров
     */
    protected function recalculateViewStatistics(int $chunkSize): void
    {
        $this->info('Пересчет просмотров товаров...');

        $count = 0;

        ShopProduct::query()
            ->select('id', 'views_count')
            ->chunk($chunkSize, function ($products) use (&$count) {
                foreach ($products as $product) {
                    // Обновляем общий счетчик в товаре
                    $product->update([
                        'views_count' => $product->views_count,
                    ]);

                    // Очищаем кэш товара
                    Cache::forget("shop:product:{$product->id}");

                    $count++;
                }
            });

        $this->info("Обновлено товаров: {$count}");
    }

    /**
     * Очистка кэша статистики
     */
    protected function clearStatisticsCache(): void
    {
        $this->info('Очистка кэша статистики...');

        // Очищаем все ключи статистики
        $keys = [
            'statistics:*',
            'seller:statistics:*',
            'product:statistics:*',
            'platform:statistics:*',
        ];

        foreach ($keys as $pattern) {
            $this->clearCacheByPattern($pattern);
        }

        $this->info('Кэш очищен');
    }

    /**
     * Очистка кэша по паттерну
     */
    protected function clearCacheByPattern(string $pattern): void
    {
        $redis = Cache::getRedis();
        $keys = $redis->keys($pattern);

        foreach ($keys as $key) {
            $redis->del($key);
        }
    }
}
