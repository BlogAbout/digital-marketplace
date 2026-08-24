<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->string('type')->default('private'); // private, group, company, support
            $table->string('name')->nullable(); // Для групповых чатов
            $table->uuid('owner_id')->nullable(); // Создатель группового чата
            $table->uuid('company_id')->nullable(); // Для чатов с компанией
            $table->uuid('last_message_id')->nullable();
            $table->text('description')->nullable();
            $table->uuid('avatar_id')->nullable();
            $table->json('settings')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('owner_id')
                ->references('id')
                ->on('user')
                ->onDelete('set null');

            $table->index(['type', 'is_active']);
            $table->index('last_message_id');
        });

        // Участники чатов
        Schema::create('chat_participant', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('chat_id');
            $table->uuid('user_id');
            $table->string('role')->default('member'); // owner, admin, member
            $table->boolean('is_muted')->default(false);
            $table->timestamp('last_read_at')->nullable();
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('left_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('chat_id')
                ->references('id')
                ->on('chat')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->unique(['chat_id', 'user_id'], 'chat_participant_unique');
            $table->index(['user_id', 'is_muted']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_participant');
        Schema::dropIfExists('chat');
    }
};
