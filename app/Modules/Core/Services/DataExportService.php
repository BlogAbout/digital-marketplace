<?php

namespace App\Modules\Core\Services;

use App\Modules\Shop\Models\ShopOrder;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DataExportService
{
    /**
     * Экспорт товаров в CSV
     */
    public function exportProductsCSV(User $user): StreamedResponse
    {
        $filename = 'products_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($user) {
            $file = fopen('php://output', 'w');

            if ($file === false) {
                return;
            }

            fputcsv($file, ['Название', 'Цена', 'Статус', 'Продажи', 'Просмотры', 'Дата создания']);

            ShopProduct::query()
                ->where('author_id', $user->id)
                ->chunk(100, function ($products) use ($file) {
                    foreach ($products as $product) {
                        fputcsv($file, [
                            $product->name,
                            $product->cost . ' ' . $product->currency,
                            $product->status,
                            $product->sales_count,
                            $product->views_count,
                            $product->created_at->format('d.m.Y H:i'),
                        ]);
                    }
                });

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Экспорт заказов в CSV
     */
    public function exportOrdersCSV(User $user): StreamedResponse
    {
        $filename = 'orders_' . date('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($user) {
            $file = fopen('php://output', 'w');

            if ($file === false) {
                return;
            }

            // Заголовки
            fputcsv($file, ['Заказ', 'Товар', 'Продавец', 'Сумма', 'Статус', 'Дата']);

            // Данные
            ShopOrder::query()
                ->where('buyer_id', $user->id)
                ->with(['product', 'seller'])
                ->chunk(100, function ($orders) use ($file) {
                    foreach ($orders as $order) {
                        fputcsv($file, [
                            '#' . substr($order->id, 0, 8),
                            $order->product?->name ?? '-',
                            $order->seller?->name ?? '-',
                            $order->total . ' ' . $order->currency,
                            $order->status,
                            $order->created_at->format('d.m.Y H:i'),
                        ]);
                    }
                });

            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }
}
