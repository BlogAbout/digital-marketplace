<?php

namespace Database\Seeders;

use App\Modules\User\Models\User;
use App\Modules\Shop\Models\ShopCategory;
use App\Modules\Shop\Models\ShopProduct;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\Uid\UuidV7;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Создать тестового пользователя
        $user = User::create([
            'id' => (string) UuidV7::generate(),
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
            'role' => 'user',
            'balance' => 1000,
            'settings' => json_encode([
                'theme' => 'light',
                'timezone' => 'UTC',
                'locale' => 'ru',
            ]),
        ]);

        // Создать категории
        $categories = [
            ['name' => 'Скрипты', 'slug' => 'scripts'],
            ['name' => 'Шаблоны', 'slug' => 'templates'],
            ['name' => 'Плагины', 'slug' => 'plugins'],
            ['name' => 'Графика', 'slug' => 'graphics'],
        ];

        foreach ($categories as $categoryData) {
            ShopCategory::create([
                'id' => (string) UuidV7::generate(),
                'name' => $categoryData['name'],
                'slug' => $categoryData['slug'],
                'description' => 'Описание категории ' . $categoryData['name'],
                'is_active' => true,
                'sort_order' => 0,
            ]);
        }

        // Создать товары
        $category = ShopCategory::where('slug', 'scripts')->first();

        for ($i = 1; $i <= 5; $i++) {
            ShopProduct::create([
                'id' => (string) UuidV7::generate(),
                'category_id' => $category->id,
                'author_id' => $user->id,
                'name' => "Тестовый товар {$i}",
                'slug' => "test-product-{$i}",
                'description' => "Описание тестового товара {$i}",
                'currency' => 'USD',
                'is_free' => false,
                'cost' => $i * 100,
                'status' => 'approved',
                'views_count' => $i * 10,
                'sales_count' => $i,
                'file_days_expired' => 30,
                'is_infinity_download' => false,
                'is_link_domain' => false,
                'access_update' => 'free',
                'approved_at' => now(),
            ]);
        }

        $this->command->info('Тестовые данные созданы!');
        $this->command->info('Email: test@example.com');
        $this->command->info('Password: password123');
    }
}
