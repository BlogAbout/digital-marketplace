<?php

namespace App\Modules\User\Services;

use App\Modules\Core\Services\ElasticsearchService;
use App\Modules\User\Models\User;

class UserIndexingService
{
    public function __construct(
        private readonly ElasticsearchService $elasticsearch
    ) {}

    /**
     * Индексировать пользователя
     */
    public function indexUser(User $user): bool
    {
        $body = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'slogan' => $user->slogan,
            'description' => $user->description,
            'role' => $user->role,
            'is_block' => $user->is_block,
            'last_active' => $user->last_active?->toISOString(),
            'created_at' => $user->created_at?->toISOString(),
        ];

        return $this->elasticsearch->indexDocument('users', $user->id, $body);
    }

    /**
     * Переиндексировать всех пользователей
     */
    public function reindexAllUsers(): int
    {
        $this->elasticsearch->deleteIndex('users');
        $this->elasticsearch->createIndex('users');

        $count = 0;

        User::query()
            ->where('is_block', false)
            ->chunk(100, function ($users) use (&$count) {
                foreach ($users as $user) {
                    $this->indexUser($user);
                    $count++;
                }
            });

        return $count;
    }

    /**
     * Поиск пользователей
     *
     * @return array<string, mixed>
     */
    public function searchUsers(string $query, int $page = 1, int $perPage = 20): array
    {
        $from = ($page - 1) * $perPage;

        $searchQuery = [
            'query' => [
                'bool' => [
                    'must' => [
                        'multi_match' => [
                            'query' => $query,
                            'fields' => ['name^3', 'email^2', 'slogan', 'description'],
                            'type' => 'best_fields',
                            'fuzziness' => 'AUTO',
                        ],
                    ],
                    'filter' => [
                        'term' => ['is_block' => false],
                    ],
                ],
            ],
            'sort' => [
                ['last_active' => ['order' => 'desc']],
            ],
            'highlight' => [
                'fields' => [
                    'name' => ['number_of_fragments' => 0],
                    'description' => ['number_of_fragments' => 2],
                ],
            ],
        ];

        return $this->elasticsearch->search('users', $searchQuery, $from, $perPage);
    }
}
