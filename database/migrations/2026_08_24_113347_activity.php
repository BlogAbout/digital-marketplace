<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('user_id'); // Чья активность
            $table->string('type'); // product_created, product_updated, post_published
            $table->uuid('subject_id')->nullable(); // ID сущности
            $table->string('subject_type')->nullable(); // Тип сущности
            $table->json('data')->nullable(); // Дополнительные данные
            $table->string('visibility')->default('public'); // public, followers, private
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->index(['user_id', 'created_at']);
            $table->index(['type', 'created_at']);
            $table->index(['subject_id', 'subject_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity');
    }
};
