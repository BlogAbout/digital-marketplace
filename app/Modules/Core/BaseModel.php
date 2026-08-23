<?php

namespace App\Modules\Core;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\Uid\UuidV7;

/**
 * @method static Builder<static> query()
 * @method static static|null find(string $id)
 * @method static static findOrFail(string $id)
 * @method static static create(array<string, mixed> $attributes = [])
 * @method static static firstOrCreate(array<string, mixed> $attributes, array<string, mixed> $values = [])
 * @method static static firstOrNew(array<string, mixed> $attributes, array<string, mixed> $values = [])
 * @method static static updateOrCreate(array<string, mixed> $attributes, array<string, mixed> $values = [])
 * @method static Collection<int, static> all()
 * @method static Collection<int, static> get()
 * @method static static|null first()
 * @method static static|null firstWhere(string $column, mixed $value)
 * @method static LengthAwarePaginator<int, static> paginate(int $perPage = 15)
 */
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
     * @var array<int, string>
     */
    protected $fillable = [];

    /**
     * Атрибуты, которые нужно скрыть из массива/JSON
     *
     * @var array<int, string>
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
