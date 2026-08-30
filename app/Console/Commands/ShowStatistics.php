<?php

namespace App\Console\Commands;

use App\Modules\Shop\Models\ShopOrder;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ShowStatistics extends Command
{
    protected $signature = 'statistics:show
        {--type=platform : Тип статистики}
        {--seller-id= : ID продавца}
        {--product-id= : ID товара}
        {--days=7 : Количество дней}';

    protected $description = 'Показать статистику';

    public function handle(): int
    {
        $typeOption = $this->option('type');
        $type = is_string($typeOption) ? $typeOption : 'platform';

        $daysOption = $this->option('days');
        $days = is_numeric($daysOption) ? (int) $daysOption : 7;

        $from = Carbon::now()->subDays($days);

        switch ($type) {
            case 'platform':
                $this->showPlatformStatistics($from);
                break;

            case 'seller':
                $sellerIdOption = $this->option('seller-id');
                if (!is_string($sellerIdOption) || $sellerIdOption === '') {
                    $this->error('Укажите --seller-id');
                    return self::FAILURE;
                }
                $this->showSellerStatistics($sellerIdOption, $from);
                break;

            case 'product':
                $productIdOption = $this->option('product-id');
                if (!is_string($productIdOption) || $productIdOption === '') {
                    $this->error('Укажите --product-id');
                    return self::FAILURE;
                }
                $this->showProductStatistics($productIdOption, $from);
                break;
        }

        return self::SUCCESS;
    }

    protected function showPlatformStatistics(Carbon $from): void
    {
        $totalRevenue = ShopOrder::query()
            ->whereIn('status', ['completed', 'paid'])
            ->where('created_at', '>=', $from)
            ->sum('total');

        $totalOrders = ShopOrder::query()
            ->whereIn('status', ['completed', 'paid'])
            ->where('created_at', '>=', $from)
            ->count();

        $newUsers = User::query()
            ->where('created_at', '>=', $from)
            ->count();

        $newProducts = ShopProduct::query()
            ->where('created_at', '>=', $from)
            ->count();

        $this->table(
            ['Метрика', 'Значение'],
            [
                ['Общий доход', number_format($totalRevenue, 2) . ' USD'],
                ['Всего заказов', $totalOrders],
                ['Новые пользователи', $newUsers],
                ['Новые товары', $newProducts],
                ['Средний чек', $totalOrders > 0 ? number_format($totalRevenue / $totalOrders, 2) . ' USD' : '0 USD'],
            ]
        );
    }

    protected function showSellerStatistics(string $sellerId, Carbon $from): void
    {
        $seller = User::query()->find($sellerId);

        if (!$seller) {
            $this->error('Продавец не найден');
            return;
        }

        $totalRevenue = ShopOrder::query()
            ->where('seller_id', $sellerId)
            ->whereIn('status', ['completed', 'paid'])
            ->where('created_at', '>=', $from)
            ->sum('total');

        $totalSales = ShopOrder::query()
            ->where('seller_id', $sellerId)
            ->whereIn('status', ['completed', 'paid'])
            ->where('created_at', '>=', $from)
            ->count();

        $this->table(
            ['Метрика', 'Значение'],
            [
                ['Продавец', $seller->name],
                ['Общий доход', number_format($totalRevenue, 2) . ' USD'],
                ['Всего продаж', $totalSales],
                ['Средний чек', $totalSales > 0 ? number_format($totalRevenue / $totalSales, 2) . ' USD' : '0 USD'],
            ]
        );
    }

    protected function showProductStatistics(string $productId, Carbon $from): void
    {
        $product = ShopProduct::query()->find($productId);

        if (!$product) {
            $this->error('Товар не найден');
            return;
        }

        $totalSales = ShopOrder::query()
            ->where('product_id', $productId)
            ->whereIn('status', ['completed', 'paid'])
            ->where('created_at', '>=', $from)
            ->count();

        $totalRevenue = ShopOrder::query()
            ->where('product_id', $productId)
            ->whereIn('status', ['completed', 'paid'])
            ->where('created_at', '>=', $from)
            ->sum('total');

        $this->table(
            ['Метрика', 'Значение'],
            [
                ['Товар', $product->name],
                ['Просмотры', $product->views_count],
                ['Продажи', $totalSales],
                ['Доход', number_format($totalRevenue, 2) . ' USD'],
            ]
        );
    }
}
