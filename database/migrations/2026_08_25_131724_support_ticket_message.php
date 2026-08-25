<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('support_ticket_message', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('ticket_id');
            $table->uuid('user_id'); // Отправитель
            $table->text('message');
            $table->json('attachments')->nullable();
            $table->boolean('is_internal')->default(false); // Внутреннее сообщение (только для персонала)
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('ticket_id')
                ->references('id')
                ->on('support_ticket')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->index(['ticket_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_ticket_message');
    }
};
