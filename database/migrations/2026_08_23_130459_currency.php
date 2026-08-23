<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('currency', function (Blueprint $table) {
            $table->string('id')->primary(); // Код валюты: USD, EUR, RUB
            $table->string('name')->nullable();
            $table->string('symbol')->nullable();
            $table->boolean('is_default')->default(false);
            $table->decimal('rate', 20, 10)->default(1);
            $table->timestamps();
            $table->softDeletes();
        });

        // Начальные валюты
        DB::table('currency')->insert([
            [
                'id' => 'USD',
                'name' => 'US Dollar',
                'symbol' => '$',
                'is_default' => true,
                'rate' => 1.0000000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'EUR',
                'name' => 'Euro',
                'symbol' => '€',
                'is_default' => false,
                'rate' => 0.9200000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'RUB',
                'name' => 'Russian Ruble',
                'symbol' => '₽',
                'is_default' => false,
                'rate' => 90.5000000000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('currency');
    }
};
