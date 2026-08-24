<?php

namespace App\Modules\Shop\Services;

use App\Modules\Core\BaseService;
use App\Modules\Core\Services\FileService;
use App\Modules\Shop\Models\ShopOrder;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Shop\Models\ShopPromo;
use App\Modules\Shop\Repositories\ShopOrderRepository;
use App\Modules\User\Models\User;
use App\Modules\User\Services\BalanceService;
use Illuminate\Support\Facades\DB;

/**
 * @extends BaseService<ShopOrderRepository>
 */
class ShopOrderService extends BaseService
{
    public function __construct(
        private readonly BalanceService $balanceService,
        private readonly FileService $fileService
    ) {
        parent::__construct();
    }

    /**
     * @return class-string<ShopOrderRepository>
     */
    protected function getRepositoryClass(): string
    {
        return ShopOrderRepository::class;
    }

    /**
     * Создать заказ
     */
    public function createOrder(
        ShopProduct $product,
        User $buyer,
        ?string $domain = null,
        ?string $promoCode = null
    ): ShopOrder {
        return DB::transaction(function () use ($product, $buyer, $domain, $promoCode) {
            $promo = null;
            $discount = 0;

            // Проверяем промокод
            if ($promoCode) {
                $promo = $this->validatePromo($promoCode, $product);
                if ($promo) {
                    $discount = $promo->calculateDiscount((float) $product->cost);
                }
            }

            $total = (float) $product->cost - $discount;
            $tax = $total * 0.2; // Налог 20% (пример)
            $sum = $total + $tax;

            /** @var ShopOrder $order */
            $order = $this->repository->create([
                'product_id' => $product->id,
                'seller_id' => $product->author_id,
                'buyer_id' => $buyer->id,
                'currency' => $product->currency,
                'is_free' => $product->is_free,
                'cost' => $product->cost,
                'tax' => $tax,
                'discount' => $discount,
                'sum' => $sum,
                'total' => $sum,
                'status' => $product->is_free ? 'completed' : 'pending',
                'domain' => $domain,
                'promo_id' => $promo ? $promo->id : null,
            ]);

            // Если товар бесплатный, сразу завершаем заказ
            if ($product->is_free) {
                $this->completeOrder($order);
            }

            return $order;
        });
    }

    /**
     * Оплатить заказ
     */
    public function payOrder(ShopOrder $order, string $paymentType = 'balance'): ShopOrder
    {
        return DB::transaction(function () use ($order, $paymentType) {
            if ($order->isPaid()) {
                throw new \InvalidArgumentException('Заказ уже оплачен');
            }

            $buyer = $order->buyer;

            // Списываем средства с баланса
            if ($paymentType === 'balance') {
                $this->balanceService->withdraw(
                    $buyer,
                    (float) $order->total,
                    $order->currency,
                    "Оплата заказа #{$order->id}"
                );
            }

            $order->update([
                'status' => 'paid',
                'payment_type' => $paymentType,
                'paid_at' => now(),
            ]);

            return $this->completeOrder($order);
        });
    }

    /**
     * Завершить заказ
     */
    public function completeOrder(ShopOrder $order): ShopOrder
    {
        return DB::transaction(function () use ($order) {
            $product = $order->product;

            // Клонируем файл для скачивания
            $fileLink = $this->generateDownloadLink($product);

            $order->update([
                'status' => 'completed',
                'file_link' => $fileLink,
                'file_expired' => $this->calculateFileExpiry($product),
                'notify_status' => 'pending',
            ]);

            // Начисляем средства продавцу
            if (! $product->is_free) {
                $this->balanceService->creditFromSale(
                    $order->seller,
                    (float) $order->cost,
                    $order->currency,
                    $order->id,
                    ShopOrder::class
                );
            }

            // Увеличиваем счетчик продаж
            $product->incrementSales();

            // Увеличиваем счетчик использования промокода
            if ($order->promo) {
                $order->promo->incrementUsage();
            }

            // Отправляем webhook если нужно
            if ($product->requiresDomain() && $order->domain) {
                $this->sendDomainWebhook($order);
            }

            return $order;
        });
    }

    /**
     * Отменить заказ
     */
    public function cancelOrder(ShopOrder $order): ShopOrder
    {
        if ($order->isCompleted()) {
            throw new \InvalidArgumentException('Нельзя отменить завершенный заказ');
        }

        $order->update(['status' => 'cancelled']);

        return $order;
    }

    /**
     * Вернуть средства за заказ
     */
    public function refundOrder(ShopOrder $order): ShopOrder
    {
        if (! $order->isCompleted()) {
            throw new \InvalidArgumentException('Можно вернуть только завершенный заказ');
        }

        return DB::transaction(function () use ($order) {
            // Возвращаем средства покупателю
            $this->balanceService->deposit(
                $order->buyer,
                (float) $order->total,
                $order->currency,
                "Возврат за заказ #{$order->id}"
            );

            $order->update(['status' => 'refunded']);

            return $order;
        });
    }

    /**
     * Сгенерировать ссылку на скачивание
     */
    protected function generateDownloadLink(ShopProduct $product): string
    {
        if (! $product->file) {
            return '';
        }

        $clonedFile = $this->fileService->cloneFileForDownload(
            $product->file,
            "downloads/{$product->id}"
        );

        return $clonedFile->getUrl();
    }

    /**
     * Рассчитать срок действия файла
     *
     * @return \DateTimeInterface|null
     */
    protected function calculateFileExpiry(ShopProduct $product): ?\DateTimeInterface
    {
        if ($product->is_infinity_download) {
            return null;
        }

        /** @var \DateTimeInterface $expiry */
        $expiry = now()->addDays($product->file_days_expired);

        return $expiry;
    }

    /**
     * Отправить webhook для привязки домена
     */
    protected function sendDomainWebhook(ShopOrder $order): void
    {
        $product = $order->product;
        $apiKey = $product->apiKey;

        if (! $apiKey || ! $apiKey->isActive()) {
            return;
        }

        $data = [
            'event' => 'purchase',
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
            ],
            'buyer' => [
                'id' => $order->buyer_id,
                'email' => $order->buyer->email,
                'domain' => $order->domain,
            ],
            'order' => [
                'id' => $order->id,
                'created_at' => $order->created_at,
            ],
        ];

        $apiKey->sendWebhook($data);
    }

    /**
     * Валидация промокода
     */
    protected function validatePromo(string $code, ShopProduct $product): ?ShopPromo
    {
        /** @var ShopPromo|null $promo */
        $promo = ShopPromo::query()
            ->where('code', $code)
            ->where('product_id', $product->id)
            ->first();

        if ($promo && $promo->isValid()) {
            return $promo;
        }

        return null;
    }
}
