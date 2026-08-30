<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_product_comment', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('product_id');
            $table->uuid('user_id');
            $table->uuid('parent_id')->nullable(); // Для ответов на комментарии
            $table->text('content');
            $table->integer('rating')->nullable(); // Оценка от 1 до 5
            $table->boolean('is_approved')->default(true);
            $table->integer('likes_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')
                ->references('id')
                ->on('shop_product')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->foreign('parent_id')
                ->references('id')
                ->on('shop_product_comment')
                ->onDelete('cascade');

            $table->index(['product_id', 'created_at']);
            $table->index('parent_id');
            $table->index('is_approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_product_comment');
    }
};
