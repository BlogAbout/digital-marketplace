<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_order', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->uuid('seller_id');
            $table->uuid('buyer_id');
            $table->string('currency', 3)->default('USD');
            $table->boolean('is_free')->default(false);
            $table->decimal('cost', 20, 2);
            $table->decimal('tax', 20, 2)->default(0);
            $table->decimal('discount', 20, 2)->default(0);
            $table->decimal('sum', 20, 2);
            $table->decimal('total', 20, 2);
            $table->string('status')->default('pending'); // pending, paid, completed, cancelled, refunded
            $table->string('payment_type')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('file_link')->nullable();
            $table->timestamp('file_expired')->nullable();
            $table->string('domain')->nullable();
            $table->string('api_key')->nullable();
            $table->string('notify_status')->default('pending'); // pending, sent, failed
            $table->uuid('promo_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')
                ->references('id')
                ->on('shop_product')
                ->onDelete('restrict');

            $table->foreign('seller_id')
                ->references('id')
                ->on('user')
                ->onDelete('restrict');

            $table->foreign('buyer_id')
                ->references('id')
                ->on('user')
                ->onDelete('restrict');

            $table->foreign('promo_id')
                ->references('id')
                ->on('shop_promo')
                ->onDelete('set null');

            $table->index(['buyer_id', 'created_at']);
            $table->index(['seller_id', 'created_at']);
            $table->index('status');
            $table->index('paid_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_order');
    }
};
