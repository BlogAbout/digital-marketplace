<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\Requests\DepositRequest;
use App\Modules\User\Requests\WithdrawRequest;
use App\Modules\User\Resources\UserTransactionResource;
use App\Modules\User\Services\BalanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BalanceController extends Controller
{
    public function __construct(
        private readonly BalanceService $balanceService
    ) {}

    /**
     * Получить текущий баланс
     */
    public function getBalance(Request $request): JsonResponse
    {
        $user = $request->user();
        $currency = $request->get('currency', 'USD');

        $balance = $this->balanceService->getBalance($user);
        $balanceInCurrency = $this->balanceService->getBalanceInCurrency($user, $currency);

        return response()->json([
            'balance' => $balance,
            'currency' => $user->getSetting('currency', 'USD'),
            'converted' => [
                'amount' => $balanceInCurrency,
                'currency' => $currency,
            ],
        ]);
    }

    /**
     * Пополнить баланс
     */
    public function deposit(DepositRequest $request): JsonResponse
    {
        $transaction = $this->balanceService->deposit(
            $request->user(),
            $request->input('amount'),
            $request->input('currency', 'USD'),
            $request->input('description')
        );

        return response()->json([
            'message' => 'Баланс успешно пополнен',
            'transaction' => new UserTransactionResource($transaction),
            'balance' => $request->user()->balance,
        ], 201);
    }

    /**
     * Вывести средства
     */
    public function withdraw(WithdrawRequest $request): JsonResponse
    {
        try {
            $transaction = $this->balanceService->withdraw(
                $request->user(),
                $request->input('amount'),
                $request->input('currency', 'USD'),
                $request->input('description')
            );

            return response()->json([
                'message' => 'Средства успешно выведены',
                'transaction' => new UserTransactionResource($transaction),
                'balance' => $request->user()->balance,
            ], 201);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Получить историю транзакций
     */
    public function transactions(Request $request): AnonymousResourceCollection
    {
        $perPage = (int) $request->get('per_page', 15);
        $type = $request->get('type');
        $status = $request->get('status');

        $transactions = $request->user()->transactions()
            ->when($type, function ($query) use ($type) {
                return $query->where('type', $type);
            })
            ->when($status, function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return UserTransactionResource::collection($transactions);
    }
}
