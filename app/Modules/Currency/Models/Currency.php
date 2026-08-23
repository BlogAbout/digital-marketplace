<?php

namespace App\Modules\Currency\Models;

use App\Modules\Core\BaseModel;

class Currency extends BaseModel
{
    /**
     * Название таблицы
     *
     * @var string
     */
    protected $table = 'currency';

    /**
     * Первичный ключ
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * Отключаем автоинкремент для строкового ключа
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Тип первичного ключа
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Атрибуты, которые можно массово присваивать
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id',
        'name',
        'symbol',
        'is_default',
        'rate',
    ];

    /**
     * Касты атрибутов
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_default' => 'boolean',
        'rate' => 'decimal:10',
    ];

    /**
     * Получить валюту по умолчанию
     *
     * @return static|null
     */
    public static function getDefault(): ?static
    {
        /** @var static|null $currency */
        $currency = self::query()->where('is_default', true)->first();
        return $currency;
    }

    /**
     * Конвертировать сумму из одной валюты в другую
     */
    public static function convert(float $amount, string $from, string $to): float
    {
        if ($from === $to) {
            return $amount;
        }

        $fromCurrency = self::query()->find($from);
        $toCurrency = self::query()->find($to);

        if (!$fromCurrency || !$toCurrency) {
            throw new \InvalidArgumentException("Currency not found: {$from} or {$to}");
        }

        // Конвертация через базовую валюту (USD)
        $amountInBase = $amount / (float) $fromCurrency->rate;
        return $amountInBase * (float) $toCurrency->rate;
    }
}
