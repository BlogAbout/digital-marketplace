<?php

namespace App\Modules\Shop\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shop\Models\ShopOrder;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Shop\Requests\CreateOrderRequest;
use App\Modules\Shop\Resources\ShopOrderResource;
use App\Modules\Shop\Services\ShopOrderService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ShopOrderController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly ShopOrderService $orderService
    ) {}

    /**
     * Создать заказ
     */
    public function store(CreateOrderRequest $request): JsonResponse
    {
        $product = ShopProduct::query()->findOrFail($request->input('product_id'));

        // Проверяем, что товар одобрен
        if (!$product->isApproved()) {
            return response()->json([
                'message' => 'Товар недоступен для покупки',
            ], 400);
        }

        // Получаем текущего пользователя
        /** @var \App\Modules\User\Models\User $user */
        $user = $request->user();

        // Проверяем, что пользователь не покупает свой товар
        if ($product->author_id === $user->id) {
            return response()->json([
                'message' => 'Нельзя купить собственный товар',
            ], 400);
        }

        try {
            $order = $this->orderService->createOrder(
                $product,
                $user,
                $request->input('domain'),
                $request->input('promo_code')
            );

            return response()->json([
                'message' => 'Заказ успешно создан',
                'order' => new ShopOrderResource($order),
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Получить заказы текущего пользователя
     */
    public function myOrders(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);
        $type = $request->get('type', 'buyer'); // buyer или seller
        $status = $request->get('status');

        /** @var \App\Modules\User\Models\User $user */
        $user = $request->user();

        $query = ShopOrder::query()
            ->when($type === 'buyer', function ($query) use ($user) {
                return $query->where('buyer_id', $user->id);
            })
            ->when($type === 'seller', function ($query) use ($user) {
                return $query->where('seller_id', $user->id);
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->with(['product', 'buyer', 'seller'])
            ->orderBy('created_at', 'desc');

        $orders = $query->paginate($perPage);

        return ShopOrderResource::collection($orders);
    }

    /**
     * Получить заказ по ID
     */
    public function show(string $id): ShopOrderResource
    {
        $order = ShopOrder::query()
            ->with(['product', 'buyer', 'seller', 'promo'])
            ->findOrFail($id);

        $this->authorize('view', $order);

        return new ShopOrderResource($order);
    }

    /**
     * Оплатить заказ
     */
    public function pay(Request $request, string $id): JsonResponse
    {
        $order = ShopOrder::query()->findOrFail($id);

        $this->authorize('pay', $order);

        try {
            $paymentType = $request->get('payment_type', 'balance');
            $order = $this->orderService->payOrder($order, $paymentType);

            return response()->json([
                'message' => 'Заказ успешно оплачен',
                'order' => new ShopOrderResource($order),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Отменить заказ
     */
    public function cancel(string $id): JsonResponse
    {
        $order = ShopOrder::query()->findOrFail($id);

        $this->authorize('cancel', $order);

        try {
            $order = $this->orderService->cancelOrder($order);

            return response()->json([
                'message' => 'Заказ успешно отменен',
                'order' => new ShopOrderResource($order),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Вернуть средства за заказ
     */
    public function refund(string $id): JsonResponse
    {
        $order = ShopOrder::query()->findOrFail($id);

        $this->authorize('refund', $order);

        try {
            $order = $this->orderService->refundOrder($order);

            return response()->json([
                'message' => 'Средства успешно возвращены',
                'order' => new ShopOrderResource($order),
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Получить ссылку на скачивание
     */
    public function download(string $id): JsonResponse
    {
        $order = ShopOrder::query()->findOrFail($id);

        $this->authorize('download', $order);

        if (!$order->isCompleted()) {
            return response()->json([
                'message' => 'Заказ не завершен',
            ], 400);
        }

        $downloadLink = $order->getDownloadLink();

        if (!$downloadLink) {
            return response()->json([
                'message' => 'Срок скачивания истек',
            ], 410);
        }

        return response()->json([
            'download_link' => $downloadLink,
            'file_expired' => $order->file_expired,
        ]);
    }
}
