<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('message', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('chat_id');
            $table->uuid('user_id'); // Отправитель
            $table->uuid('reply_to_id')->nullable(); // Ответ на сообщение (цитата)
            $table->uuid('forward_from_id')->nullable(); // Переслано из сообщения
            $table->uuid('thread_id')->nullable(); // ID треда (если это обсуждение)
            $table->text('text')->nullable();
            $table->json('media')->nullable(); // Медиа файлы
            $table->json('mentions')->nullable(); // Упоминания пользователей
            $table->json('reactions')->nullable(); // Реакции
            $table->json('metadata')->nullable(); // Дополнительные данные
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_edited')->default(false);
            $table->timestamp('edited_at')->nullable();
            $table->timestamp('self_destruct_at')->nullable(); // Самоудаляющееся сообщение
            $table->timestamp('deleted_at')->nullable(); // Мягкое удаление
            $table->timestamps();

            $table->foreign('chat_id')
                ->references('id')
                ->on('chat')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->foreign('reply_to_id')
                ->references('id')
                ->on('message')
                ->onDelete('set null');

            $table->index(['chat_id', 'created_at']);
            $table->index(['thread_id', 'created_at']);
            $table->index('is_pinned');
            $table->index('self_destruct_at');
        });

        // Статусы прочтения сообщений
        Schema::create('message_read', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('message_id');
            $table->uuid('user_id');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->foreign('message_id')
                ->references('id')
                ->on('message')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->unique(['message_id', 'user_id'], 'message_read_unique');
            $table->index(['user_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('message_read');
        Schema::dropIfExists('message');
    }
};
