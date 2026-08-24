<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('subscriber_id'); // Кто подписан
            $table->uuid('user_id'); // На кого подписан
            $table->boolean('is_active')->default(true);
            $table->timestamp('subscribed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('subscriber_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->unique(
                ['subscriber_id', 'user_id'],
                'subscription_unique'
            );

            $table->index(['user_id', 'is_active']);
            $table->index('subscriber_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription');
    }
};
