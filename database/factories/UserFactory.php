<?php

namespace Database\Factories;

use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Symfony\Component\Uid\UuidV7;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'id' => (string) UuidV7::generate(),
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password123'),
            'phone' => $this->faker->phoneNumber(),
            'is_block' => false,
            'role' => 'user',
            'balance' => 0,
            'settings' => json_encode([
                'theme' => 'light',
                'timezone' => 'UTC',
                'locale' => 'ru',
            ]),
            'remember_token' => Str::random(10),
        ];
    }
}
