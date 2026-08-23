<?php

use Illuminate\Support\Facades\Schema;

if (!function_exists('table_exists')) {
    /**
     * Проверить существование таблицы
     */
    function table_exists(string $table): bool
    {
        return Schema::hasTable($table);
    }
}

if (!function_exists('get_table_name')) {
    /**
     * Получить название таблицы из модели
     */
    function get_table_name(string $modelClass): string
    {
        $model = app($modelClass);
        return $model->getTable();
    }
}
