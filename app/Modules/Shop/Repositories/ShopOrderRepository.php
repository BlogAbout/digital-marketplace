<?php

namespace App\Modules\Shop\Repositories;

use App\Modules\Core\BaseRepository;
use App\Modules\Shop\Models\ShopOrder;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<ShopOrder>
 */
class ShopOrderRepository extends BaseRepository
{
    /**
     * @return class-string<ShopOrder>
     */
    protected function getModelClass(): string
    {
        return ShopOrder::class;
    }

    /**
     * Получить заказы покупателя
     *
     * @return LengthAwarePaginator<int, ShopOrder>
     */
    public function getBuyerOrders(string $buyerId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopOrder> $orders */
        $orders = $this->query()
            ->where('buyer_id', $buyerId)
            ->with(['product', 'seller'])
            ->paginate($perPage);

        return $orders;
    }

    /**
     * Получить заказы продавца
     *
     * @return LengthAwarePaginator<int, ShopOrder>
     */
    public function getSellerOrders(string $sellerId, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopOrder> $orders */
        $orders = $this->query()
            ->where('seller_id', $sellerId)
            ->with(['product', 'buyer'])
            ->paginate($perPage);

        return $orders;
    }

    /**
     * Получить заказы по статусу
     *
     * @return LengthAwarePaginator<int, ShopOrder>
     */
    public function getOrdersByStatus(string $status, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, ShopOrder> $orders */
        $orders = $this->query()
            ->where('status', $status)
            ->with(['product', 'buyer', 'seller'])
            ->paginate($perPage);

        return $orders;
    }
}
