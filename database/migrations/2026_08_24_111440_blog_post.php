<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_post', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('blog_id');
            $table->uuid('author_id');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->uuid('cover_id')->nullable();
            $table->string('status')->default('draft'); // draft, published, archived
            $table->timestamp('published_at')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->json('fields')->nullable();
            $table->integer('views_count')->default(0);
            $table->integer('likes_count')->default(0);
            $table->integer('comments_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('blog_id')
                ->references('id')
                ->on('blog')
                ->onDelete('cascade');

            $table->foreign('author_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->index(['blog_id', 'status']);
            $table->index('published_at');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_post');
    }
};
