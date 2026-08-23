<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
            $table->uuid('fileable_id')->nullable();
            $table->string('fileable_type')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('author_id')
                ->references('id')
                ->on('user')
                ->onDelete('set null');

            $table->index(['fileable_id', 'fileable_type']);
            $table->index('type');
            $table->index('disk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file');
    }
};
