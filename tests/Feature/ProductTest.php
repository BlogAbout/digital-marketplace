<?php

namespace Tests\Feature;

use App\Modules\Shop\Models\ShopCategory;
use App\Modules\Shop\Models\ShopProduct;
use App\Modules\User\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /** @test */
    public function anyone_can_view_products()
    {
        $category = ShopCategory::factory()->create();

        ShopProduct::factory()->count(3)->create([
            'category_id' => $category->id,
            'status' => 'approved',
        ]);

        $response = $this->getJson('/api/shop/products');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                    ],
                ],
            ]);
    }

    /** @test */
    public function authenticated_user_can_create_product()
    {
        $user = User::factory()->create();
        $category = ShopCategory::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/shop/products', [
                'category_id' => $category->id,
                'name' => 'Test Product',
                'description' => 'Test description for product',
                'cost' => 100,
                'currency' => 'USD',
            ]);

        $response->assertStatus(201);
    }

    /** @test */
    public function admin_can_approve_product()
    {
        $admin = User::factory()->admin()->create();
        $category = ShopCategory::factory()->create();

        $product = ShopProduct::factory()->create([
            'category_id' => $category->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/shop/products/{$product->id}/approve");

        $response->assertStatus(200);
    }
}
