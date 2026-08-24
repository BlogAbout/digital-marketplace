<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notification', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('user_id'); // Кому уведомление
            $table->string('type'); // email, toast, push
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable();
            $table->string('icon')->nullable();
            $table->string('url')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->string('status')->default('pending'); // pending, sent, read, failed
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->index(['user_id', 'read_at']);
            $table->index(['user_id', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notification');
    }
};
