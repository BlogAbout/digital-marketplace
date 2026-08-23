<?php

namespace App\Modules\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Symfony\Component\Uid\UuidV7;

abstract class BaseModel extends Model
{
    use SoftDeletes;

    /**
     * Название таблицы в единственном числе
     *
     * @var string
     */
    protected $table;

    /**
     * Тип первичного ключа
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Отключаем автоинкремент
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Атрибуты, которые можно массово присваивать
     *
     * @var array<string>
     */
    protected $fillable = [];

    /**
     * Атрибуты, которые нужно скрыть из массива/JSON
     *
     * @var array<string>
     */
    protected $hidden = [];

    /**
     * Атрибуты, которые нужно привести к определенным типам
     *
     * @var array<string, string>
     */
    protected $casts = [];

    /**
     * Boot the model
     */
    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Model $model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) UuidV7::generate();
            }
        });
    }

    /**
     * Получить название таблицы
     */
    public function getTable(): string
    {
        if (empty($this->table)) {
            throw new \RuntimeException(
                sprintf('Table name is not defined in model [%s]', static::class)
            );
        }

        return $this->table;
    }
}
