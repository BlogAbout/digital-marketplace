<?php

namespace App\Modules\User\Services;

use App\Modules\Core\BaseService;
use App\Modules\User\Models\User;
use App\Modules\User\Repositories\UserRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class UserService extends BaseService
{
    protected function getRepositoryClass(): string
    {
        return UserRepository::class;
    }

    /**
     * Найти пользователя по email
     */
    public function findByEmail(string $email): ?User
    {
        return $this->repository->findByEmail($email);
    }

    /**
     * Найти пользователя по телефону
     */
    public function findByPhone(string $phone): ?User
    {
        return $this->repository->findByPhone($phone);
    }

    /**
     * Создать пользователя
     */
    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        $data['settings'] = [
            'theme' => $data['theme'] ?? 'light',
            'timezone' => $data['timezone'] ?? 'UTC',
            'locale' => $data['locale'] ?? 'ru',
        ];

        $user = $this->repository->create($data);

        Cache::forget("user:{$user->id}");

        return $user;
    }

    /**
     * Обновить пользователя
     */
    public function updateUser(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        if (isset($data['settings']) && is_array($data['settings'])) {
            $data['settings'] = array_merge($user->settings ?? [], $data['settings']);
        }

        $user->update($data);

        Cache::forget("user:{$user->id}");

        return $user->fresh();
    }

    /**
     * Получить пользователя с кэшированием
     */
    public function getUserWithCache(string $id): User
    {
        return Cache::remember("user:{$id}", 3600, function () use ($id) {
            return $this->repository->findOrFail($id);
        });
    }

    /**
     * Заблокировать пользователя
     */
    public function blockUser(User $user): User
    {
        $user->update(['is_block' => true]);
        Cache::forget("user:{$user->id}");
        return $user->fresh();
    }

    /**
     * Разблокировать пользователя
     */
    public function unblockUser(User $user): User
    {
        $user->update(['is_block' => false]);
        Cache::forget("user:{$user->id}");
        return $user->fresh();
    }

    /**
     * Обновить последнюю активность
     */
    public function updateLastActive(User $user): void
    {
        $user->update(['last_active' => now()]);
        Cache::forget("user:{$user->id}");
    }
}
