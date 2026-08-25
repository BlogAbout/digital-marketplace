<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_ticket', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('user_id'); // Пользователь, создавший тикет
            $table->uuid('assigned_to')->nullable(); // Модератор/админ, ответственный за тикет
            $table->string('subject');
            $table->text('description');
            $table->string('status')->default('open'); // open, in_progress, resolved, closed
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->string('category')->default('general'); // general, technical, billing, other
            $table->uuid('related_order_id')->nullable(); // Связанный заказ
            $table->uuid('related_product_id')->nullable(); // Связанный товар
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->foreign('assigned_to')
                ->references('id')
                ->on('user')
                ->onDelete('set null');

            $table->index(['status', 'priority']);
            $table->index('user_id');
            $table->index('assigned_to');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_ticket');
    }
};
