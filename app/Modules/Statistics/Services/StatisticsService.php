<?php

namespace App\Modules\Statistics\Services;

use App\Modules\Shop\Models\ShopOrder;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Statistics\Models\ProductStatistic;
use App\Modules\Statistics\Models\UserStatistic;
use App\Modules\User\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class StatisticsService
{
    /**
     * Время кэширования статистики (в секундах)
     */
    private const CACHE_TTL = 3600; // 1 час

    /**
     * Получить статистику продавца
     *
     * @return array<string, mixed>
     */
    public function getSellerStatistics(User $user, ?Carbon $from = null, ?Carbon $to = null): array
    {
        $from = $from ?? Carbon::now()->subDays(30);
        $to = $to ?? Carbon::now();

        $cacheKey = "seller:statistics:{$user->id}:{$from->toDateString()}:{$to->toDateString()}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($user, $from, $to) {
            // Общая статистика
            $totalRevenue = ShopOrder::query()
                ->where('seller_id', $user->id)
                ->whereIn('status', ['completed', 'paid'])
                ->whereBetween('created_at', [$from, $to])
                ->sum('total');

            $totalSales = ShopOrder::query()
                ->where('seller_id', $user->id)
                ->whereIn('status', ['completed', 'paid'])
                ->whereBetween('created_at', [$from, $to])
                ->count();

            $totalViews = ProductStatistic::query()
                ->whereHas('product', function ($query) use ($user) {
                    $query->where('author_id', $user->id);
                })
                ->whereBetween('date', [$from->toDateString(), $to->toDateString()])
                ->sum('views_count');

            // Статистика по дням
            $dailyRevenue = ShopOrder::query()
                ->where('seller_id', $user->id)
                ->whereIn('status', ['completed', 'paid'])
                ->whereBetween('created_at', [$from, $to])
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(total) as revenue'),
                    DB::raw('COUNT(*) as sales')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Статистика по товарам
            $topProducts = ShopProduct::query()
                ->where('author_id', $user->id)
                ->withCount(['orders' => function ($query) use ($from, $to) {
                    $query->whereIn('status', ['completed', 'paid'])
                        ->whereBetween('created_at', [$from, $to]);
                }])
                ->withSum(['orders' => function ($query) use ($from, $to) {
                    $query->whereIn('status', ['completed', 'paid'])
                        ->whereBetween('created_at', [$from, $to]);
                }], 'total')
                ->orderByDesc('orders_count')
                ->limit(10)
                ->get();

            // Конверсия
            $conversionRate = $totalViews > 0
                ? round(($totalSales / $totalViews) * 100, 2)
                : 0;

            return [
                'total_revenue' => (float) $totalRevenue,
                'total_sales' => $totalSales,
                'total_views' => (int) $totalViews,
                'conversion_rate' => $conversionRate,
                'average_check' => $totalSales > 0 ? round($totalRevenue / $totalSales, 2) : 0,
                'daily_statistics' => $dailyRevenue,
                'top_products' => $topProducts,
                'generated_at' => Carbon::now()->toISOString(),
            ];
        });
    }

    /**
     * Получить статистику товара
     *
     * @return array<string, mixed>
     */
    public function getProductStatistics(ShopProduct $product, ?Carbon $from = null, ?Carbon $to = null): array
    {
        $from = $from ?? Carbon::now()->subDays(30);
        $to = $to ?? Carbon::now();

        $cacheKey = "product:statistics:{$product->id}:{$from->toDateString()}:{$to->toDateString()}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($product, $from, $to) {
            $statistics = ProductStatistic::query()
                ->where('product_id', $product->id)
                ->whereBetween('date', [$from->toDateString(), $to->toDateString()])
                ->orderBy('date')
                ->get();

            $dailyViews = $statistics->map(function ($stat) {
                return [
                    'date' => $stat->date->format('Y-m-d'),
                    'views' => $stat->views_count,
                    'unique_views' => $stat->unique_views_count,
                    'sales' => $stat->sales_count,
                    'revenue' => $stat->revenue,
                    'conversion_rate' => $stat->conversion_rate,
                ];
            });

            $totalViews = $statistics->sum('views_count');
            $totalSales = $statistics->sum('sales_count');
            $totalRevenue = $statistics->sum('revenue');

            return [
                'total_views' => (int) $totalViews,
                'total_sales' => (int) $totalSales,
                'total_revenue' => (float) $totalRevenue,
                'conversion_rate' => $totalViews > 0
                    ? round(($totalSales / $totalViews) * 100, 2)
                    : 0,
                'daily_statistics' => $dailyViews,
                'generated_at' => Carbon::now()->toISOString(),
            ];
        });
    }

    /**
     * Получить общую статистику платформы
     *
     * @return array<string, mixed>
     */
    public function getPlatformStatistics(?Carbon $from = null, ?Carbon $to = null): array
    {
        $from = $from ?? Carbon::now()->subDays(30);
        $to = $to ?? Carbon::now();

        $cacheKey = "platform:statistics:{$from->toDateString()}:{$to->toDateString()}";

        return Cache::remember($cacheKey, self::CACHE_TTL, function () use ($from, $to) {
            $totalRevenue = ShopOrder::query()
                ->whereIn('status', ['completed', 'paid'])
                ->whereBetween('created_at', [$from, $to])
                ->sum('total');

            $totalOrders = ShopOrder::query()
                ->whereIn('status', ['completed', 'paid'])
                ->whereBetween('created_at', [$from, $to])
                ->count();

            $totalUsers = User::query()
                ->whereBetween('created_at', [$from, $to])
                ->count();

            $totalProducts = ShopProduct::query()
                ->where('status', 'approved')
                ->whereBetween('created_at', [$from, $to])
                ->count();

            return [
                'total_revenue' => (float) $totalRevenue,
                'total_orders' => $totalOrders,
                'new_users' => $totalUsers,
                'new_products' => $totalProducts,
                'average_order_value' => $totalOrders > 0
                    ? round($totalRevenue / $totalOrders, 2)
                    : 0,
                'generated_at' => Carbon::now()->toISOString(),
            ];
        });
    }

    /**
     * Обновить статистику просмотров
     */
    public function trackView(ShopProduct $product): void
    {
        $today = Carbon::now()->toDateString();

        $statistic = ProductStatistic::query()
            ->firstOrNew([
                'product_id' => $product->id,
                'date' => $today,
            ]);

        $statistic->views_count = ($statistic->views_count ?? 0) + 1;
        $statistic->save();

        // Обновляем счетчик в товаре
        $product->increment('views_count');

        // Очищаем кэш статистики
        $this->clearProductCache($product->id);
    }

    /**
     * Обновить статистику продаж
     */
    public function trackSale(ShopOrder $order): void
    {
        $today = Carbon::now()->toDateString();

        $statistic = ProductStatistic::query()
            ->firstOrNew([
                'product_id' => $order->product_id,
                'date' => $today,
            ]);

        $statistic->sales_count = ($statistic->sales_count ?? 0) + 1;
        $statistic->revenue = ($statistic->revenue ?? 0) + $order->total;
        $statistic->conversion_rate = $statistic->views_count > 0
            ? round(($statistic->sales_count / $statistic->views_count) * 100, 2)
            : 0;
        $statistic->save();

        // Очищаем кэш статистики
        $this->clearProductCache($order->product_id);
        $this->clearSellerCache($order->seller_id);
    }

    /**
     * Очистить кэш товара
     */
    protected function clearProductCache(string $productId): void
    {
        $keys = [
            "product:statistics:{$productId}:*",
            "shop:product:{$productId}",
        ];

        foreach ($keys as $pattern) {
            $this->clearCacheByPattern($pattern);
        }
    }

    /**
     * Очистить кэш продавца
     */
    protected function clearSellerCache(string $sellerId): void
    {
        $this->clearCacheByPattern("seller:statistics:{$sellerId}:*");
    }

    /**
     * Очистка кэша по паттерну
     */
    protected function clearCacheByPattern(string $pattern): void
    {
        try {
            $redis = Cache::getRedis();
            $keys = $redis->keys($pattern);

            foreach ($keys as $key) {
                $redis->del($key);
            }
        } catch (\Exception $e) {
            // Если Redis недоступен, просто пропускаем
        }
    }
}
