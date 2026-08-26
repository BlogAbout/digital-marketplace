<?php

namespace App\Modules\Shop\Models\Schemas;

use OpenApi\Attributes as OA;

#[OA\Schema(
    schema: 'Product',
    title: 'Product',
    description: 'Модель товара',
    properties: [
        new OA\Property(property: 'id', type: 'string', format: 'uuid'),
        new OA\Property(property: 'name', type: 'string'),
        new OA\Property(property: 'slug', type: 'string'),
        new OA\Property(property: 'description', type: 'string'),
        new OA\Property(property: 'currency', type: 'string'),
        new OA\Property(property: 'is_free', type: 'boolean'),
        new OA\Property(property: 'cost', type: 'number', format: 'float'),
        new OA\Property(property: 'status', type: 'string'),
        new OA\Property(property: 'views_count', type: 'integer'),
        new OA\Property(property: 'sales_count', type: 'integer'),
        new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
        new OA\Property(property: 'updated_at', type: 'string', format: 'date-time')
    ]
)]
class ProductSchema
{
}
