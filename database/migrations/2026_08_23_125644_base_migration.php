<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Таблица валют
        Schema::create('currency', function (Blueprint $table) {
            $table->string('id')->primary(); // Код валюты (USD, EUR, RUB)
            $table->string('name')->nullable();
            $table->string('symbol')->nullable();
            $table->boolean('is_default')->default(false);
            $table->decimal('rate', 20, 10)->default(1);
            $table->timestamps();
            $table->softDeletes();
        });

        // Таблица файлов
        Schema::create('file', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('original_name');
            $table->string('mime_type');
            $table->bigInteger('size');
            $table->string('path');
            $table->string('disk')->default('public');
            $table->string('type')->nullable(); // avatar, product, gallery, message, blog
            $table->uuid('author_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('author_id')
                ->references('id')
                ->on('user')
                ->onDelete('set null');
        });

        // Таблица тегов
        Schema::create('tag', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        // Полиморфная таблица для тегов
        Schema::create('taggable', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tag_id');
            $table->uuid('taggable_id');
            $table->string('taggable_type');
            $table->timestamps();

            $table->foreign('tag_id')
                ->references('id')
                ->on('tag')
                ->onDelete('cascade');

            $table->unique(['tag_id', 'taggable_id', 'taggable_type'], 'taggable_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taggable');
        Schema::dropIfExists('tag');
        Schema::dropIfExists('file');
        Schema::dropIfExists('currency');
    }
};
