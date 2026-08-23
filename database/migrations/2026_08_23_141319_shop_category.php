<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shop_category', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('category_id')->nullable(); // Родительская категория
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('slogan')->nullable();
            $table->text('description')->nullable();
            $table->uuid('author_id')->nullable();
            $table->uuid('avatar_id')->nullable();
            $table->uuid('cover_id')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->json('fields')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')
                ->references('id')
                ->on('shop_category')
                ->onDelete('set null');

            $table->foreign('author_id')
                ->references('id')
                ->on('user')
                ->onDelete('set null');

            $table->index(['category_id', 'sort_order']);
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shop_category');
    }
};
