<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_product', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('category_id');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('currency', 3)->default('USD');
            $table->boolean('is_free')->default(false);
            $table->decimal('cost', 20, 2)->nullable();
            $table->decimal('cost_old', 20, 2)->nullable();
            $table->uuid('author_id');
            $table->uuid('file_id')->nullable();
            $table->string('status')->default('draft'); // draft, pending, approved, rejected, suspended
            $table->uuid('avatar_id')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->json('fields')->nullable();
            $table->json('violation')->nullable();
            $table->boolean('is_link_domain')->default(false);
            $table->uuid('api_key_id')->nullable();
            $table->boolean('is_infinity_download')->default(false);
            $table->integer('file_days_expired')->default(30);
            $table->string('access_update')->default('free'); // free, paid, none
            $table->decimal('update_discount', 5, 2)->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('sales_count')->default(0);
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')
                ->references('id')
                ->on('shop_category')
                ->onDelete('restrict');

            $table->foreign('author_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->index(['category_id', 'status']);
            $table->index('author_id');
            $table->index('is_free');
            $table->index('cost');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_product');
    }
};
