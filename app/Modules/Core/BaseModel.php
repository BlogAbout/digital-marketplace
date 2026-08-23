<?php

namespace App\Modules\Core;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Symfony\Component\Uid\UuidV7;

/**
 * @method static \Illuminate\Database\Eloquent\Builder query()
 * @method static static find(string $id)
 * @method static static findOrFail(string $id)
 * @method static static create(array $attributes = [])
 * @method static static firstOrCreate(array $attributes, array $values = [])
 * @method static static firstOrNew(array $attributes, array $values = [])
 * @method static static updateOrCreate(array $attributes, array $values = [])
 * @method static \Illuminate\Database\Eloquent\Collection|static[] all()
 * @method static \Illuminate\Database\Eloquent\Collection|static[] get()
 * @method static static|null first()
 * @method static static|null firstWhere(string $column, mixed $value)
 * @method static \Illuminate\Pagination\LengthAwarePaginator paginate(int $perPage = 15)
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
