<?php

namespace Database\Factories;

use App\Modules\Shop\Models\ShopCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Symfony\Component\Uid\UuidV7;

class ShopCategoryFactory extends Factory
{
    protected $model = ShopCategory::class;

    public function definition(): array
    {
        return [
            'id' => (string) UuidV7::generate(),
            'name' => $this->faker->unique()->word(),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->sentence(),
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
