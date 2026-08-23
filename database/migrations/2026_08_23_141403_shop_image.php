<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_image', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('product_id');
            $table->uuid('file_id');
            $table->string('type')->default('gallery'); // gallery, screenshot, cover
            $table->integer('sort_order')->default(0);
            $table->boolean('is_main')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')
                ->references('id')
                ->on('shop_product')
                ->onDelete('cascade');

            $table->foreign('file_id')
                ->references('id')
                ->on('file')
                ->onDelete('cascade');

            $table->index(['product_id', 'sort_order']);
            $table->index('is_main');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_image');
    }
};
