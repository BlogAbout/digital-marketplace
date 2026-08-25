<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Ежедневная статистика по товарам
        Schema::create('product_statistic', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('product_id');
            $table->date('date');
            $table->integer('views_count')->default(0);
            $table->integer('unique_views_count')->default(0);
            $table->integer('sales_count')->default(0);
            $table->decimal('revenue', 20, 2)->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0);
            $table->timestamps();

            $table->foreign('product_id')
                ->references('id')
                ->on('shop_product')
                ->onDelete('cascade');

            $table->unique(['product_id', 'date'], 'product_statistic_unique');
            $table->index(['date', 'views_count']);
        });

        // Ежедневная статистика по пользователям
        Schema::create('user_statistic', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->uuid('user_id');
            $table->date('date');
            $table->integer('views_count')->default(0);
            $table->integer('sales_count')->default(0);
            $table->decimal('revenue', 20, 2)->default(0);
            $table->integer('followers_count')->default(0);
            $table->integer('new_followers_count')->default(0);
            $table->timestamps();

            $table->foreign('user_id')
                ->references('id')
                ->on('user')
                ->onDelete('cascade');

            $table->unique(['user_id', 'date'], 'user_statistic_unique');
            $table->index(['date', 'revenue']);
        });

        // Общая ежедневная статистика
        Schema::create('daily_statistic', function (Blueprint $table) {
            $table->uuid('id');
            $table->primary('id');

            $table->date('date');
            $table->integer('total_views')->default(0);
            $table->integer('total_sales')->default(0);
            $table->decimal('total_revenue', 20, 2)->default(0);
            $table->integer('new_users_count')->default(0);
            $table->integer('active_users_count')->default(0);
            $table->timestamps();

            $table->unique('date', 'daily_statistic_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_statistic');
        Schema::dropIfExists('user_statistic');
        Schema::dropIfExists('product_statistic');
    }
};
