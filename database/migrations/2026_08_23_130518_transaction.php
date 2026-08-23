<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_transaction', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('type'); // deposit, withdrawal, purchase, sale, refund, fee
            $table->decimal('amount', 20, 2);
            $table->string('currency', 3)->default('USD');
            $table->decimal('balance_before', 20, 2);
            $table->decimal('balance_after', 20, 2);
            $table->uuid('related_id')->nullable(); // ID связанной сущности
            $table->string('related_type')->nullable(); // Тип связанной сущности
            $table->string('description')->nullable();
            $table->json('metadata')->nullable();
            $table->string('status')->default('completed'); // pending, completed, failed, cancelled
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->index(['user_id', 'created_at']);
            $table->index(['type', 'status']);
            $table->index('currency');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_transaction');
    }
};
