<?php

namespace Database\Factories\Modules\Shop\Models;

use App\Modules\Shop\Models\ShopCategory;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Symfony\Component\Uid\UuidV7;

class ShopProductFactory extends Factory
{
    protected $model = ShopProduct::class;

    public function definition(): array
    {
        return [
            'id' => (string) UuidV7::generate(),
            'category_id' => ShopCategory::factory(),
            'author_id' => User::factory(),
            'name' => $this->faker->unique()->words(3, true),
            'slug' => $this->faker->unique()->slug(),
            'description' => $this->faker->paragraph(),
            'currency' => 'USD',
            'is_free' => false,
            'cost' => $this->faker->randomFloat(2, 10, 1000),
            'status' => 'draft',
            'views_count' => 0,
            'sales_count' => 0,
            'file_days_expired' => 30,
            'is_infinity_download' => false,
            'is_link_domain' => false,
            'access_update' => 'free',
        ];
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_at' => now(),
        ]);
    }
}
