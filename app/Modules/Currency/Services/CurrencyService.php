<?php

namespace App\Modules\Currency\Services;

use App\Modules\Currency\Models\Currency;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CurrencyService
{
    /**
     * Получить все валюты с кэшированием
     *
     * @return Collection<int, Currency>
     */
    public function getAllCurrencies(): Collection
    {
        return Cache::remember('currencies:all', 3600, function () {
            return Currency::query()->orderBy('is_default', 'desc')->get();
        });
    }

    /**
     * Получить валюту по коду
     */
    public function getCurrency(string $code): ?Currency
    {
        /** @var Currency|null $currency */
        $currency = Cache::remember("currency:{$code}", 3600, function () use ($code) {
            return Currency::query()->find($code);
        });

        return $currency;
    }

    /**
     * Обновить курсы валют
     *
     * @return array<string, float>
     */
    public function updateRates(): array
    {
        $rates = $this->fetchRatesFromApi();

        foreach ($rates as $code => $rate) {
            Currency::query()->updateOrCreate(
                ['id' => $code],
                [
                    'rate' => $rate,
                    'updated_at' => now(),
                ]
            );
        }

        // Очистить кэш
        Cache::forget('currencies:all');
        foreach ($rates as $code => $rate) {
            Cache::forget("currency:{$code}");
        }

        return $rates;
    }

    /**
     * Получить курсы из API
     *
     * @return array<string, float>
     */
    protected function fetchRatesFromApi(): array
    {
        try {
            // Основной источник
            $response = Http::timeout(10)->get('https://open.er-api.com/v6/latest/USD');

            if ($response->successful()) {
                $data = $response->json();

                return $data['rates'] ?? [];
            }
        } catch (\Exception $e) {
            Log::warning('Failed to fetch rates from primary source: ' . $e->getMessage());
        }

        try {
            // Запасной источник
            $response = Http::timeout(10)->get('https://api.exchangerate-api.com/v4/latest/USD');

            if ($response->successful()) {
                $data = $response->json();

                return $data['rates'] ?? [];
            }
        } catch (\Exception $e) {
            Log::warning('Failed to fetch rates from secondary source: ' . $e->getMessage());
        }

        // Если оба источника недоступны, вернуть текущие курсы
        /** @var array<string, float> $currentRates */
        $currentRates = Currency::query()->pluck('rate', 'id')->toArray();

        return $currentRates;
    }

    /**
     * Конвертировать сумму
     */
    public function convert(float $amount, string $from, string $to): float
    {
        return Currency::convert($amount, $from, $to);
    }

    /**
     * Получить валюту по умолчанию
     */
    public function getDefaultCurrency(): Currency
    {
        /** @var Currency|null $currency */
        $currency = Currency::getDefault();

        if (! $currency) {
            /** @var Currency|null $currency */
            $currency = Currency::query()->first();
        }

        if (! $currency) {
            throw new \RuntimeException('No currencies available');
        }

        return $currency;
    }
}
