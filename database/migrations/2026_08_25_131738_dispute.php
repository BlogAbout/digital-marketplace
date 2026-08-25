<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dispute', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('order_id'); // Спорный заказ
            $table->uuid('buyer_id'); // Покупатель
            $table->uuid('seller_id'); // Продавец
            $table->string('reason'); // Причина спора
            $table->text('description');
            $table->string('status')->default('open'); // open, under_review, resolved, closed, rejected
            $table->string('resolution')->nullable(); // refund, partial_refund, no_refund, other
            $table->text('resolution_note')->nullable();
            $table->decimal('refund_amount', 20, 2)->nullable();
            $table->uuid('resolved_by')->nullable(); // Кто разрешил спор
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('order_id')
                ->references('id')
                ->on('shop_order')
                ->onDelete('cascade');

            $table->foreign('buyer_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->foreign('seller_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->foreign('resolved_by')
                ->references('id')
                ->on('user')
                ->onDelete('set null');

            $table->index(['status', 'created_at']);
            $table->index('order_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dispute');
    }
};
