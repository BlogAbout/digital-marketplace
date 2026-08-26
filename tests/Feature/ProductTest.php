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
    public function anyone_can_view_approved_products()
    {
        $category = ShopCategory::factory()->create();

        $product = ShopProduct::factory()->create([
            'category_id' => $category->id,
            'status' => 'approved',
        ]);

        $response = $this->getJson('/api/shop/products');

        $response->assertStatus(200);
    }

    /** @test */
    public function authenticated_user_can_create_product()
    {
        $user = User::factory()->create();
        $category = ShopCategory::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/shop/products', [
                'category_id' => $category->id,
                'name' => 'Test Product',
                'description' => 'Test description for product',
                'cost' => 100,
                'currency' => 'USD',
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'product' => [
                    'name' => 'Test Product',
                    'status' => 'pending',
                ],
            ]);
    }

    /** @test */
    public function user_can_update_own_product()
    {
        $user = User::factory()->create();
        $category = ShopCategory::factory()->create();

        $product = ShopProduct::factory()->create([
            'author_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $response = $this->actingAs($user)
            ->putJson("/api/shop/products/{$product->id}", [
                'name' => 'Updated Product',
            ]);

        $response->assertStatus(200);
    }

    /** @test */
    public function admin_can_approve_product()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = ShopCategory::factory()->create();

        $product = ShopProduct::factory()->create([
            'category_id' => $category->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)
            ->postJson("/api/shop/products/{$product->id}/approve");

        $response->assertStatus(200);
    }
}
