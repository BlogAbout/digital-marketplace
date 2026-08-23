<?php

namespace App\Modules\User\Repositories;

use App\Modules\Core\BaseRepository;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository extends BaseRepository
{
    protected function getModelClass(): string
    {
        return User::class;
    }

    /**
     * Найти пользователя по email
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Найти пользователя по телефону
     */
    public function findByPhone(string $phone): ?User
    {
        return $this->model->where('phone', $phone)->first();
    }

    /**
     * Получить активных пользователей
     */
    public function getActiveUsers(): Collection
    {
        return $this->model
            ->where('is_block', false)
            ->whereNotNull('email_verified_at')
            ->get();
    }

    /**
     * Получить пользователей по роли
     */
    public function getByRole(string $role, int $perPage = 15): LengthAwarePaginator
    {
        return $this->model
            ->where('role', $role)
            ->paginate($perPage);
    }

    /**
     * Обновить последнюю активность
     */
    public function updateLastActive(User $user): bool
    {
        return $user->update(['last_active' => now()]);
    }
}
