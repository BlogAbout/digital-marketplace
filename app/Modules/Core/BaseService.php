<?php

namespace App\Modules\Core;

abstract class BaseService
{
    protected $repository;

    abstract protected function getRepositoryClass(): string;

    public function __construct()
    {
        $this->repository = app($this->getRepositoryClass());
    }
}
