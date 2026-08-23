<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('phone')->unique()->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->timestamp('last_active')->nullable();
            $table->boolean('is_block')->default(false);
            $table->string('slogan')->nullable();
            $table->text('description')->nullable();
            $table->json('settings')->nullable();
            $table->decimal('balance', 20, 2)->default(0);
            $table->uuid('avatar_id')->nullable();
            $table->enum('role', ['user', 'moderator', 'admin'])->default('user');
            $table->string('remember_token', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('role');
            $table->index('is_block');
            $table->index('last_active');
        });

        Schema::create('password_reset_token', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('session', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->uuid('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session');
        Schema::dropIfExists('password_reset_token');
        Schema::dropIfExists('user');
    }
};
