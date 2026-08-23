<?php

namespace App\Modules\User\Repositories;

use App\Modules\Core\BaseRepository;
use App\Modules\User\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @extends BaseRepository<User>
 */
class UserRepository extends BaseRepository
{
    /**
     * @return class-string<User>
     */
    protected function getModelClass(): string
    {
        return User::class;
    }

    /**
     * Найти пользователя по email
     */
    public function findByEmail(string $email): ?User
    {
        /** @var User|null $user */
        $user = $this->query()
            ->where('email', $email)
            ->first();

        return $user;
    }

    /**
     * Найти пользователя по телефону
     */
    public function findByPhone(string $phone): ?User
    {
        /** @var User|null $user */
        $user = $this->query()
            ->where('phone', $phone)
            ->first();

        return $user;
    }

    /**
     * Получить активных пользователей
     *
     * @return Collection<int, User>
     */
    public function getActiveUsers(): Collection
    {
        /** @var Collection<int, User> $users */
        $users = $this->query()
            ->where('is_block', false)
            ->whereNotNull('email_verified_at')
            ->get();

        return $users;
    }

    /**
     * Получить пользователей по роли
     *
     * @return LengthAwarePaginator<int, User>
     */
    public function getByRole(string $role, int $perPage = 15): LengthAwarePaginator
    {
        /** @var LengthAwarePaginator<int, User> $users */
        $users = $this->query()
            ->where('role', $role)
            ->paginate($perPage);

        return $users;
    }

    /**
     * Обновить последнюю активность
     */
    public function updateLastActive(User $user): bool
    {
        return $user->update(['last_active' => now()]);
    }
}
