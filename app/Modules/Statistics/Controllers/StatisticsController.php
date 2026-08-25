<?php

namespace App\Modules\Statistics\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\Statistics\Services\StatisticsService;
use App\Modules\User\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatisticsController extends Controller
{
    public function __construct(
        private readonly StatisticsService $statisticsService
    ) {}

    /**
     * Получить статистику продавца
     */
    public function sellerStatistics(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $from = $request->get('from') ? Carbon::parse($request->get('from')) : null;
        $to = $request->get('to') ? Carbon::parse($request->get('to')) : null;

        $statistics = $this->statisticsService->getSellerStatistics($user, $from, $to);

        return response()->json($statistics);
    }

    /**
     * Получить статистику товара
     */
    public function productStatistics(Request $request, string $productId): JsonResponse
    {
        $product = ShopProduct::query()->findOrFail($productId);

        /** @var User $user */
        $user = $request->user();

        // Проверяем, что пользователь является автором товара или админом
        if ($product->author_id !== $user->id && !$user->hasRole('admin')) {
            return response()->json([
                'message' => 'Доступ запрещен',
            ], 403);
        }

        $from = $request->get('from') ? Carbon::parse($request->get('from')) : null;
        $to = $request->get('to') ? Carbon::parse($request->get('to')) : null;

        $statistics = $this->statisticsService->getProductStatistics($product, $from, $to);

        return response()->json($statistics);
    }

    /**
     * Получить общую статистику платформы (для админов)
     */
    public function platformStatistics(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (!$user->hasRole('admin')) {
            return response()->json([
                'message' => 'Доступ запрещен',
            ], 403);
        }

        $from = $request->get('from') ? Carbon::parse($request->get('from')) : null;
        $to = $request->get('to') ? Carbon::parse($request->get('to')) : null;

        $statistics = $this->statisticsService->getPlatformStatistics($from, $to);

        return response()->json($statistics);
    }
}
