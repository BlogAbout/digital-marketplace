<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_promo', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->uuid('product_id');
            $table->uuid('author_id');
            $table->string('type')->default('percent'); // percent, fixed
            $table->decimal('value', 20, 2);
            $table->boolean('is_multiple')->default(false); // Многоразовый
            $table->integer('max_uses')->nullable();
            $table->integer('used_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')
                ->references('id')
                ->on('shop_product')
                ->onDelete('cascade');

            $table->foreign('author_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->index(['product_id', 'is_active']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_promo');
    }
};
