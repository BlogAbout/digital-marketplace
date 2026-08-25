<?php

namespace App\Console\Commands;

use App\Modules\Shop\Models\ShopOrder;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class AggregateStatistics extends Command
{
    protected $signature = 'statistics:aggregate {--date= : Дата для агрегации (Y-m-d)}';
    protected $description = 'Агрегация ежедневной статистики';

    public function handle(): int
    {
        $date = $this->option('date')
            ? Carbon::parse($this->option('date'))
            : Carbon::yesterday();

        $this->info("Агрегация статистики за {$date->toDateString()}");

        // Агрегация по товарам
        $productStats = ShopOrder::query()
            ->whereIn('status', ['completed', 'paid'])
            ->whereDate('created_at', $date)
            ->select(
                'product_id',
                DB::raw('COUNT(*) as sales_count'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('product_id')
            ->get();

        foreach ($productStats as $stat) {
            $productStatistic = \App\Modules\Statistics\Models\ProductStatistic::query()
                ->firstOrNew([
                    'product_id' => $stat->product_id,
                    'date' => $date->toDateString(),
                ]);

            $productStatistic->sales_count = $stat->sales_count;
            $productStatistic->revenue = $stat->revenue;
            $productStatistic->save();
        }

        // Агрегация по продавцам
        $sellerStats = ShopOrder::query()
            ->whereIn('status', ['completed', 'paid'])
            ->whereDate('created_at', $date)
            ->select(
                'seller_id',
                DB::raw('COUNT(*) as sales_count'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('seller_id')
            ->get();

        foreach ($sellerStats as $stat) {
            $userStatistic = \App\Modules\Statistics\Models\UserStatistic::query()
                ->firstOrNew([
                    'user_id' => $stat->seller_id,
                    'date' => $date->toDateString(),
                ]);

            $userStatistic->sales_count = $stat->sales_count;
            $userStatistic->revenue = $stat->revenue;
            $userStatistic->save();
        }

        $this->info('Агрегация завершена!');

        return self::SUCCESS;
    }
}
