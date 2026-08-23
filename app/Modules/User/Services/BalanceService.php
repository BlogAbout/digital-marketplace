<?php

namespace App\Modules\User\Services;

use App\Modules\Currency\Services\CurrencyService;
use App\Modules\User\Models\User;
use App\Modules\User\Models\UserTransaction;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class BalanceService
{
    public function __construct(
        private readonly CurrencyService $currencyService
    ) {}

    /**
     * Получить баланс пользователя
     */
    public function getBalance(User $user): float
    {
        return (float) $user->balance;
    }

    /**
     * Получить баланс в определенной валюте
     */
    public function getBalanceInCurrency(User $user, string $currencyCode): float
    {
        $userCurrency = $user->getSetting('currency', 'USD');
        $balance = $this->getBalance($user);

        return $this->currencyService->convert($balance, $userCurrency, $currencyCode);
    }

    /**
     * Пополнить баланс
     */
    public function deposit(User $user, float $amount, string $currency = 'USD', ?string $description = null): UserTransaction
    {
        return DB::transaction(function () use ($user, $amount, $currency, $description) {
            $balanceBefore = $this->getBalance($user);

            // Конвертируем в валюту пользователя
            $userCurrency = $user->getSetting('currency', 'USD');
            $convertedAmount = $currency === $userCurrency
                ? $amount
                : $this->currencyService->convert($amount, $currency, $userCurrency);

            $balanceAfter = $balanceBefore + $convertedAmount;

            $user->update(['balance' => $balanceAfter]);

            $transaction = UserTransaction::query()->create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'amount' => $amount,
                'currency' => $currency,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => $description ?? 'Пополнение баланса',
                'status' => 'completed',
            ]);

            $this->clearBalanceCache($user);

            return $transaction;
        });
    }

    /**
     * Списать средства с баланса
     */
    public function withdraw(User $user, float $amount, string $currency = 'USD', ?string $description = null): UserTransaction
    {
        return DB::transaction(function () use ($user, $amount, $currency, $description) {
            $balanceBefore = $this->getBalance($user);

            // Конвертируем в валюту пользователя
            $userCurrency = $user->getSetting('currency', 'USD');
            $convertedAmount = $currency === $userCurrency
                ? $amount
                : $this->currencyService->convert($amount, $currency, $userCurrency);

            if ($balanceBefore < $convertedAmount) {
                throw new \InvalidArgumentException('Недостаточно средств на балансе');
            }

            $balanceAfter = $balanceBefore - $convertedAmount;

            $user->update(['balance' => $balanceAfter]);

            $transaction = UserTransaction::query()->create([
                'user_id' => $user->id,
                'type' => 'withdrawal',
                'amount' => $amount,
                'currency' => $currency,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'description' => $description ?? 'Списание средств',
                'status' => 'completed',
            ]);

            $this->clearBalanceCache($user);

            return $transaction;
        });
    }

    /**
     * Зачислить средства от продажи
     */
    public function creditFromSale(User $user, float $amount, string $currency, string $relatedId, string $relatedType): UserTransaction
    {
        return DB::transaction(function () use ($user, $amount, $currency, $relatedId, $relatedType) {
            $balanceBefore = $this->getBalance($user);

            // Конвертируем в валюту пользователя
            $userCurrency = $user->getSetting('currency', 'USD');
            $convertedAmount = $currency === $userCurrency
                ? $amount
                : $this->currencyService->convert($amount, $currency, $userCurrency);

            $balanceAfter = $balanceBefore + $convertedAmount;

            $user->update(['balance' => $balanceAfter]);

            $transaction = UserTransaction::query()->create([
                'user_id' => $user->id,
                'type' => 'sale',
                'amount' => $amount,
                'currency' => $currency,
                'balance_before' => $balanceBefore,
                'balance_after' => $balanceAfter,
                'related_id' => $relatedId,
                'related_type' => $relatedType,
                'description' => 'Продажа товара',
                'status' => 'completed',
            ]);

            $this->clearBalanceCache($user);

            return $transaction;
        });
    }

    /**
     * Очистить кэш баланса
     */
    protected function clearBalanceCache(User $user): void
    {
        Cache::forget("user:{$user->id}");
        Cache::forget("user:balance:{$user->id}");
    }
}
