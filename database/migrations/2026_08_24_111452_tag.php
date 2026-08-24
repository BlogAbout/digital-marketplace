<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tag', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('type')->nullable(); // product, blog, post, user
            $table->integer('usage_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['type', 'usage_count']);
        });

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

            $table->unique(
                ['tag_id', 'taggable_id', 'taggable_type'],
                'taggable_unique'
            );

            $table->index(['taggable_id', 'taggable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taggable');
        Schema::dropIfExists('tag');
    }
};
