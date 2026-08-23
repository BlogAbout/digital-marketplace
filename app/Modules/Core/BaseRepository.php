<?php

namespace App\Modules\Core;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @template TModel of Model
 */
abstract class BaseRepository
{
    /**
     * @var TModel
     */
    protected Model $model;

    /**
     * @return class-string<TModel>
     */
    abstract protected function getModelClass(): string;

    public function __construct()
    {
        /** @var TModel $model */
        $model = app($this->getModelClass());
        $this->model = $model;
    }

    /**
     * @return Builder<TModel>
     */
    protected function newQuery(): Builder
    {
        /** @var Builder<TModel> $query */
        $query = $this->model->newQuery();

        return $query;
    }

    /**
     * @return TModel|null
     */
    public function find(string $id): ?Model
    {
        /** @var TModel|null $result */
        $result = $this->newQuery()->find($id);

        return $result;
    }

    /**
     * @return TModel
     */
    public function findOrFail(string $id): Model
    {
        /** @var TModel $result */
        $result = $this->newQuery()->findOrFail($id);

        return $result;
    }

    /**
     * @param  array<string, mixed>  $data
     * @return TModel
     */
    public function create(array $data): Model
    {
        /** @var TModel $result */
        $result = $this->newQuery()->create($data);

        return $result;
    }

    /**
     * @param  TModel  $model
     * @param  array<string, mixed>  $data
     */
    public function update(Model $model, array $data): bool
    {
        return $model->update($data);
    }

    /**
     * @param  TModel  $model
     */
    public function delete(Model $model): bool
    {
        return $model->delete();
    }

    /**
     * @return LengthAwarePaginator<int, TModel>
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, TModel> $result */
        $result = $this->newQuery()->paginate($perPage);

        return $result;
    }

    /**
     * @return Collection<int, TModel>
     */
    public function all(): Collection
    {
        /** @var Collection<int, TModel> $result */
        $result = $this->newQuery()->get();

        return $result;
    }

    /**
     * @return Builder<TModel>
     */
    public function query(): Builder
    {
        return $this->newQuery();
    }
}
