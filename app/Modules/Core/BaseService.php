<?php

namespace App\Modules\Core;

/**
 * @template TRepository of BaseRepository
 */
abstract class BaseService
{
    /**
     * @var TRepository
     */
    protected BaseRepository $repository;

    /**
     * @return class-string<TRepository>
     */
    abstract protected function getRepositoryClass(): string;

    public function __construct()
    {
        /** @var TRepository $repository */
        $repository = app($this->getRepositoryClass());
        $this->repository = $repository;
    }
}
