<?php

namespace App\Modules\Core\Services;

use App\Modules\Shop\Models\ShopOrder;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExportService
{
    /**
     * Экспорт товаров пользователя
     */
    public function exportProducts(User $user): string
    {
        $products = ShopProduct::query()
            ->where('author_id', $user->id)
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Заголовки
        $sheet->setCellValue('A1', 'Название');
        $sheet->setCellValue('B1', 'Цена');
        $sheet->setCellValue('C1', 'Статус');
        $sheet->setCellValue('D1', 'Продажи');
        $sheet->setCellValue('E1', 'Просмотры');
        $sheet->setCellValue('F1', 'Дата создания');

        // Данные
        $row = 2;
        foreach ($products as $product) {
            $sheet->setCellValue('A' . $row, $product->name);
            $sheet->setCellValue('B' . $row, $product->cost . ' ' . $product->currency);
            $sheet->setCellValue('C' . $row, $product->status);
            $sheet->setCellValue('D' . $row, $product->sales_count);
            $sheet->setCellValue('E' . $row, $product->views_count);
            $sheet->setCellValue('F' . $row, $product->created_at->format('d.m.Y H:i'));
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'products_' . date('Y-m-d_His') . '.xlsx';
        $path = storage_path('app/exports/' . $filename);

        $writer->save($path);

        return $path;
    }

    /**
     * Экспорт заказов пользователя
     */
    public function exportOrders(User $user): string
    {
        $orders = ShopOrder::query()
            ->where('buyer_id', $user->id)
            ->with(['product', 'seller'])
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Заголовки
        $sheet->setCellValue('A1', 'Заказ');
        $sheet->setCellValue('B1', 'Товар');
        $sheet->setCellValue('C1', 'Продавец');
        $sheet->setCellValue('D1', 'Сумма');
        $sheet->setCellValue('E1', 'Статус');
        $sheet->setCellValue('F1', 'Дата');

        // Данные
        $row = 2;
        foreach ($orders as $order) {
            $sheet->setCellValue('A' . $row, '#' . substr($order->id, 0, 8));
            $sheet->setCellValue('B' . $row, $order->product?->name ?? '-');
            $sheet->setCellValue('C' . $row, $order->seller?->name ?? '-');
            $sheet->setCellValue('D' . $row, $order->total . ' ' . $order->currency);
            $sheet->setCellValue('E' . $row, $order->status);
            $sheet->setCellValue('F' . $row, $order->created_at->format('d.m.Y H:i'));
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'orders_' . date('Y-m-d_His') . '.xlsx';
        $path = storage_path('app/exports/' . $filename);

        $writer->save($path);

        return $path;
    }
}
